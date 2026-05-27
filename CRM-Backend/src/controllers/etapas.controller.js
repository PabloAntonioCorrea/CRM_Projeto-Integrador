import * as etapasService from '../services/etapas.service.js'

export const list = async (_request, response, next) => {
  try {
    const etapas = await etapasService.listEtapasFunil()
    response.json(etapas)
  } catch (error) {
    next(error)
  }
}
