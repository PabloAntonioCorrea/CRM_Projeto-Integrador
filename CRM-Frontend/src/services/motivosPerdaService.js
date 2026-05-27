import { apiRequest } from './apiClient.js'

export const fetchMotivosPerda = (onlyActive = false) => {
  const suffix = onlyActive ? '?ativos=true' : ''
  return apiRequest(`/motivos-perda${suffix}`)
}

export const fetchMotivoPerdaById = (id) => apiRequest(`/motivos-perda/${id}`)

export const createMotivoPerda = (payload) =>
  apiRequest('/motivos-perda', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updateMotivoPerda = (id, payload) =>
  apiRequest(`/motivos-perda/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

export const deleteMotivoPerda = (id) =>
  apiRequest(`/motivos-perda/${id}`, {
    method: 'DELETE',
  })
