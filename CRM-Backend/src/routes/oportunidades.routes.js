import { Router } from 'express'
import * as interacoesController from '../controllers/interacoes.controller.js'
import * as tarefasController from '../controllers/tarefas.controller.js'
import * as oportunidadesController from '../controllers/oportunidades.controller.js'
import * as propostasController from '../controllers/propostas.controller.js'

const oportunidadesRoutes = Router()

oportunidadesRoutes.get('/funil', oportunidadesController.listFunil)
oportunidadesRoutes.get('/', oportunidadesController.list)
oportunidadesRoutes.post('/:id/perder', oportunidadesController.marcarPerdida)
oportunidadesRoutes.get('/:oportunidadeId/interacoes', interacoesController.listByOportunidade)
oportunidadesRoutes.post('/:oportunidadeId/interacoes', interacoesController.createForOportunidade)
oportunidadesRoutes.get('/:oportunidadeId/tarefas', tarefasController.listByOportunidade)
oportunidadesRoutes.post('/:oportunidadeId/tarefas', tarefasController.createForOportunidade)
oportunidadesRoutes.get('/:oportunidadeId/propostas', propostasController.listByOportunidade)
oportunidadesRoutes.post('/:oportunidadeId/propostas', propostasController.create)
oportunidadesRoutes.get('/:id', oportunidadesController.getById)
oportunidadesRoutes.post('/', oportunidadesController.create)
oportunidadesRoutes.put('/:id', oportunidadesController.update)
oportunidadesRoutes.delete('/:id', oportunidadesController.remove)

export default oportunidadesRoutes
