<template>
  <div class="admin-layout">
    <div class="tools-panel">
      <div class="panel-header">
        <div class="panel-title">Admin zonas</div>
        <div class="panel-sub">Dibuja y gestiona zonas de cobertura</div>
      </div>

      <div class="panel-section">
        <div class="panel-label">Herramientas</div>
        <button class="btn-draw" @click="activarDibujo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
          </svg>
          Dibujar zona
        </button>
        <div class="tips">
          <span>1. Clic en el mapa para trazar vertices</span>
          <span>2. Cierra el poligono en el primer punto</span>
          <span>3. Asigna un nombre a la zona</span>
        </div>
      </div>

      <div class="panel-section">
        <button class="btn-gestor" @click="gestorVisible = !gestorVisible">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          {{ gestorVisible ? 'Cerrar gestor' : 'Gestor de zonas' }}
          <span class="badge-inline">{{ zonas.length }}</span>
        </button>
      </div>

      <div class="zones-mini">
        <div v-for="zona in zonas.slice(0, 5)" :key="zona.id" class="zone-mini-item" @click="focusZona(zona)">
          <div class="zone-dot" :style="{ background: zona.color }"></div>
          <span class="zone-mini-name">{{ zona.nombre }}</span>
        </div>
        <div v-if="zonas.length > 5" class="zone-mini-more" @click="gestorVisible = true">
          + {{ zonas.length - 5 }} mas...
        </div>
        <div v-if="zonas.length === 0" class="empty">Sin zonas definidas</div>
      </div>
    </div>

    <div class="map-wrapper">
      <div id="map-admin" class="map-area"></div>

      <transition name="slide">
        <div v-if="gestorVisible" class="gestor-panel">
          <div class="gestor-header">
            <div class="gestor-title">Gestor de zonas</div>
            <button class="gestor-close" @click="gestorVisible = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="gestor-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b6b80" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input v-model="filtro" type="text" placeholder="Buscar zona..." class="search-input"/>
          </div>

          <div class="gestor-stats">
            <span>{{ zonasFiltradas.length }} de {{ zonas.length }} zonas</span>
          </div>

          <div class="gestor-list">
            <div
              v-for="zona in zonasFiltradas"
              :key="zona.id"
              class="gestor-item"
              :class="{ selected: zonaSeleccionada === zona.id }"
              @click="seleccionarZona(zona)"
            >
              <div class="gestor-item-color" :style="{ background: zona.color }"></div>
              <div class="gestor-item-info">
                <div class="gestor-item-name">{{ zona.nombre }}</div>
                <div class="gestor-item-id">{{ zona.id.slice(0, 8) }}</div>
              </div>
              <div class="gestor-item-actions">
                <button class="gi-btn edit" @click.stop="abrirEditar(zona)" title="Editar nombre">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="gi-btn delete" @click.stop="confirmarEliminar(zona)" title="Eliminar">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="zonasFiltradas.length === 0 && filtro" class="gestor-empty">
              No se encontraron zonas con "{{ filtro }}"
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div class="modal-bg" :class="{ show: modalVisible }">
      <div class="modal-card">
        <div class="modal-title">Nueva zona</div>
        <div class="modal-sub">Nombre identificador del poligono</div>
        <input
          v-model="nombreZona"
          type="text"
          placeholder="Ej: Zona Norte, Sector 3..."
          maxlength="50"
          @keydown.enter="guardarZona"
        />
        <div class="modal-btns">
          <button class="mbtn-cancel" @click="cancelarZona">Cancelar</button>
          <button class="mbtn-save" @click="guardarZona">Guardar</button>
        </div>
      </div>
    </div>

    <div class="modal-bg" :class="{ show: editarVisible }">
      <div class="modal-card">
        <div class="modal-title">Editar zona</div>
        <div class="modal-sub">Cambiar el nombre de la zona</div>
        <input
          v-model="editarNombre"
          type="text"
          placeholder="Nuevo nombre..."
          maxlength="50"
          @keydown.enter="guardarEdicion"
        />
        <div class="modal-btns">
          <button class="mbtn-cancel" @click="editarVisible = false">Cancelar</button>
          <button class="mbtn-save" @click="guardarEdicion">Guardar</button>
        </div>
      </div>
    </div>

    <div class="modal-bg" :class="{ show: eliminarVisible }">
      <div class="modal-card">
        <div class="modal-title" style="color: #ff4d6a;">Eliminar zona</div>
        <div class="modal-sub">Estas seguro de eliminar "{{ zonaAEliminar?.nombre }}"? Esta accion no se puede deshacer.</div>
        <div class="modal-btns">
          <button class="mbtn-cancel" @click="eliminarVisible = false">Cancelar</button>
          <button class="mbtn-delete" @click="confirmarEliminarFinal">Eliminar</button>
        </div>
      </div>
    </div>

    <div v-if="toast.visible" class="toast-msg" :class="toast.type">
      {{ toast.msg }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import * as turf from '@turf/turf'
import { getZonas, crearZona, eliminarZona } from '../api/zonas.js'
import axios from 'axios'

const API_URL = 'https://zonas-app-production.up.railway.app'
const API_KEY = 'gz-2026-tr4nsporte-s3cur3'

const COLORS = ['#00e5a0','#7c6fff','#ff9f43','#ff6b9d','#54a0ff','#ff4d6a','#00d2d3','#ffd32a']
let map = null
let drawnItems = null
let colorIdx = 0
let pendingLayer = null

const zonas = ref([])
const modalVisible = ref(false)
const nombreZona = ref('')
const toast = ref({ visible: false, msg: '', type: '' })
const gestorVisible = ref(false)
const filtro = ref('')
const zonaSeleccionada = ref(null)
const editarVisible = ref(false)
const editarNombre = ref('')
const editarId = ref(null)
const eliminarVisible = ref(false)
const zonaAEliminar = ref(null)

watch(gestorVisible, function(val) {
  var nav = document.querySelector('.nav-sidebar')
  if (nav) {
    if (val) {
      nav.classList.add('nav-collapsed')
    } else {
      nav.classList.remove('nav-collapsed')
    }
  }
})

const zonasFiltradas = computed(function() {
  if (!filtro.value) return zonas.value
  var f = filtro.value.toLowerCase()
  return zonas.value.filter(function(z) {
    return z.nombre.toLowerCase().includes(f)
  })
})

onMounted(async function() {
  map = L.map('map-admin', { zoomControl: false }).setView([4.8133, -74.0059], 13)
  L.control.zoom({ position: 'bottomright' }).addTo(map)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: 'OpenStreetMap CARTO'
  }).addTo(map)
  drawnItems = new L.FeatureGroup().addTo(map)
  map.on(L.Draw.Event.CREATED, function(e) {
    pendingLayer = e.layer
    modalVisible.value = true
  })
  await cargarZonas()
})

