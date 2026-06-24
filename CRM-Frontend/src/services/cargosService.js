import { apiRequest } from './apiClient.js'

export const fetchCargos = (onlyActive = false) => {
  const suffix = onlyActive ? '?ativos=true' : ''
  return apiRequest(`/cargos${suffix}`)
}

export const createCargo = (payload) =>
  apiRequest('/cargos', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updateCargo = (id, payload) =>
  apiRequest(`/cargos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

export const deleteCargo = (id) =>
  apiRequest(`/cargos/${id}`, {
    method: 'DELETE',
  })
