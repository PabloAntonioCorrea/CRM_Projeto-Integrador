import * as relatoriosService from '../services/relatorios.service.js'

export const gerar = async (request, response, next) => {
  try {
    const relatorio = await relatoriosService.gerarRelatorio(request.query)
    response.json(relatorio)
  } catch (error) {
    next(error)
  }
}

export const exportar = async (request, response, next) => {
  try {
    const buffer = await relatoriosService.exportarRelatorioExcel(request.query)
    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response.setHeader('Content-Disposition', 'attachment; filename="relatorio-crm.xlsx"')
    response.send(Buffer.from(buffer))
  } catch (error) {
    next(error)
  }
}
