export const getPriorityClass = (prioridade) => {
  const normalized = prioridade?.toLowerCase() ?? ''
  if (normalized === 'média' || normalized === 'media') return 'media'
  return normalized
}
