import prisma from '../lib/prisma.js'

export const listEtapasFunil = async () => {
  return prisma.etapaFunil.findMany({
    select: { id: true, nome: true, ordem: true },
    orderBy: { ordem: 'asc' },
  })
}
