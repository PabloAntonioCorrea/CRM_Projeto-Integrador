import { ErrorMessages } from '../config/constants.js'
import prisma from '../lib/prisma.js'
import { parseValorEstimado } from '../utils/currency.js'
import { parseDateInput } from '../utils/date.js'
import {
  PropostaStatusValidos,
  mapPropostaToResponse,
  propostaInclude,
} from '../utils/propostaMapper.js'

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

const parseStatus = (value) => {
  if (!value) return 'Rascunho'
  const normalized = String(value).trim()
  if (normalized === 'Em negociação') return 'EmNegociacao'
  if (PropostaStatusValidos.includes(normalized)) return normalized
  return null
}

const buildPropostaData = async (body, oportunidadeId) => {
  const titulo = body.titulo?.trim()
  if (!titulo) {
    const error = new Error(ErrorMessages.propostaTituloRequired)
    error.statusCode = 400
    throw error
  }

  const valor = parseValorEstimado(body.valor)
  if (valor === null) {
    const error = new Error(ErrorMessages.propostaValorInvalid)
    error.statusCode = 400
    throw error
  }

  if (!body.dataProposta) {
    const error = new Error(ErrorMessages.propostaDataRequired)
    error.statusCode = 400
    throw error
  }

  const dataProposta = parseDateInput(body.dataProposta)
  if (!dataProposta) {
    const error = new Error(ErrorMessages.propostaDataInvalid)
    error.statusCode = 400
    throw error
  }

  const status = parseStatus(body.status)
  if (!status) {
    const error = new Error(ErrorMessages.propostaStatusInvalid)
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

  const oportunidade = await prisma.oportunidade.findUnique({ where: { id: oportunidadeId } })
  if (!oportunidade) {
    const error = new Error(ErrorMessages.oportunidadeNotFound)
    error.statusCode = 404
    throw error
  }

  return {
    titulo,
    valor,
    status,
    dataProposta,
    oportunidadeId,
    usuarioId,
  }
}

export const listPropostasByOportunidade = async (oportunidadeIdParam) => {
  const oportunidadeId = parseId(oportunidadeIdParam)
  if (!oportunidadeId) {
    const error = new Error(ErrorMessages.invalidOportunidadeId)
    error.statusCode = 400
    throw error
  }

  const oportunidade = await prisma.oportunidade.findUnique({ where: { id: oportunidadeId } })
  if (!oportunidade) {
    const error = new Error(ErrorMessages.oportunidadeNotFound)
    error.statusCode = 404
    throw error
  }

  const propostas = await prisma.proposta.findMany({
    where: { oportunidadeId },
    include: propostaInclude,
    orderBy: { dataProposta: 'desc' },
  })

  return propostas.map(mapPropostaToResponse)
}

export const createProposta = async (oportunidadeIdParam, body) => {
  const oportunidadeId = parseId(oportunidadeIdParam)
  if (!oportunidadeId) {
    const error = new Error(ErrorMessages.invalidOportunidadeId)
    error.statusCode = 400
    throw error
  }

  const data = await buildPropostaData(body, oportunidadeId)

  const proposta = await prisma.proposta.create({
    data,
    include: propostaInclude,
  })

  return mapPropostaToResponse(proposta)
}

export const updateProposta = async (idParam, body) => {
  const id = parseId(idParam)
  if (!id) {
    const error = new Error(ErrorMessages.invalidPropostaId)
    error.statusCode = 400
    throw error
  }

  const existing = await prisma.proposta.findUnique({ where: { id } })
  if (!existing) {
    const error = new Error(ErrorMessages.propostaNotFound)
    error.statusCode = 404
    throw error
  }

  const data = await buildPropostaData(body, existing.oportunidadeId)

  const proposta = await prisma.proposta.update({
    where: { id },
    data,
    include: propostaInclude,
  })

  return mapPropostaToResponse(proposta)
}

export const deleteProposta = async (idParam) => {
  const id = parseId(idParam)
  if (!id) {
    const error = new Error(ErrorMessages.invalidPropostaId)
    error.statusCode = 400
    throw error
  }

  const existing = await prisma.proposta.findUnique({ where: { id } })
  if (!existing) {
    const error = new Error(ErrorMessages.propostaNotFound)
    error.statusCode = 404
    throw error
  }

  await prisma.proposta.delete({ where: { id } })
}
