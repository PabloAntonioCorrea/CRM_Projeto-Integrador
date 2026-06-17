export const buildUsuarioFilterQuery = (usuarioId) => {
  if (!usuarioId) return ''
  return `?usuarioId=${encodeURIComponent(usuarioId)}`
}
