const SessionStorageKey = 'crm_session_user'

export const loadSessionUser = () => {
  try {
    const raw = localStorage.getItem(SessionStorageKey)
    if (!raw) return null
    const user = JSON.parse(raw)
    if (!user?.id || !user?.email) return null
    return user
  } catch {
    return null
  }
}

export const saveSessionUser = (user) => {
  localStorage.setItem(SessionStorageKey, JSON.stringify(user))
}

export const clearSessionUser = () => {
  localStorage.removeItem(SessionStorageKey)
}
