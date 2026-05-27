import * as motivosPerdaService from '../services/motivosPerda.service.js'

export const list = async (request, response, next) => {
  try {
    const motivos = await motivosPerdaService.listMotivosPerda(request.query)
    response.json(motivos)
  } catch (error) {
    next(error)
  }
}

export const getById = async (request, response, next) => {
  try {
    const motivo = await motivosPerdaService.getMotivoPerdaById(request.params.id)
    response.json(motivo)
  } catch (error) {
    next(error)
  }
}

export const create = async (request, response, next) => {
  try {
    const motivo = await motivosPerdaService.createMotivoPerda(request.body)
    response.status(201).json(motivo)
  } catch (error) {
    next(error)
  }
}

export const update = async (request, response, next) => {
  try {
    const motivo = await motivosPerdaService.updateMotivoPerda(request.params.id, request.body)
    response.json(motivo)
  } catch (error) {
    next(error)
  }
}

export const remove = async (request, response, next) => {
  try {
    await motivosPerdaService.deleteMotivoPerda(request.params.id)
    response.status(204).send()
  } catch (error) {
    next(error)
  }
}
