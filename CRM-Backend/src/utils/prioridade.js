const prioridadeToDbMap = {
  Baixa: 'Baixa',
  Media: 'Media',
  Média: 'Media',
  Alta: 'Alta',
}

const prioridadeToLabelMap = {
  Baixa: 'Baixa',
  Media: 'Média',
  Alta: 'Alta',
}

export const parsePrioridade = (value) => {
  if (!value) return 'Media'
  return prioridadeToDbMap[value] ?? null
}

export const formatPrioridadeLabel = (value) => {
  return prioridadeToLabelMap[value] ?? value
}
