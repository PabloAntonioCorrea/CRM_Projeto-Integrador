export const ETAPA_PERDIDA = 'Perdida'

export const resolveEtapaDestino = (overId, funil, etapasAtivas) => {
  if (!overId) return null
  const overKey = String(overId)
  if (etapasAtivas.includes(overKey)) return overKey
  for (const etapa of etapasAtivas) {
    const found = (funil[etapa] ?? []).some((item) => String(item.id) === overKey)
    if (found) return etapa
  }
  return null
}

export const findEtapaOrigem = (oportunidadeId, funil, etapasAtivas) => {
  const idKey = String(oportunidadeId)
  for (const etapa of etapasAtivas) {
    const found = (funil[etapa] ?? []).some((item) => String(item.id) === idKey)
    if (found) return etapa
  }
  return null
}

export const moveOportunidadeNoFunil = (funil, oportunidadeId, etapaOrigem, etapaDestino) => {
  const idKey = String(oportunidadeId)
  const origemLista = [...(funil[etapaOrigem] ?? [])]
  const indice = origemLista.findIndex((item) => String(item.id) === idKey)
  if (indice < 0) return funil
  const [item] = origemLista.splice(indice, 1)
  const destinoLista = [...(funil[etapaDestino] ?? []), item]
  return {
    ...funil,
    [etapaOrigem]: origemLista,
    [etapaDestino]: destinoLista,
  }
}

export const buildUpdatePayload = (oportunidade, etapaFunilId) => ({
  titulo: oportunidade.titulo,
  valorEstimado: oportunidade.valorEstimado,
  prioridade: oportunidade.prioridadeDb,
  usuarioId: oportunidade.usuarioId,
  leadId: oportunidade.leadId,
  etapaFunilId,
})
