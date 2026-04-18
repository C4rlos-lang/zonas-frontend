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

export const verificarPunto = (lat, lon) => api.post('/zonas/verificar', { lat, lon })