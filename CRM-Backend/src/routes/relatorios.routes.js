import { Router } from 'express'
import * as relatoriosController from '../controllers/relatorios.controller.js'

const relatoriosRoutes = Router()

relatoriosRoutes.get('/', relatoriosController.gerar)
relatoriosRoutes.get('/export', relatoriosController.exportar)

export default relatoriosRoutes
