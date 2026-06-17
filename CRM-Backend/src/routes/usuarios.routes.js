import { Router } from 'express'
import * as usuariosController from '../controllers/usuarios.controller.js'
import { requireAdministrador } from '../middleware/requireAdministrador.js'

const usuariosRoutes = Router()

usuariosRoutes.get('/opcoes', usuariosController.listOpcoes)
usuariosRoutes.get('/', requireAdministrador, usuariosController.list)
usuariosRoutes.get('/:id', requireAdministrador, usuariosController.getById)
usuariosRoutes.post('/', requireAdministrador, usuariosController.create)
usuariosRoutes.put('/:id', requireAdministrador, usuariosController.update)
usuariosRoutes.delete('/:id', requireAdministrador, usuariosController.remove)

export default usuariosRoutes
