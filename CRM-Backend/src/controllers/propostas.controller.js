import * as propostasService from '../services/propostas.service.js'

export const listByOportunidade = async (request, response, next) => {
  try {
    const propostas = await propostasService.listPropostasByOportunidade(request.params.oportunidadeId)
    response.json(propostas)
  } catch (error) {
    next(error)
  }
}

export const create = async (request, response, next) => {
  try {
    const proposta = await propostasService.createProposta(
      request.params.oportunidadeId,
      request.body
    )
    response.status(201).json(proposta)
  } catch (error) {
    next(error)
  }
}

export const update = async (request, response, next) => {
  try {
    const proposta = await propostasService.updateProposta(request.params.id, request.body)
    response.json(proposta)
  } catch (error) {
    next(error)
  }
}

export const remove = async (request, response, next) => {
  try {
    await propostasService.deleteProposta(request.params.id)
    response.status(204).send()
  } catch (error) {
    next(error)
  }
}
