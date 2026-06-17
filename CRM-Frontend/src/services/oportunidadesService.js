import { apiRequest } from './apiClient.js'
import { buildUsuarioFilterQuery } from '../utils/queryParams.js'

export const fetchOportunidades = (params) =>
  apiRequest(`/oportunidades${buildUsuarioFilterQuery(params?.usuarioId)}`)

export const fetchOportunidadeById = (id) => apiRequest(`/oportunidades/${id}`)

export const fetchOportunidadesFunil = (params) =>
  apiRequest(`/oportunidades/funil${buildUsuarioFilterQuery(params?.usuarioId)}`)

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
