import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const SeedConfig = {
  adminEmail: 'admin@empresa.com',
  adminSenha: '123456',
}

const EtapasFunil = [
  { nome: 'Prospecção', ordem: 1 },
  { nome: 'Qualificação', ordem: 2 },
  { nome: 'Diagnóstico', ordem: 3 },
  { nome: 'Proposta', ordem: 4 },
  { nome: 'Negociação', ordem: 5 },
  { nome: 'Fechado', ordem: 6 },
  { nome: 'Perdida', ordem: 7 },
]

const MotivosPerda = ['Preço alto', 'Sem orçamento', 'Sem resposta do cliente', 'Prazo não atendido']

const CargosDefault = [
  'Administrador',
  'Diretor Comercial',
  'Segundo em comando',
  'Assessor',
  'Vendedor',
  'Consultora Comercial',
  'Executivo de Vendas',
]

async function main() {
  const usuarioCount = await prisma.usuario.count()
  if (usuarioCount > 0) {
    console.log('Banco já inicializado — seed ignorado.')
    return
  }

  const senhaHash = await bcrypt.hash(SeedConfig.adminSenha, 10)

  await Promise.all(EtapasFunil.map((etapa) => prisma.etapaFunil.create({ data: etapa })))

  await prisma.motivoPerda.createMany({
    data: MotivosPerda.map((nome) => ({ nome })),
  })

  await prisma.cargo.createMany({
    data: CargosDefault.map((nome) => ({ nome })),
  })

  await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email: SeedConfig.adminEmail,
      cargo: 'Administrador',
      senha: senhaHash,
      perfilAcesso: 'Administrador',
    },
  })

  console.log('Seed inicial concluído.')
  console.log(`Admin: ${SeedConfig.adminEmail} / ${SeedConfig.adminSenha}`)
}

main()
  .catch((error) => {
    console.error('Falha no seed inicial:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
