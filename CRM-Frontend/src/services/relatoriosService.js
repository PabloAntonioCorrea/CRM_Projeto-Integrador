import { ApiConfig } from '../config/api.js'
import { apiRequest } from './apiClient.js'

const buildQueryString = (params) => {
  const search = new URLSearchParams()
  if (params.dataInicio) search.set('dataInicio', params.dataInicio)
  if (params.dataFim) search.set('dataFim', params.dataFim)
  if (params.usuarioId) search.set('usuarioId', params.usuarioId)
  const query = search.toString()
  return query ? `?${query}` : ''
}

export const fetchRelatorio = (params) =>
  apiRequest(`/relatorios${buildQueryString(params)}`, { cache: 'no-store' })

export const downloadRelatorioExcel = async (params) => {
  const response = await fetch(`${ApiConfig.baseUrl}/relatorios/export${buildQueryString(params)}`)

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || 'Erro ao exportar relatório')
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'relatorio-crm.xlsx'
  link.click()
  window.URL.revokeObjectURL(url)
}
