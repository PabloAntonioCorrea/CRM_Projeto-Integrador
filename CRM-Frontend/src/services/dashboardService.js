import { apiRequest } from './apiClient.js'

export const fetchDashboardStats = () => apiRequest('/dashboard')
