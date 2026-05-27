import { apiRequest } from './apiClient.js'

export const fetchPropostasByOportunidade = (oportunidadeId) =>
  apiRequest(`/oportunidades/${oportunidadeId}/propostas`)

export const createProposta = (oportunidadeId, payload) =>
  apiRequest(`/oportunidades/${oportunidadeId}/propostas`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updateProposta = (id, payload) =>
  apiRequest(`/propostas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

export const deleteProposta = (id) =>
  apiRequest(`/propostas/${id}`, {
    method: 'DELETE',
  })
