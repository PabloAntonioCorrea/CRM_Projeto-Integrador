import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const ErrorMessages = {
  seedFailed: 'Seed failed',
}

async function main() {
  const senhaHash = await bcrypt.hash('123456', 10)

  await prisma.proposta.deleteMany()
  await prisma.tarefa.deleteMany()
  await prisma.interacao.deleteMany()
  await prisma.oportunidade.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.motivoPerda.deleteMany()
  await prisma.etapaFunil.deleteMany()
  await prisma.usuario.deleteMany()

  const etapas = await Promise.all(
    [
      { nome: 'Prospecção', ordem: 1 },
      { nome: 'Qualificação', ordem: 2 },
      { nome: 'Diagnóstico', ordem: 3 },
      { nome: 'Proposta', ordem: 4 },
      { nome: 'Negociação', ordem: 5 },
      { nome: 'Fechado', ordem: 6 },
      { nome: 'Perdida', ordem: 7 },
    ].map((etapa) => prisma.etapaFunil.create({ data: etapa }))
  )

  await prisma.motivoPerda.createMany({
    data: [
      { nome: 'Preço alto' },
      { nome: 'Sem orçamento' },
      { nome: 'Sem resposta do cliente' },
      { nome: 'Prazo não atendido' },
    ],
  })

  const pablo = await prisma.usuario.create({
    data: {
      nome: 'Pablo Corrêa',
      email: 'pablo@empresa.com',
      cargo: 'Diretor Comercial',
      senha: senhaHash,
      perfilAcesso: 'Administrador',
    },
  })

  const maria = await prisma.usuario.create({
    data: {
      nome: 'Maria Souza',
      email: 'maria@empresa.com',
      cargo: 'Vendedora',
      senha: senhaHash,
      perfilAcesso: 'Usuario',
    },
  })

  const pedro = await prisma.usuario.create({
    data: {
      nome: 'Pedro Alves',
      email: 'pedro@empresa.com',
      cargo: 'Assessor',
      senha: senhaHash,
      perfilAcesso: 'Usuario',
    },
  })

  const leadTechSul = await prisma.lead.create({
    data: {
      nome: 'João Martins',
      email: 'joao@techsul.com',
      telefone: '(55) 99999-0101',
      empresa: 'TechSul',
      cidade: 'Santa Maria',
      nicho: 'Tecnologia',
      status: 'Ativo',
      dataCadastro: new Date('2026-01-10'),
      usuarioId: pablo.id,
    },
  })

  const leadClinica = await prisma.lead.create({
    data: {
      nome: 'Ana Ribeiro',
      email: 'ana@clinicavida.com',
      telefone: '(51) 98888-0202',
      empresa: 'Clínica Vida',
      cidade: 'Porto Alegre',
      nicho: 'Saúde',
      status: 'Ativo',
      dataCadastro: new Date('2026-02-18'),
      usuarioId: maria.id,
    },
  })

  const leadAgro = await prisma.lead.create({
    data: {
      nome: 'Carlos Lima',
      email: 'carlos@agrocampo.com',
      telefone: '(55) 97777-0303',
      empresa: 'AgroCampo',
      cidade: 'Cruz Alta',
      nicho: 'Agronegócio',
      observacoes: 'Lead pausado por falta de retorno.',
      status: 'Inativo',
      dataCadastro: new Date('2025-11-05'),
      usuarioId: pedro.id,
    },
  })

  const oportunidadeCrm = await prisma.oportunidade.create({
    data: {
      titulo: 'Projeto CRM Simplificado',
      valorEstimado: 8500,
      prioridade: 'Alta',
      dataCriacao: new Date('2026-04-20T09:00:00'),
      usuarioId: pablo.id,
      leadId: leadTechSul.id,
      etapaFunilId: etapas[0].id,
    },
  })

  await prisma.oportunidade.createMany({
    data: [
      {
        titulo: 'Automação de Relatórios',
        valorEstimado: 5700,
        prioridade: 'Alta',
        dataCriacao: new Date('2026-04-22T14:30:00'),
        usuarioId: maria.id,
        leadId: leadClinica.id,
        etapaFunilId: etapas[1].id,
      },
      {
        titulo: 'Consultoria Comercial',
        valorEstimado: 3200,
        prioridade: 'Media',
        dataCriacao: new Date('2026-03-15T11:00:00'),
        usuarioId: pedro.id,
        leadId: leadAgro.id,
        etapaFunilId: etapas[0].id,
      },
    ],
  })

  await prisma.proposta.createMany({
    data: [
      {
        titulo: 'Proposta Comercial v1',
        valor: 8000,
        status: 'Enviada',
        dataProposta: new Date('2026-04-24'),
        oportunidadeId: oportunidadeCrm.id,
        usuarioId: pablo.id,
      },
      {
        titulo: 'Proposta Comercial v2',
        valor: 8500,
        status: 'EmNegociacao',
        dataProposta: new Date('2026-04-27'),
        oportunidadeId: oportunidadeCrm.id,
        usuarioId: pablo.id,
      },
    ],
  })

  await prisma.tarefa.createMany({
    data: [
      {
        titulo: 'Retornar ligação de follow-up',
        descricao: 'Confirmar interesse após reunião de diagnóstico.',
        dataPrazo: new Date('2026-05-28'),
        status: 'Pendente',
        leadId: leadTechSul.id,
        oportunidadeId: oportunidadeCrm.id,
        usuarioId: pablo.id,
      },
      {
        titulo: 'Enviar proposta revisada',
        dataPrazo: new Date('2026-05-30'),
        status: 'Pendente',
        leadId: leadTechSul.id,
        oportunidadeId: oportunidadeCrm.id,
        usuarioId: pablo.id,
      },
      {
        titulo: 'Agendar demonstração do produto',
        dataPrazo: new Date('2026-05-26'),
        status: 'Concluida',
        leadId: leadClinica.id,
        usuarioId: maria.id,
      },
    ],
  })

  await prisma.interacao.createMany({
    data: [
      {
        tipo: 'Registro',
        descricao: 'Lead cadastrado no CRM.',
        dataInteracao: new Date('2026-01-10T09:00:00'),
        leadId: leadTechSul.id,
        usuarioId: pablo.id,
      },
      {
        tipo: 'Ligacao',
        descricao: 'Primeira ligação de prospecção. Cliente demonstrou interesse no CRM.',
        dataInteracao: new Date('2026-04-18T14:30:00'),
        leadId: leadTechSul.id,
        oportunidadeId: oportunidadeCrm.id,
        usuarioId: pablo.id,
      },
      {
        tipo: 'Reuniao',
        descricao: 'Reunião de diagnóstico sobre escopo e prazo do projeto.',
        dataInteracao: new Date('2026-04-22T10:00:00'),
        leadId: leadTechSul.id,
        oportunidadeId: oportunidadeCrm.id,
        usuarioId: pablo.id,
      },
      {
        tipo: 'Email',
        descricao: 'Envio de material institucional e cases de sucesso.',
        dataInteracao: new Date('2026-02-20T11:15:00'),
        leadId: leadClinica.id,
        usuarioId: maria.id,
      },
    ],
  })

  console.log('Seed concluído.')
  console.log('Usuários de teste — senha: 123456')
}

main()
  .catch((error) => {
    console.error(ErrorMessages.seedFailed, error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
