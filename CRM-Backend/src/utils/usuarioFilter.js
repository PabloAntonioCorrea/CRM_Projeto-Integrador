export const parseUsuarioIdFilter = (query = {}) => {
  if (!query.usuarioId || query.usuarioId === 'todos') return null
  const parsed = Number(query.usuarioId)
  if (Number.isNaN(parsed) || parsed < 1) return null
  return parsed
}
