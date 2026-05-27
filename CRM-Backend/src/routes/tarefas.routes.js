import { Router } from 'express'
import * as tarefasController from '../controllers/tarefas.controller.js'

const tarefasRoutes = Router()

tarefasRoutes.patch('/:id/status', tarefasController.toggleStatus)
tarefasRoutes.put('/:id', tarefasController.update)
tarefasRoutes.delete('/:id', tarefasController.remove)

export default tarefasRoutes
