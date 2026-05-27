import bcrypt from 'bcryptjs'
import { ErrorMessages } from '../config/constants.js'
import prisma from '../lib/prisma.js'
import { mapUsuarioToResponse, parsePerfilAcesso } from '../utils/usuarioMapper.js'

const parseUsuarioId = (id) => {
  const parsed = Number(id)
  if (!id || Number.isNaN(parsed) || parsed < 1) return null
  return parsed
}

const buildUsuarioData = async (body, { isUpdate = false } = {}) => {
  const nome = body.nome?.trim()
  if (!nome) {
    const error = new Error(ErrorMessages.usuarioNomeRequired)
    error.statusCode = 400
    throw error
  }

  const email = body.email?.trim().toLowerCase()
  if (!email) {
    const error = new Error(ErrorMessages.usuarioEmailRequired)
    error.statusCode = 400
    throw error
  }

  const cargo = body.cargo?.trim()
  if (!cargo) {
    const error = new Error(ErrorMessages.usuarioCargoRequired)
    error.statusCode = 400
    throw error
  }

  const perfilAcesso = parsePerfilAcesso(body.perfilAcesso ?? body.perfil)
  if (!perfilAcesso) {
    const error = new Error(ErrorMessages.invalidPerfilAcesso)
    error.statusCode = 400
    throw error
  }

  const data = { nome, email, cargo, perfilAcesso }

  const senha = body.senha?.trim()
  if (senha) {
    data.senha = await bcrypt.hash(senha, 10)
  } else if (!isUpdate) {
    const error = new Error(ErrorMessages.usuarioSenhaRequired)
    error.statusCode = 400
    throw error
  }

  return data
}

const ensureEmailAvailable = async (email, usuarioId = null) => {
  const existing = await prisma.usuario.findUnique({ where: { email } })
  if (existing && existing.id !== usuarioId) {
    const error = new Error(ErrorMessages.usuarioEmailInUse)
    error.statusCode = 409
    throw error
  }
}

export const listUsuarios = async () => {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { nome: 'asc' },
  })
  return usuarios.map(mapUsuarioToResponse)
}

export const getUsuarioById = async (idParam) => {
  const id = parseUsuarioId(idParam)
  if (!id) {
    const error = new Error(ErrorMessages.invalidUsuarioIdParam)
    error.statusCode = 400
    throw error
  }

  const usuario = await prisma.usuario.findUnique({ where: { id } })
  if (!usuario) {
    const error = new Error(ErrorMessages.usuarioNotFound)
    error.statusCode = 404
    throw error
  }

  return mapUsuarioToResponse(usuario)
}

export const createUsuario = async (body) => {
  const data = await buildUsuarioData(body)
  await ensureEmailAvailable(data.email)
  const usuario = await prisma.usuario.create({ data })
  return mapUsuarioToResponse(usuario)
}

export const updateUsuario = async (idParam, body) => {
  const id = parseUsuarioId(idParam)
  if (!id) {
    const error = new Error(ErrorMessages.invalidUsuarioIdParam)
    error.statusCode = 400
    throw error
  }

  const existing = await prisma.usuario.findUnique({ where: { id } })
  if (!existing) {
    const error = new Error(ErrorMessages.usuarioNotFound)
    error.statusCode = 404
    throw error
  }

  const data = await buildUsuarioData(body, { isUpdate: true })
  await ensureEmailAvailable(data.email, id)

  if (!data.senha) {
    delete data.senha
  }

  const usuario = await prisma.usuario.update({
    where: { id },
    data,
  })
  return mapUsuarioToResponse(usuario)
}

export const deleteUsuario = async (idParam) => {
  const id = parseUsuarioId(idParam)
  if (!id) {
    const error = new Error(ErrorMessages.invalidUsuarioIdParam)
    error.statusCode = 400
    throw error
  }

  const existing = await prisma.usuario.findUnique({
    where: { id },
    include: {
      leads: { select: { id: true }, take: 1 },
      oportunidades: { select: { id: true }, take: 1 },
    },
  })

  if (!existing) {
    const error = new Error(ErrorMessages.usuarioNotFound)
    error.statusCode = 404
    throw error
  }

  if (existing.leads.length > 0) {
    const error = new Error(ErrorMessages.usuarioHasLeads)
    error.statusCode = 409
    throw error
  }

  if (existing.oportunidades.length > 0) {
    const error = new Error(ErrorMessages.usuarioHasOportunidades)
    error.statusCode = 409
    throw error
  }

  await prisma.usuario.delete({ where: { id } })
}
