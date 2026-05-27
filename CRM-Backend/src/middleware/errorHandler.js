import { ErrorMessages } from '../config/constants.js'

export const errorHandler = (error, _request, response, _next) => {
  if (error?.code === 'LIMIT_FILE_SIZE') {
    response.status(400).json({ message: 'Arquivo muito grande. Limite de 5 MB.' })
    return
  }

  if (error?.message === ErrorMessages.importFileInvalid) {
    response.status(400).json({ message: error.message })
    return
  }

  const statusCode = error.statusCode || 500
  response.status(statusCode).json({
    message: error.message || 'Erro interno do servidor',
  })
}
