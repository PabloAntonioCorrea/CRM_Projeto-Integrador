export const getUserInitials = (nome) => {
  if (!nome?.trim()) return '?'
  const parts = nome.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export const getPerfilLabel = (perfilAcesso) =>
  perfilAcesso === 'Administrador' ? 'Administrador' : 'Usuário'
