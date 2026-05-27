import { formatCurrencyBr } from './currency.js'
import { formatDateBr } from './date.js'

const PropostaStatusLabels = {
  Rascunho: 'Rascunho',
  Enviada: 'Enviada',
  EmNegociacao: 'Em negociação',
  Aceita: 'Aceita',
  Recusada: 'Recusada',
}

export const PropostaStatusValidos = Object.keys(PropostaStatusLabels)

export const propostaInclude = {
  usuario: { select: { id: true, nome: true } },
}

export const mapPropostaToResponse = (proposta) => ({
  id: proposta.id,
  titulo: proposta.titulo,
  valor: formatCurrencyBr(proposta.valor),
  valorNumerico: proposta.valor,
  status: PropostaStatusLabels[proposta.status] ?? proposta.status,
  statusDb: proposta.status,
  dataProposta: formatDateBr(proposta.dataProposta),
  oportunidadeId: proposta.oportunidadeId,
  usuarioId: proposta.usuarioId,
  responsavel: proposta.usuario?.nome ?? null,
})
