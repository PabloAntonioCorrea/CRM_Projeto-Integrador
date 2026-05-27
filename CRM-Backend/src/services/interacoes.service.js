import { ErrorMessages } from '../config/constants.js'
import prisma from '../lib/prisma.js'
import { parseDateTimeInput } from '../utils/date.js'
import {
  InteracaoTiposValidos,
  interacaoInclude,
  mapInteracaoToResponse,
} from '../utils/interacaoMapper.js'

const parseId = (value) => {
  const parsed = Number(value)
  if (!value || Number.isNaN(parsed) || parsed < 1) return null
  return parsed
}

const parseUsuarioId = (usuarioId) => {
  const parsed = Number(usuarioId)
  if (!usuarioId || Number.isNaN(parsed) || parsed < 1) return null
  return parsed
}

const buildInteracaoData = async (body, leadId, fixedOportunidadeId = null) => {
  const tipo = body.tipo?.trim()
  if (!tipo) {
    const error = new Error(ErrorMessages.interacaoTipoRequired)
    error.statusCode = 400
    throw error
  }
  if (!InteracaoTiposValidos.includes(tipo)) {
    const error = new Error(ErrorMessages.interacaoTipoInvalid)
    error.statusCode = 400
    throw error
  }

  const descricao = body.descricao?.trim()
  if (!descricao) {
    const error = new Error(ErrorMessages.interacaoDescricaoRequired)
    error.statusCode = 400
    throw error
  }

  if (!body.dataInteracao) {
    const error = new Error(ErrorMessages.interacaoDataRequired)
    error.statusCode = 400
    throw error
  }

  const dataInteracao = parseDateTimeInput(body.dataInteracao)
  if (!dataInteracao) {
    const error = new Error(ErrorMessages.interacaoDataInvalid)
    error.statusCode = 400
    throw error
  }

  const usuarioId = parseUsuarioId(body.usuarioId)
  if (!usuarioId) {
    const error = new Error(ErrorMessages.invalidUsuarioId)
    error.statusCode = 400
    throw error
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } })
  if (!usuario) {
    const error = new Error(ErrorMessages.usuarioNotFound)
    error.statusCode = 400
    throw error
  }

  let oportunidadeId = fixedOportunidadeId
  if (!oportunidadeId && body.oportunidadeId) {
    oportunidadeId = parseId(body.oportunidadeId)
    if (!oportunidadeId) {
      const error = new Error(ErrorMessages.interacaoOportunidadeInvalid)
      error.statusCode = 400
      throw error
    }
  }

  if (oportunidadeId) {
    const oportunidade = await prisma.oportunidade.findUnique({
      where: { id: oportunidadeId },
      select: { id: true, leadId: true },
    })
    if (!oportunidade) {
      const error = new Error(ErrorMessages.interacaoOportunidadeNotFound)
      error.statusCode = 400
      throw error
    }
    if (oportunidade.leadId !== leadId) {
      const error = new Error(ErrorMessages.interacaoOportunidadeLeadMismatch)
      error.statusCode = 400
      throw error
    }
  }

  return {
    tipo,
    descricao,
    dataInteracao,
    leadId,
    oportunidadeId: oportunidadeId ?? null,
    usuarioId,
  }
}

const assertLeadExists = async (leadId) => {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } })
  if (!lead) {
    const error = new Error(ErrorMessages.leadNotFound)
    error.statusCode = 404
    throw error
  }
}

export const listInteracoesByLead = async (leadIdParam, query = {}) => {
  const leadId = parseId(leadIdParam)
  if (!leadId) {
    const error = new Error(ErrorMessages.invalidLeadId)
    error.statusCode = 400
    throw error
  }

  await assertLeadExists(leadId)

  const oportunidadeId = query.oportunidadeId ? parseId(query.oportunidadeId) : null
  const where = { leadId }
  if (oportunidadeId) {
    where.oportunidadeId = oportunidadeId
  }

  const interacoes = await prisma.interacao.findMany({
    where,
    include: interacaoInclude,
    orderBy: { dataInteracao: 'desc' },
  })

  return interacoes.map(mapInteracaoToResponse)
}

export const listInteracoesByOportunidade = async (oportunidadeIdParam) => {
  const oportunidadeId = parseId(oportunidadeIdParam)
  if (!oportunidadeId) {
    const error = new Error(ErrorMessages.invalidOportunidadeId)
    error.statusCode = 400
    throw error
  }

  const oportunidade = await prisma.oportunidade.findUnique({
    where: { id: oportunidadeId },
    select: { id: true, leadId: true },
  })

  if (!oportunidade) {
    const error = new Error(ErrorMessages.oportunidadeNotFound)
    error.statusCode = 404
    throw error
  }

  const interacoes = await prisma.interacao.findMany({
    where: { oportunidadeId },
    include: interacaoInclude,
    orderBy: { dataInteracao: 'desc' },
  })

  return interacoes.map(mapInteracaoToResponse)
}

export const createInteracaoForLead = async (leadIdParam, body) => {
  const leadId = parseId(leadIdParam)
  if (!leadId) {
    const error = new Error(ErrorMessages.invalidLeadId)
    error.statusCode = 400
    throw error
  }

  await assertLeadExists(leadId)
  const data = await buildInteracaoData(body, leadId)

  const interacao = await prisma.interacao.create({
    data,
    include: interacaoInclude,
  })

  return mapInteracaoToResponse(interacao)
}

export const createInteracaoForOportunidade = async (oportunidadeIdParam, body) => {
  const oportunidadeId = parseId(oportunidadeIdParam)
  if (!oportunidadeId) {
    const error = new Error(ErrorMessages.invalidOportunidadeId)
    error.statusCode = 400
    throw error
  }

  const oportunidade = await prisma.oportunidade.findUnique({
    where: { id: oportunidadeId },
    select: { id: true, leadId: true },
  })

  if (!oportunidade) {
    const error = new Error(ErrorMessages.oportunidadeNotFound)
    error.statusCode = 404
    throw error
  }

  const data = await buildInteracaoData(body, oportunidade.leadId, oportunidadeId)

  const interacao = await prisma.interacao.create({
    data,
    include: interacaoInclude,
  })

  return mapInteracaoToResponse(interacao)
}
