import { ApiConfig } from '../config/api.js'
import { loadSessionUser } from '../utils/authSession.js'

export const apiRequest = async (path, options = {}) => {
  const sessionUser = loadSessionUser()
  const authHeaders = sessionUser?.id ? { 'X-Usuario-Id': String(sessionUser.id) } : {}

  const response = await fetch(`${ApiConfig.baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
    ...options,
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Erro na requisição')
  }

  return data
}
