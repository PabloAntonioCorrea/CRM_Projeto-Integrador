import { Router } from 'express'
import * as cargosController from '../controllers/cargos.controller.js'
import { requireAdministrador } from '../middleware/requireAdministrador.js'

const cargosRoutes = Router()

cargosRoutes.get('/', cargosController.list)
cargosRoutes.get('/:id', cargosController.getById)
cargosRoutes.post('/', requireAdministrador, cargosController.create)
cargosRoutes.put('/:id', requireAdministrador, cargosController.update)
cargosRoutes.delete('/:id', requireAdministrador, cargosController.remove)

export default cargosRoutes
