import { ErrorMessages } from '../config/constants.js'
import prisma from '../lib/prisma.js'
import { mapCargoToResponse } from '../utils/cargoMapper.js'

const parseCargoId = (id) => {
  const parsed = Number(id)
  if (!id || Number.isNaN(parsed) || parsed < 1) return null
  return parsed
}

const buildCargoData = (body) => {
  const nome = body.nome?.trim()
  if (!nome) {
    const error = new Error(ErrorMessages.cargoNomeRequired)
    error.statusCode = 400
    throw error
  }

  const data = { nome }
  if (body.ativo !== undefined) {
    data.ativo = Boolean(body.ativo)
  }

  return data
}

export const listCargos = async (query = {}) => {
  const onlyActive = query.ativos === 'true' || query.ativos === '1'

  const cargos = await prisma.cargo.findMany({
    where: onlyActive ? { ativo: true } : undefined,
    orderBy: { nome: 'asc' },
  })

  return cargos.map(mapCargoToResponse)
}

export const getCargoById = async (idParam) => {
  const id = parseCargoId(idParam)
  if (!id) {
    const error = new Error(ErrorMessages.invalidCargoId)
    error.statusCode = 400
    throw error
  }

  const cargo = await prisma.cargo.findUnique({ where: { id } })
  if (!cargo) {
    const error = new Error(ErrorMessages.cargoNotFound)
    error.statusCode = 404
    throw error
  }

  return mapCargoToResponse(cargo)
}

export const createCargo = async (body) => {
  const data = buildCargoData(body)

  try {
    const cargo = await prisma.cargo.create({ data })
    return mapCargoToResponse(cargo)
  } catch (error) {
    if (error.code === 'P2002') {
      const duplicate = new Error(ErrorMessages.cargoNomeInUse)
      duplicate.statusCode = 400
      throw duplicate
    }
    throw error
  }
}

export const updateCargo = async (idParam, body) => {
  const id = parseCargoId(idParam)
  if (!id) {
    const error = new Error(ErrorMessages.invalidCargoId)
    error.statusCode = 400
    throw error
  }

  const existing = await prisma.cargo.findUnique({ where: { id } })
  if (!existing) {
    const error = new Error(ErrorMessages.cargoNotFound)
    error.statusCode = 404
    throw error
  }

  const data = buildCargoData(body)

  try {
    const cargo = await prisma.cargo.update({ where: { id }, data })
    return mapCargoToResponse(cargo)
  } catch (error) {
    if (error.code === 'P2002') {
      const duplicate = new Error(ErrorMessages.cargoNomeInUse)
      duplicate.statusCode = 400
      throw duplicate
    }
    throw error
  }
}

export const deleteCargo = async (idParam) => {
  const id = parseCargoId(idParam)
  if (!id) {
    const error = new Error(ErrorMessages.invalidCargoId)
    error.statusCode = 400
    throw error
  }

  const existing = await prisma.cargo.findUnique({ where: { id } })
  if (!existing) {
    const error = new Error(ErrorMessages.cargoNotFound)
    error.statusCode = 404
    throw error
  }

  const inUse = await prisma.usuario.count({ where: { cargo: existing.nome } })
  if (inUse > 0) {
    const error = new Error(ErrorMessages.cargoInUse)
    error.statusCode = 400
    throw error
  }

  await prisma.cargo.delete({ where: { id } })
}

export const assertCargoAtivo = async (nomeCargo, existingCargo = null) => {
  const cargo = nomeCargo?.trim()
  if (!cargo) return

  if (existingCargo && cargo === existingCargo) return

  const cargoAtivo = await prisma.cargo.findFirst({
    where: { nome: cargo, ativo: true },
  })

  if (!cargoAtivo) {
    const error = new Error(ErrorMessages.cargoNotFound)
    error.statusCode = 400
    throw error
  }
}
