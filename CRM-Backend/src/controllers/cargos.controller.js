import * as cargosService from '../services/cargos.service.js'

export const list = async (request, response, next) => {
  try {
    const cargos = await cargosService.listCargos(request.query)
    response.json(cargos)
  } catch (error) {
    next(error)
  }
}

export const getById = async (request, response, next) => {
  try {
    const cargo = await cargosService.getCargoById(request.params.id)
    response.json(cargo)
  } catch (error) {
    next(error)
  }
}

export const create = async (request, response, next) => {
  try {
    const cargo = await cargosService.createCargo(request.body)
    response.status(201).json(cargo)
  } catch (error) {
    next(error)
  }
}

export const update = async (request, response, next) => {
  try {
    const cargo = await cargosService.updateCargo(request.params.id, request.body)
    response.json(cargo)
  } catch (error) {
    next(error)
  }
}

export const remove = async (request, response, next) => {
  try {
    await cargosService.deleteCargo(request.params.id)
    response.status(204).send()
  } catch (error) {
    next(error)
  }
}
