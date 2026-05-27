import { Router } from 'express'
import * as etapasController from '../controllers/etapas.controller.js'

const etapasRoutes = Router()

etapasRoutes.get('/', etapasController.list)

export default etapasRoutes
