import { apiRequest } from './apiClient.js'

export const fetchOportunidades = () => apiRequest('/oportunidades')

export const fetchOportunidadeById = (id) => apiRequest(`/oportunidades/${id}`)

export const fetchOportunidadesFunil = () => apiRequest('/oportunidades/funil')

export const createOportunidade = (payload) =>
  apiRequest('/oportunidades', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updateOportunidade = (id, payload) =>
  apiRequest(`/oportunidades/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

export const deleteOportunidade = (id) =>
  apiRequest(`/oportunidades/${id}`, {
    method: 'DELETE',
  })

export const marcarOportunidadePerdida = (id, payload) =>
  apiRequest(`/oportunidades/${id}/perder`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
