import { apiRequest } from './apiClient.js'

export const fetchUsuarios = () => apiRequest('/usuarios')

export const fetchUsuarioById = (id) => apiRequest(`/usuarios/${id}`)

export const createUsuario = (payload) =>
  apiRequest('/usuarios', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updateUsuario = (id, payload) =>
  apiRequest(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

export const deleteUsuario = (id) =>
  apiRequest(`/usuarios/${id}`, {
    method: 'DELETE',
  })
