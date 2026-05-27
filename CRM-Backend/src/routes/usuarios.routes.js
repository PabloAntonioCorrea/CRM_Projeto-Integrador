import { Router } from 'express'
import * as usuariosController from '../controllers/usuarios.controller.js'

const usuariosRoutes = Router()

usuariosRoutes.get('/', usuariosController.list)
usuariosRoutes.get('/:id', usuariosController.getById)
usuariosRoutes.post('/', usuariosController.create)
usuariosRoutes.put('/:id', usuariosController.update)
usuariosRoutes.delete('/:id', usuariosController.remove)

export default usuariosRoutes
