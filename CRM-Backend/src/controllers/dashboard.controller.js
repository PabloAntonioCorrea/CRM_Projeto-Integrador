import * as dashboardService from '../services/dashboard.service.js'

export const getStats = async (request, response, next) => {
  try {
    const stats = await dashboardService.getDashboardStats(request.query)
    response.json(stats)
  } catch (error) {
    next(error)
  }
}
