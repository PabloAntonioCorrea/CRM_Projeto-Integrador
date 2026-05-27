import { ErrorMessages } from '../config/constants.js'
import prisma from '../lib/prisma.js'
import { parseDateInput } from '../utils/date.js'
import {
  TarefaStatusValidos,
  mapTarefaToResponse,
  tarefaInclude,
} from '../utils/tarefaMapper.js'

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
  if (!value) return null
  const normalized = String(value).trim()
  if (normalized === 'Concluída') return 'Concluida'
  if (TarefaStatusValidos.includes(normalized)) return normalized
  return null
}

const buildTarefaData = async (body, leadId, fixedOportunidadeId = null) => {
  const titulo = body.titulo?.trim()
  if (!titulo) {
    const error = new Error(ErrorMessages.tarefaTituloRequired)
    error.statusCode = 400
    throw error
  }

  if (!body.dataPrazo) {
    const error = new Error(ErrorMessages.tarefaDataPrazoRequired)
    error.statusCode = 400
    throw error
  }

  const dataPrazo = parseDateInput(body.dataPrazo)
  if (!dataPrazo) {
    const error = new Error(ErrorMessages.tarefaDataPrazoInvalid)
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

  let status = 'Pendente'
  if (body.status !== undefined) {
    const parsedStatus = parseStatus(body.status)
    if (!parsedStatus) {
      const error = new Error(ErrorMessages.tarefaStatusInvalid)
      error.statusCode = 400
      throw error
    }
    status = parsedStatus
  }

  let oportunidadeId = fixedOportunidadeId
  if (!oportunidadeId && body.oportunidadeId) {
    oportunidadeId = parseId(body.oportunidadeId)
    if (!oportunidadeId) {
      const error = new Error(ErrorMessages.tarefaOportunidadeInvalid)
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
      const error = new Error(ErrorMessages.tarefaOportunidadeNotFound)
      error.statusCode = 400
      throw error
    }
    if (oportunidade.leadId !== leadId) {
      const error = new Error(ErrorMessages.tarefaOportunidadeLeadMismatch)
      error.statusCode = 400
      throw error
    }
  }

  return {
    titulo,
    descricao: body.descricao?.trim() || null,
    dataPrazo,
    status,
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

const sortTarefas = (tarefas) =>
  [...tarefas].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'Pendente' ? -1 : 1
    }
    return new Date(a.dataPrazo).getTime() - new Date(b.dataPrazo).getTime()
  })

export const listTarefasByLead = async (leadIdParam, query = {}) => {
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

  const tarefas = await prisma.tarefa.findMany({
    where,
    include: tarefaInclude,
  })

  return sortTarefas(tarefas).map(mapTarefaToResponse)
}

export const listTarefasByOportunidade = async (oportunidadeIdParam) => {
  const oportunidadeId = parseId(oportunidadeIdParam)
  if (!oportunidadeId) {
    const error = new Error(ErrorMessages.invalidOportunidadeId)
    error.statusCode = 400
    throw error
  }

  const oportunidade = await prisma.oportunidade.findUnique({
    where: { id: oportunidadeId },
    select: { id: true },
  })

  if (!oportunidade) {
    const error = new Error(ErrorMessages.oportunidadeNotFound)
    error.statusCode = 404
    throw error
  }

  const tarefas = await prisma.tarefa.findMany({
    where: { oportunidadeId },
    include: tarefaInclude,
  })

  return sortTarefas(tarefas).map(mapTarefaToResponse)
}

export const createTarefaForLead = async (leadIdParam, body) => {
  const leadId = parseId(leadIdParam)
  if (!leadId) {
    const error = new Error(ErrorMessages.invalidLeadId)
    error.statusCode = 400
    throw error
  }

  await assertLeadExists(leadId)
  const data = await buildTarefaData(body, leadId)

  const tarefa = await prisma.tarefa.create({
    data,
    include: tarefaInclude,
  })

  return mapTarefaToResponse(tarefa)
}

export const createTarefaForOportunidade = async (oportunidadeIdParam, body) => {
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

  const data = await buildTarefaData(body, oportunidade.leadId, oportunidadeId)

  const tarefa = await prisma.tarefa.create({
    data,
    include: tarefaInclude,
  })

  return mapTarefaToResponse(tarefa)
}

export const updateTarefa = async (idParam, body) => {
  const id = parseId(idParam)
  if (!id) {
    const error = new Error(ErrorMessages.invalidTarefaId)
    error.statusCode = 400
    throw error
  }

  const existing = await prisma.tarefa.findUnique({ where: { id } })
  if (!existing) {
    const error = new Error(ErrorMessages.tarefaNotFound)
    error.statusCode = 404
    throw error
  }

  const data = await buildTarefaData(body, existing.leadId, existing.oportunidadeId)

  const tarefa = await prisma.tarefa.update({
    where: { id },
    data,
    include: tarefaInclude,
  })

  return mapTarefaToResponse(tarefa)
}

export const toggleTarefaStatus = async (idParam) => {
  const id = parseId(idParam)
  if (!id) {
    const error = new Error(ErrorMessages.invalidTarefaId)
    error.statusCode = 400
    throw error
  }

  const existing = await prisma.tarefa.findUnique({ where: { id } })
  if (!existing) {
    const error = new Error(ErrorMessages.tarefaNotFound)
    error.statusCode = 404
    throw error
  }

  const tarefa = await prisma.tarefa.update({
    where: { id },
    data: {
      status: existing.status === 'Pendente' ? 'Concluida' : 'Pendente',
    },
    include: tarefaInclude,
  })

  return mapTarefaToResponse(tarefa)
}

export const deleteTarefa = async (idParam) => {
  const id = parseId(idParam)
  if (!id) {
    const error = new Error(ErrorMessages.invalidTarefaId)
    error.statusCode = 400
    throw error
  }

  const existing = await prisma.tarefa.findUnique({ where: { id } })
  if (!existing) {
    const error = new Error(ErrorMessages.tarefaNotFound)
    error.statusCode = 404
    throw error
  }

  await prisma.tarefa.delete({ where: { id } })
}
