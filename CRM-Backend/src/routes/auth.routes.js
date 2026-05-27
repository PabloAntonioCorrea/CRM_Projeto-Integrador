import { Router } from 'express'
import * as authController from '../controllers/auth.controller.js'

const authRoutes = Router()

authRoutes.post('/login', authController.login)

export default authRoutes
