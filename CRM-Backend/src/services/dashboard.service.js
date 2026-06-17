import prisma from '../lib/prisma.js'
import { formatCurrencyBr } from '../utils/currency.js'

const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const PeriodosPermitidos = [3, 6, 12]

const parseMeses = (value) => {
  const parsed = Number(value)
  if (!value || Number.isNaN(parsed)) return 6
  return PeriodosPermitidos.includes(parsed) ? parsed : 6
}

const getPeriodBounds = (meses) => {
  const now = new Date()
  const dataInicio = new Date(now.getFullYear(), now.getMonth() - (meses - 1), 1)
  const dataFim = new Date(now)
  dataFim.setHours(23, 59, 59, 999)
  return { dataInicio, dataFim }
}

export const getDashboardStats = async (query = {}) => {
  const meses = parseMeses(query.meses)
  const { dataInicio, dataFim } = getPeriodBounds(meses)

  const leadWhere = {
    dataCadastro: { gte: dataInicio, lte: dataFim },
  }

  const oportunidadeWhere = {
    dataCriacao: { gte: dataInicio, lte: dataFim },
  }

  const etapaFechado = await prisma.etapaFunil.findFirst({ where: { nome: 'Fechado' } })

  const [
    totalLeads,
    leadsAtivos,
    totalOportunidades,
    oportunidadesFechadas,
    leads,
    oportunidadesAbertas,
    emNegociacao,
  ] = await Promise.all([
    prisma.lead.count({ where: leadWhere }),
    prisma.lead.count({ where: { ...leadWhere, status: 'Ativo' } }),
    prisma.oportunidade.count({ where: oportunidadeWhere }),
    prisma.oportunidade.findMany({
      where: {
        ...oportunidadeWhere,
        etapaFunil: { nome: 'Fechado' },
      },
      select: { valorEstimado: true },
    }),
    prisma.lead.findMany({
      where: leadWhere,
      select: { dataCadastro: true, status: true },
      orderBy: { dataCadastro: 'desc' },
    }),
    etapaFechado
      ? prisma.oportunidade.count({
          where: {
            ...oportunidadeWhere,
            etapaFunilId: { not: etapaFechado.id },
          },
        })
      : prisma.oportunidade.count({ where: oportunidadeWhere }),
    prisma.oportunidade.count({
      where: {
        ...oportunidadeWhere,
        etapaFunil: { nome: 'Negociação' },
      },
    }),
  ])

  const leadsInativos = totalLeads - leadsAtivos
  const ativosPercentual = totalLeads > 0 ? Math.round((leadsAtivos / totalLeads) * 100) : 0
  const passivosPercentual = totalLeads > 0 ? 100 - ativosPercentual : 0

  const valorVendasFechadas = oportunidadesFechadas.reduce(
    (acc, item) => acc + Number(item.valorEstimado),
    0
  )

  const taxaConversao =
    totalOportunidades > 0
      ? Math.round((oportunidadesFechadas.length / totalOportunidades) * 100)
      : 0

  const leadsPorMes = buildLeadsPorMes(leads, meses)

  return {
    meses,
    totalLeads,
    leadsAtivos,
    leadsInativos,
    ativosPercentual,
    passivosPercentual,
    oportunidadesAbertas,
    emNegociacao,
    taxaConversao,
    vendasFechadas: {
      quantidade: oportunidadesFechadas.length,
      valor: formatCurrencyBr(valorVendasFechadas),
    },
    leadsPorMes,
  }
}

const buildLeadsPorMes = (leads, meses = 6) => {
  const now = new Date()
  const buckets = []

  for (let index = meses - 1; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1)
    buckets.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: monthNames[date.getMonth()],
      count: 0,
    })
  }

  for (const lead of leads) {
    const registered = new Date(lead.dataCadastro)
    const key = `${registered.getFullYear()}-${registered.getMonth()}`
    const bucket = buckets.find((item) => item.key === key)
    if (bucket) bucket.count += 1
  }

  const maxCount = Math.max(...buckets.map((item) => item.count), 0)

  return buckets.map((item) => ({
    label: item.label,
    count: item.count,
    height:
      item.count === 0 || maxCount === 0
        ? 0
        : Math.max(18, Math.round((item.count / maxCount) * 100)),
  }))
}
