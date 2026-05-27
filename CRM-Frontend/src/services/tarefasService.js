import { apiRequest } from './apiClient.js'

export const fetchTarefasByLead = (leadId, params = {}) => {
  const search = new URLSearchParams()
  if (params.oportunidadeId) search.set('oportunidadeId', params.oportunidadeId)
  const query = search.toString()
  const suffix = query ? `?${query}` : ''
  return apiRequest(`/leads/${leadId}/tarefas${suffix}`)
}

export const createTarefaForLead = (leadId, payload) =>
  apiRequest(`/leads/${leadId}/tarefas`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const fetchTarefasByOportunidade = (oportunidadeId) =>
  apiRequest(`/oportunidades/${oportunidadeId}/tarefas`)

export const createTarefaForOportunidade = (oportunidadeId, payload) =>
  apiRequest(`/oportunidades/${oportunidadeId}/tarefas`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const toggleTarefaStatus = (id) =>
  apiRequest(`/tarefas/${id}/status`, {
    method: 'PATCH',
  })

export const deleteTarefa = (id) =>
  apiRequest(`/tarefas/${id}`, {
    method: 'DELETE',
  })
