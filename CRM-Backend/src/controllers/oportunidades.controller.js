import * as oportunidadesService from '../services/oportunidades.service.js'

export const list = async (_request, response, next) => {
  try {
    const oportunidades = await oportunidadesService.listOportunidades()
    response.json(oportunidades)
  } catch (error) {
    next(error)
  }
}

export const listFunil = async (_request, response, next) => {
  try {
    const funil = await oportunidadesService.listOportunidadesFunil()
    response.json(funil)
  } catch (error) {
    next(error)
  }
}

export const getById = async (request, response, next) => {
  try {
    const oportunidade = await oportunidadesService.getOportunidadeById(request.params.id)
    response.json(oportunidade)
  } catch (error) {
    next(error)
  }
}

export const create = async (request, response, next) => {
  try {
    const oportunidade = await oportunidadesService.createOportunidade(request.body)
    response.status(201).json(oportunidade)
  } catch (error) {
    next(error)
  }
}

export const update = async (request, response, next) => {
  try {
    const oportunidade = await oportunidadesService.updateOportunidade(request.params.id, request.body)
    response.json(oportunidade)
  } catch (error) {
    next(error)
  }
}

export const remove = async (request, response, next) => {
  try {
    await oportunidadesService.deleteOportunidade(request.params.id)
    response.status(204).send()
  } catch (error) {
    next(error)
  }
}

export const marcarPerdida = async (request, response, next) => {
  try {
    const oportunidade = await oportunidadesService.marcarOportunidadeComoPerdida(
      request.params.id,
      request.body
    )
    response.json(oportunidade)
  } catch (error) {
    next(error)
  }
}
