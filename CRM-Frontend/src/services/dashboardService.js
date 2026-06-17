import { apiRequest } from './apiClient.js'

export const fetchDashboardStats = (meses = 6) => {
  const params = new URLSearchParams({ meses: String(meses) })
  return apiRequest(`/dashboard?${params.toString()}`)
}
