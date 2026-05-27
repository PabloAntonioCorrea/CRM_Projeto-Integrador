import { formatCurrencyBr } from './currency.js'
import { formatDateBr } from './date.js'
import { formatPrioridadeLabel } from './prioridade.js'

export const oportunidadeInclude = {
  usuario: { select: { id: true, nome: true } },
  lead: { select: { id: true, nome: true, empresa: true } },
  etapaFunil: { select: { id: true, nome: true, ordem: true } },
  motivoPerda: { select: { id: true, nome: true } },
}

export const mapOportunidadeToResponse = (oportunidade) => ({
  id: oportunidade.id,
  titulo: oportunidade.titulo,
  valorEstimado: oportunidade.valorEstimado,
  valor: formatCurrencyBr(oportunidade.valorEstimado),
  prioridade: formatPrioridadeLabel(oportunidade.prioridade),
  prioridadeDb: oportunidade.prioridade,
  motivoPerdaId: oportunidade.motivoPerdaId,
  motivoPerda: oportunidade.motivoPerda?.nome ?? null,
  perdida: Boolean(oportunidade.motivoPerdaId),
  dataCriacao: formatDateBr(oportunidade.dataCriacao),
  usuarioId: oportunidade.usuarioId,
  leadId: oportunidade.leadId,
  etapaFunilId: oportunidade.etapaFunilId,
  responsavel: oportunidade.usuario?.nome ?? null,
  lead: oportunidade.lead?.empresa ?? oportunidade.lead?.nome ?? null,
  etapa: oportunidade.etapaFunil?.nome ?? null,
})
