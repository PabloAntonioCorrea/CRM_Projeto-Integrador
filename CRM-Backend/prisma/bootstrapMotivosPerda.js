import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DefaultMotivos = [
  'Preço alto',
  'Comprou concorrente',
  'Sem orçamento',
  'Sem resposta do cliente',
  'Prazo não atendido',
]

async function main() {
  const etapaPerdida = await prisma.etapaFunil.findFirst({ where: { nome: 'Perdida' } })
  if (!etapaPerdida) {
    const maxOrdem = await prisma.etapaFunil.aggregate({ _max: { ordem: true } })
    await prisma.etapaFunil.create({
      data: { nome: 'Perdida', ordem: (maxOrdem._max.ordem ?? 6) + 1 },
    })
    console.log('Etapa "Perdida" criada.')
  }

  const total = await prisma.motivoPerda.count()
  if (total === 0) {
    await prisma.motivoPerda.createMany({
      data: DefaultMotivos.map((nome) => ({ nome })),
    })
    console.log(`${DefaultMotivos.length} motivos de perda criados.`)
  } else {
    console.log(`Já existem ${total} motivos cadastrados.`)
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
