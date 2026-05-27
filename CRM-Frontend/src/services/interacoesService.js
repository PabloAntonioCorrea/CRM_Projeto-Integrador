import { apiRequest } from './apiClient.js'

export const fetchInteracoesByLead = (leadId, params = {}) => {
  const search = new URLSearchParams()
  if (params.oportunidadeId) search.set('oportunidadeId', params.oportunidadeId)
  const query = search.toString()
  const suffix = query ? `?${query}` : ''
  return apiRequest(`/leads/${leadId}/interacoes${suffix}`)
}

export const createInteracaoForLead = (leadId, payload) =>
  apiRequest(`/leads/${leadId}/interacoes`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const fetchInteracoesByOportunidade = (oportunidadeId) =>
  apiRequest(`/oportunidades/${oportunidadeId}/interacoes`)

export const createInteracaoForOportunidade = (oportunidadeId, payload) =>
  apiRequest(`/oportunidades/${oportunidadeId}/interacoes`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
