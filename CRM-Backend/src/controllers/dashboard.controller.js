import * as dashboardService from '../services/dashboard.service.js'

export const getStats = async (_request, response, next) => {
  try {
    const stats = await dashboardService.getDashboardStats()
    response.json(stats)
  } catch (error) {
    next(error)
  }
}
