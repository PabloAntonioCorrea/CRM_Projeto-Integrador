import { Router } from 'express'
import * as interacoesController from '../controllers/interacoes.controller.js'

const interacoesRoutes = Router()

interacoesRoutes.put('/:id', interacoesController.update)
interacoesRoutes.delete('/:id', interacoesController.remove)

export default interacoesRoutes
