import prisma from '../lib/prisma.js'
import { formatCurrencyBr } from '../utils/currency.js'

const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export const getDashboardStats = async () => {
  const [totalLeads, leadsAtivos, totalOportunidades, etapaFechado, oportunidadesFechadas, leads] =
    await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'Ativo' } }),
      prisma.oportunidade.count(),
      prisma.etapaFunil.findFirst({ where: { nome: 'Fechado' } }),
      prisma.oportunidade.findMany({
        where: { etapaFunil: { nome: 'Fechado' } },
        select: { valorEstimado: true },
      }),
      prisma.lead.findMany({
        select: { dataCadastro: true, status: true },
        orderBy: { dataCadastro: 'desc' },
      }),
    ])

  const leadsInativos = totalLeads - leadsAtivos
  const ativosPercentual = totalLeads > 0 ? Math.round((leadsAtivos / totalLeads) * 100) : 0
  const passivosPercentual = totalLeads > 0 ? 100 - ativosPercentual : 0

  const oportunidadesAbertas = etapaFechado
    ? await prisma.oportunidade.count({
        where: { etapaFunilId: { not: etapaFechado.id } },
      })
    : totalOportunidades

  const emNegociacao = await prisma.oportunidade.count({
    where: { etapaFunil: { nome: 'Negociação' } },
  })

  const valorVendasFechadas = oportunidadesFechadas.reduce(
    (acc, item) => acc + Number(item.valorEstimado),
    0
  )

  const taxaConversao =
    totalOportunidades > 0
      ? Math.round((oportunidadesFechadas.length / totalOportunidades) * 100)
      : 0

  const leadsPorMes = buildLeadsPorMes(leads)

  return {
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

const buildLeadsPorMes = (leads) => {
  const now = new Date()
  const buckets = []

  for (let index = 5; index >= 0; index -= 1) {
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

  const maxCount = Math.max(...buckets.map((item) => item.count), 1)

  return buckets.map((item) => ({
    label: item.label,
    count: item.count,
    height: Math.round((item.count / maxCount) * 100) || 8,
  }))
}
