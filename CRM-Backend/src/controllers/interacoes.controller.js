import * as interacoesService from '../services/interacoes.service.js'

export const listByLead = async (request, response, next) => {
  try {
    const interacoes = await interacoesService.listInteracoesByLead(
      request.params.leadId,
      request.query
    )
    response.json(interacoes)
  } catch (error) {
    next(error)
  }
}

export const createForLead = async (request, response, next) => {
  try {
    const interacao = await interacoesService.createInteracaoForLead(
      request.params.leadId,
      request.body
    )
    response.status(201).json(interacao)
  } catch (error) {
    next(error)
  }
}

export const listByOportunidade = async (request, response, next) => {
  try {
    const interacoes = await interacoesService.listInteracoesByOportunidade(
      request.params.oportunidadeId
    )
    response.json(interacoes)
  } catch (error) {
    next(error)
  }
}

export const createForOportunidade = async (request, response, next) => {
  try {
    const interacao = await interacoesService.createInteracaoForOportunidade(
      request.params.oportunidadeId,
      request.body
    )
    response.status(201).json(interacao)
  } catch (error) {
    next(error)
  }
}