function activarDibujo() {
  new L.Draw.Polygon(map, {
    shapeOptions: { color: '#00e5a0', weight: 2, fillOpacity: 0.15 },
    allowIntersection: false
  }).enable()
}

async function cargarZonas() {
  try {
    const { data } = await getZonas()
    data.forEach(function(zona, i) {
      var color = COLORS[i % COLORS.length]
      var layer = L.polygon(zona.coordenadas.map(function(c) { return [c[0], c[1]] }), {
        color: color, fillColor: color, fillOpacity: 0.15, weight: 2
      })
      layer.bindTooltip(zona.nombre, { permanent: true, direction: 'center' })
      layer.addTo(drawnItems)
      zonas.value.push({ ...zona, layer: layer, color: color })
      colorIdx++
    })
  } catch (err) {
    showToast('Error cargando zonas', 'error')
  }
}

async function guardarZona() {
  var nombre = nombreZona.value.trim()
  if (!nombre || !pendingLayer) return
  var coords = pendingLayer.getLatLngs()[0].map(function(ll) { return [ll.lat, ll.lng] })

  var nombreExiste = zonas.value.find(function(z) { return z.nombre.toLowerCase() === nombre.toLowerCase() })
  if (nombreExiste) {
    showToast('Ya existe una zona con el nombre "' + nombre + '"', 'error')
    return
  }

  var nuevoCoords = coords.map(function(c) { return [c[1], c[0]] })
  nuevoCoords.push(nuevoCoords[0])
  var nuevoPoly = turf.polygon([nuevoCoords])

  for (var i = 0; i < zonas.value.length; i++) {
    var zona = zonas.value[i]
    var existCoords = zona.coordenadas.map(function(c) { return [c[1], c[0]] })
    existCoords.push(existCoords[0])
    var existPoly = turf.polygon([existCoords])
    if (turf.booleanOverlap(nuevoPoly, existPoly) || turf.booleanContains(nuevoPoly, existPoly) || turf.booleanContains(existPoly, nuevoPoly)) {
      showToast('Se sobrepone con "' + zona.nombre + '"', 'error')
      pendingLayer = null
      nombreZona.value = ''
      modalVisible.value = false
      return
    }
  }

  try {
    const { data } = await crearZona({ nombre: nombre, coordenadas: coords })
    var color = COLORS[colorIdx % COLORS.length]
    colorIdx++
    pendingLayer.setStyle({ color: color, fillColor: color, fillOpacity: 0.15, weight: 2 })
    pendingLayer.bindTooltip(nombre, { permanent: true, direction: 'center' })
    drawnItems.addLayer(pendingLayer)
    zonas.value.push({ ...data, layer: pendingLayer, color: color })
    pendingLayer = null
    nombreZona.value = ''
    modalVisible.value = false
    showToast('Zona guardada', 'success')
  } catch (err) {
    showToast('Error al guardar', 'error')
  }
}

