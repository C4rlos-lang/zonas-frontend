import axios from 'axios'

const api = axios.create({
  baseURL: 'https://zonas-app-production.up.railway.app'
})

const API_KEY = 'gz-2026-tr4nsporte-s3cur3'

export const getZonas = () => api.get('/zonas')

export const crearZona = (data) => api.post('/zonas', data, {
  headers: { 'x-api-key': API_KEY }
})

export const eliminarZona = (id) => api.delete('/zonas/' + id, {
  headers: { 'x-api-key': API_KEY }
})

export const verificarPunto = (lat, lon) => api.post('/zonas/verificar', { lat, lon }, {
  headers: { 'x-api-key': API_KEY }
})

export const registro = (data) => api.post('/auth/registro', data)

export const login = (data) => api.post('/auth/login', data)

export const getMisKeys = (token) => api.get('/mis-keys', {
  headers: { 'Authorization': 'Bearer ' + token }
})

export const crearMiKey = (token, nombre) => api.post('/mis-keys', { nombre: nombre }, {
  headers: { 'Authorization': 'Bearer ' + token }
})

export const revocarMiKey = (token, id) => api.delete('/mis-keys/' + id, {
  headers: { 'Authorization': 'Bearer ' + token }
})

export const getMiConsumo = (token) => api.get('/mi-consumo', {
  headers: { 'Authorization': 'Bearer ' + token }
})

export const validarToken = (token) => api.get('/mis-keys', {
  headers: { 'Authorization': 'Bearer ' + token }
})

export const getMiPlan = (token) => api.get('/mi-plan', {
  headers: { 'Authorization': 'Bearer ' + token }
})

export const crearPago = (token, plan) => api.post('/pagos/crear', { plan: plan }, {
  headers: { 'Authorization': 'Bearer ' + token }
})

export const verificarPago = (token, referencia) => api.get('/pagos/verificar/' + referencia, {
  headers: { 'Authorization': 'Bearer ' + token }
})