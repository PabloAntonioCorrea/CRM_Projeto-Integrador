import { Router } from 'express'
import * as propostasController from '../controllers/propostas.controller.js'

const propostasRoutes = Router()

propostasRoutes.put('/:id', propostasController.update)
propostasRoutes.delete('/:id', propostasController.remove)

export default propostasRoutes
