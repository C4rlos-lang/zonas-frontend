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
        <div class="panel-label">
          Zonas
          <span class="badge">{{ zonas.length }}</span>
        </div>
      </div>

      <div class="zones-scroll">
        <div v-if="zonas.length === 0" class="empty">
          Sin zonas definidas
        </div>
        <div
          v-for="zona in zonas"
          :key="zona.id"
          class="zone-card"
          @click="focusZona(zona)"
        >
          <div class="zone-dot" :style="{ background: zona.color }"></div>
          <div class="zone-text">
            <div class="zone-name">{{ zona.nombre }}</div>
            <div class="zone-id">{{ zona.id.slice(0, 8) }}</div>
          </div>
          <button class="zone-del" @click.stop="eliminar(zona.id)">X</button>
        </div>
      </div>
    </div>

    <div id="map-admin" class="map-area"></div>

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

    <div v-if="toast.visible" class="toast-msg" :class="toast.type">
      {{ toast.msg }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import * as turf from '@turf/turf'
import { getZonas, crearZona, eliminarZona } from '../api/zonas.js'

const COLORS = ['#00e5a0','#7c6fff','#ff9f43','#ff6b9d','#54a0ff','#ff4d6a','#00d2d3','#ffd32a']
let map = null
let drawnItems = null
let colorIdx = 0
let pendingLayer = null

const zonas = ref([])
const modalVisible = ref(false)
const nombreZona = ref('')
const toast = ref({ visible: false, msg: '', type: '' })

onMounted(async () => {
  map = L.map('map-admin', { zoomControl: false }).setView([4.8133, -74.0059], 13)
  L.control.zoom({ position: 'bottomright' }).addTo(map)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: 'OpenStreetMap CARTO'
  }).addTo(map)
  drawnItems = new L.FeatureGroup().addTo(map)
  map.on(L.Draw.Event.CREATED, (e) => {
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
    data.forEach((zona, i) => {
      const color = COLORS[i % COLORS.length]
      const layer = L.polygon(zona.coordenadas.map((c) => [c[0], c[1]]), {
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
  const nombre = nombreZona.value.trim()
  if (!nombre || !pendingLayer) return
  const coords = pendingLayer.getLatLngs()[0].map((ll) => [ll.lat, ll.lng])

  var nombreExiste = zonas.value.find((z) => z.nombre.toLowerCase() === nombre.toLowerCase())
  if (nombreExiste) {
    showToast('Ya existe una zona con el nombre "' + nombre + '"', 'error')
    return
  }

  var nuevoCoords = coords.map((c) => [c[1], c[0]])
  nuevoCoords.push(nuevoCoords[0])
  var nuevoPoly = turf.polygon([nuevoCoords])

  for (var i = 0; i < zonas.value.length; i++) {
    var zona = zonas.value[i]
    var existCoords = zona.coordenadas.map((c) => [c[1], c[0]])
    existCoords.push(existCoords[0])
    var existPoly = turf.polygon([existCoords])
    if (
      turf.booleanOverlap(nuevoPoly, existPoly) ||
      turf.booleanContains(nuevoPoly, existPoly) ||
      turf.booleanContains(existPoly, nuevoPoly)
    ) {
      showToast('Se sobrepone con "' + zona.nombre + '"', 'error')
      pendingLayer = null
      nombreZona.value = ''
      modalVisible.value = false
      return
    }
  }

  try {
    const { data } = await crearZona({ nombre: nombre, coordenadas: coords })
    const color = COLORS[colorIdx % COLORS.length]
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

async function eliminar(id) {
  try {
    await eliminarZona(id)
    const z = zonas.value.find((z) => z.id === id)
    if (z) drawnItems.removeLayer(z.layer)
    zonas.value = zonas.value.filter((z) => z.id !== id)
    showToast('Zona eliminada', 'success')
  } catch (err) {
    showToast('Error al eliminar', 'error')
  }
}

function focusZona(zona) {
  if (zona.layer) map.fitBounds(zona.layer.getBounds(), { padding: [40, 40] })
}

function showToast(msg, type) {
  toast.value = { visible: true, msg: msg, type: type }
  setTimeout(() => { toast.value.visible = false }, 2800)
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  width: 100%;
  height: 100%;
}

.tools-panel {
  width: 260px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.badge {
  background: rgba(0, 229, 160, 0.15);
  color: #00e5a0;
  padding: 1px 7px;
  border-radius: 10px;
  font-size: 10px;
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

.zones-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.empty {
  text-align: center;
  padding: 24px 12px;
  color: #4a4a5a;
  font-size: 12px;
}

.zone-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  margin-bottom: 3px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: #1a1a24;
  cursor: pointer;
  transition: all 0.12s;
}

.zone-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

.zone-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.zone-text {
  flex: 1;
  min-width: 0;
}

.zone-name {
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.zone-id {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  color: #4a4a5a;
}

.zone-del {
  background: none;
  border: none;
  color: #4a4a5a;
  cursor: pointer;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
}

.zone-del:hover {
  color: #ff4d6a;
  background: rgba(255, 77, 106, 0.1);
}

.map-area {
  flex: 1;
  height: 100%;
}

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