function cancelarZona() {
  pendingLayer = null
  nombreZona.value = ''
  modalVisible.value = false
}

function seleccionarZona(zona) {
  zonaSeleccionada.value = zona.id
  if (zona.layer) map.fitBounds(zona.layer.getBounds(), { padding: [40, 40] })
  zona.layer.setStyle({ weight: 4, fillOpacity: 0.3 })
  setTimeout(function() {
    zona.layer.setStyle({ weight: 2, fillOpacity: 0.15 })
  }, 2000)
}

function focusZona(zona) {
  if (zona.layer) map.fitBounds(zona.layer.getBounds(), { padding: [40, 40] })
}

function abrirEditar(zona) {
  editarId.value = zona.id
  editarNombre.value = zona.nombre
  editarVisible.value = true
}

async function guardarEdicion() {
  var nombre = editarNombre.value.trim()
  if (!nombre) return

  var nombreExiste = zonas.value.find(function(z) {
    return z.nombre.toLowerCase() === nombre.toLowerCase() && z.id !== editarId.value
  })
  if (nombreExiste) {
    showToast('Ya existe una zona con ese nombre', 'error')
    return
  }

  try {
    await axios.put(API_URL + '/zonas/' + editarId.value, { nombre: nombre }, {
      headers: { 'x-api-key': API_KEY }
    })
    var zona = zonas.value.find(function(z) { return z.id === editarId.value })
    if (zona) {
      zona.nombre = nombre
      if (zona.layer) {
        zona.layer.unbindTooltip()
        zona.layer.bindTooltip(nombre, { permanent: true, direction: 'center' })
      }
    }
    editarVisible.value = false
    showToast('Zona actualizada', 'success')
  } catch (err) {
    showToast('Error al actualizar', 'error')
  }
}

function confirmarEliminar(zona) {
  zonaAEliminar.value = zona
  eliminarVisible.value = true
}

async function confirmarEliminarFinal() {
  if (!zonaAEliminar.value) return
  var id = zonaAEliminar.value.id
  try {
    await eliminarZona(id)
    var z = zonas.value.find(function(z) { return z.id === id })
    if (z) drawnItems.removeLayer(z.layer)
    zonas.value = zonas.value.filter(function(z) { return z.id !== id })
    eliminarVisible.value = false
    zonaAEliminar.value = null
    showToast('Zona eliminada', 'success')
  } catch (err) {
    showToast('Error al eliminar', 'error')
  }
}

function showToast(msg, type) {
  toast.value = { visible: true, msg: msg, type: type }
  setTimeout(function() { toast.value.visible = false }, 2800)
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  width: 100%;
  height: 100%;
}

.tools-panel {
  width: 220px;
  flex-shrink: 0;
  background: #13131a;
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.panel-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 3px;
}

.panel-sub {
  font-size: 11px;
  color: #6b6b80;
}

