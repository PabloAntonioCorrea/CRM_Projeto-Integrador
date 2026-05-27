import { Router } from 'express'
import * as dashboardController from '../controllers/dashboard.controller.js'

const dashboardRoutes = Router()

dashboardRoutes.get('/', dashboardController.getStats)

export default dashboardRoutes
