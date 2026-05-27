import * as tarefasService from '../services/tarefas.service.js'

export const listByLead = async (request, response, next) => {
  try {
    const tarefas = await tarefasService.listTarefasByLead(request.params.leadId, request.query)
    response.json(tarefas)
  } catch (error) {
    next(error)
  }
}

export const createForLead = async (request, response, next) => {
  try {
    const tarefa = await tarefasService.createTarefaForLead(request.params.leadId, request.body)
    response.status(201).json(tarefa)
  } catch (error) {
    next(error)
  }
}

export const listByOportunidade = async (request, response, next) => {
  try {
    const tarefas = await tarefasService.listTarefasByOportunidade(request.params.oportunidadeId)
    response.json(tarefas)
  } catch (error) {
    next(error)
  }
}

export const createForOportunidade = async (request, response, next) => {
  try {
    const tarefa = await tarefasService.createTarefaForOportunidade(
      request.params.oportunidadeId,
      request.body
    )
    response.status(201).json(tarefa)
  } catch (error) {
    next(error)
  }
}

export const update = async (request, response, next) => {
  try {
    const tarefa = await tarefasService.updateTarefa(request.params.id, request.body)
    response.json(tarefa)
  } catch (error) {
    next(error)
  }
}

export const toggleStatus = async (request, response, next) => {
  try {
    const tarefa = await tarefasService.toggleTarefaStatus(request.params.id)
    response.json(tarefa)
  } catch (error) {
    next(error)
  }
}

export const remove = async (request, response, next) => {
  try {
    await tarefasService.deleteTarefa(request.params.id)
    response.status(204).send()
  } catch (error) {
    next(error)
  }
}
