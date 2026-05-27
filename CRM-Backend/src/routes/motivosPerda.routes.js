import { Router } from 'express'
import * as motivosPerdaController from '../controllers/motivosPerda.controller.js'

const motivosPerdaRoutes = Router()

motivosPerdaRoutes.get('/', motivosPerdaController.list)
motivosPerdaRoutes.get('/:id', motivosPerdaController.getById)
motivosPerdaRoutes.post('/', motivosPerdaController.create)
motivosPerdaRoutes.put('/:id', motivosPerdaController.update)
motivosPerdaRoutes.delete('/:id', motivosPerdaController.remove)

export default motivosPerdaRoutes