.panel-section {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.panel-label {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  color: #6b6b80;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.btn-draw {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  background: rgba(0, 229, 160, 0.1);
  border: 1px solid rgba(0, 229, 160, 0.3);
  color: #00e5a0;
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s;
}

.btn-draw:hover {
  background: rgba(0, 229, 160, 0.2);
}

.tips {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 11px;
  color: #4a4a5a;
}

.btn-gestor {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  background: rgba(124, 111, 255, 0.1);
  border: 1px solid rgba(124, 111, 255, 0.3);
  color: #7c6fff;
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s;
}

.btn-gestor:hover {
  background: rgba(124, 111, 255, 0.2);
}

.badge-inline {
  background: rgba(124, 111, 255, 0.2);
  padding: 1px 7px;
  border-radius: 10px;
  font-size: 10px;
  font-family: 'DM Mono', monospace;
}

.zones-mini {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.zone-mini-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.12s;
}

.zone-mini-item:hover {
  background: rgba(255, 255, 255, 0.04);
}

.zone-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.zone-mini-name {
  font-size: 11px;
  color: #6b6b80;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.zone-mini-more {
  font-size: 11px;
  color: #7c6fff;
  padding: 6px 8px;
  cursor: pointer;
}

.zone-mini-more:hover {
  text-decoration: underline;
}

.empty {
  text-align: center;
  padding: 20px 12px;
  color: #4a4a5a;
  font-size: 11px;
}

.map-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.map-area {
  width: 100%;
  height: 100%;
}

/* Gestor panel deslizable */
.gestor-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background: rgba(19, 19, 26, 0.95);
  backdrop-filter: blur(12px);
  border-left: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.slide-enter-active {
  transition: transform 0.25s ease;
}

.slide-leave-active {
  transition: transform 0.2s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

.gestor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.gestor-title {
  font-size: 14px;
  font-weight: 700;
}

.gestor-close {
  background: none;
  border: none;
  color: #6b6b80;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.gestor-close:hover {
  color: #f0f0f5;
  background: rgba(255, 255, 255, 0.06);
}

.gestor-search {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 16px;
  padding: 8px 12px;
  background: #1a1a24;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  color: #f0f0f5;
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  outline: none;
}

.search-input::placeholder {
  color: #4a4a5a;
}

.gestor-stats {
  padding: 0 16px 8px;
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  color: #4a4a5a;
}

.gestor-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px 8px;
}

.gestor-list::-webkit-scrollbar {
  width: 4px;
}

.gestor-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.07);
  border-radius: 2px;
}

.gestor-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 10px;
  border-radius: 6px;
  margin-bottom: 2px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.12s;
}

.gestor-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.06);
}

.gestor-item.selected {
  background: rgba(124, 111, 255, 0.08);
  border-color: rgba(124, 111, 255, 0.2);
}

.gestor-item-color {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.gestor-item-info {
  flex: 1;
  min-width: 0;
}

.gestor-item-name {
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gestor-item-id {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  color: #4a4a5a;
}

.gestor-item-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s;
}

.gestor-item:hover .gestor-item-actions {
  opacity: 1;
}

.gi-btn {
  background: none;
  border: none;
  color: #6b6b80;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.gi-btn.edit:hover {
  color: #7c6fff;
  background: rgba(124, 111, 255, 0.1);
}

.gi-btn.delete:hover {
  color: #ff4d6a;
  background: rgba(255, 77, 106, 0.1);
}

.gestor-empty {
  text-align: center;
  padding: 24px 16px;
  color: #4a4a5a;
  font-size: 12px;
}

/* Modales */
.modal-bg {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  align-items: center;
  justify-content: center;
}

.modal-bg.show {
  display: flex;
}

.modal-card {
  background: #13131a;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 24px;
  width: 320px;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.modal-sub {
  font-size: 12px;
  color: #6b6b80;
  margin-bottom: 16px;
  line-height: 1.5;
}

.modal-card input {
  width: 100%;
  padding: 10px 12px;
  background: #1c1c26;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 6px;
  color: #f0f0f5;
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  outline: none;
}

.modal-card input:focus {
  border-color: #00e5a0;
}

.modal-btns {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}

.mbtn-cancel {
  flex: 1;
  padding: 9px;
  border-radius: 6px;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.07);
  color: #6b6b80;
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.mbtn-save {
  flex: 2;
  padding: 9px;
  border-radius: 6px;
  background: #00e5a0;
  border: none;
  color: #000;
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.mbtn-save:hover {
  background: #00ffb0;
}

.mbtn-delete {
  flex: 2;
  padding: 9px;
  border-radius: 6px;
  background: #ff4d6a;
  border: none;
  color: white;
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.mbtn-delete:hover {
  background: #ff6b83;
}

.toast-msg {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  z-index: 99999;
}

.toast-msg.success {
  background: rgba(0, 229, 160, 0.15);
  border: 1px solid rgba(0, 229, 160, 0.4);
  color: #00e5a0;
}

.toast-msg.error {
  background: rgba(255, 77, 106, 0.15);
  border: 1px solid rgba(255, 77, 106, 0.4);
  color: #ff4d6a;
}

</style>