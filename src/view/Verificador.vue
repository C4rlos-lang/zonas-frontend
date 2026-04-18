<template>
  <div class="verif-layout">
    <div class="tools-panel">
      <div class="panel-header">
        <div class="panel-title">Verificador</div>
        <div class="panel-sub">Identifica la zona de una coordenada</div>
      </div>

      <div class="panel-section">
        <div class="panel-label">Modo de entrada</div>
        <div class="tabs">
          <button class="tab" :class="{ active: modo === 'mapa' }" @click="modo = 'mapa'">Clic mapa</button>
          <button class="tab" :class="{ active: modo === 'manual' }" @click="modo = 'manual'">Manual</button>
        </div>
      </div>

      <div v-if="modo === 'mapa'" class="panel-section">
        <div class="panel-label">Coordenadas capturadas</div>
        <div class="coords-box">
          <div v-if="capturedLat !== null" class="coord-line">
            <span>Lat</span><span class="cv">{{ capturedLat }}</span>
          </div>
          <div v-if="capturedLon !== null" class="coord-line">
            <span>Lon</span><span class="cv">{{ capturedLon }}</span>
          </div>
          <div v-if="capturedLat === null" class="coord-hint">Haz clic en el mapa</div>
        </div>
        <button class="btn-check" :disabled="capturedLat === null" @click="verificarDesdeCaptura">Verificar zona</button>
      </div>

      <div v-if="modo === 'manual'" class="panel-section">
        <div class="panel-label">Ingresar coordenadas</div>
        <div class="field">
          <label>Latitud</label>
          <input v-model="latInput" type="number" placeholder="4.8133" step="0.000001" @keydown.enter="verificarManual"/>
        </div>
        <div class="field">
          <label>Longitud</label>
          <input v-model="lonInput" type="number" placeholder="-74.0059" step="0.000001" @keydown.enter="verificarManual"/>
        </div>
        <button class="btn-check" @click="verificarManual">Verificar zona</button>
      </div>

      <div class="panel-section">
        <div class="panel-label">Resultado</div>
        <div v-if="resultado.visible" class="result" :class="resultado.type">
          <div class="result-tag">{{ resultado.label }}</div>
          <div class="result-val">{{ resultado.zona }}</div>
          <div v-if="resultado.coords" class="result-xy">{{ resultado.coords }}</div>
        </div>
        <div v-else class="result-empty">El resultado aparecera aqui</div>
      </div>
    </div>

    <div id="map-verificador" class="map-area"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import { getZonas, verificarPunto } from '../api/zonas.js'

const COLORS = ['#00e5a0','#7c6fff','#ff9f43','#ff6b9d','#54a0ff','#ff4d6a','#00d2d3','#ffd32a']
let map = null
let zonaLayers = null
let markerLayer = null

const modo = ref('mapa')
const capturedLat = ref(null)
const capturedLon = ref(null)
const latInput = ref('')
const lonInput = ref('')
const resultado = ref({ visible: false, type: '', label: '', zona: '', coords: '' })

onMounted(async () => {
  map = L.map('map-verificador', { zoomControl: false }).setView([4.8133, -74.0059], 13)
  L.control.zoom({ position: 'bottomright' }).addTo(map)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: 'OpenStreetMap CARTO'
  }).addTo(map)
  zonaLayers = new L.FeatureGroup().addTo(map)
  map.on('click', (e) => {
    if (modo.value !== 'mapa') return
    capturedLat.value = parseFloat(e.latlng.lat.toFixed(6))
    capturedLon.value = parseFloat(e.latlng.lng.toFixed(6))
    colocarMarcador(capturedLat.value, capturedLon.value, '#7c6fff')
  })
  await cargarZonas()
})

async function cargarZonas() {
  try {
    const { data } = await getZonas()
    data.forEach((zona, i) => {
      const color = COLORS[i % COLORS.length]
      const layer = L.polygon(zona.coordenadas.map((c) => [c[0], c[1]]), {
        color: color, fillColor: color, fillOpacity: 0.15, weight: 2
      })
      layer.bindTooltip(zona.nombre, { permanent: true, direction: 'center' })
      layer.addTo(zonaLayers)
    })
  } catch (err) {
    console.error('Error cargando zonas', err)
  }
}

function colocarMarcador(lat, lon, color) {
  if (markerLayer) map.removeLayer(markerLayer)
  var icon = L.divIcon({
    html: '<div style="width:18px;height:18px;border-radius:50%;background:' + color + ';border:3px solid white;box-shadow:0 0 0 3px ' + color + '40,0 4px 12px rgba(0,0,0,0.5);transform:translate(-50%,-50%)"></div>',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    className: ''
  })
  markerLayer = L.marker([lat, lon], { icon: icon }).addTo(map)
  map.panTo([lat, lon])
}

async function verificar(lat, lon) {
  resultado.value = { visible: true, type: 'loading', label: 'Consultando...', zona: '', coords: lat + ', ' + lon }
  colocarMarcador(lat, lon, '#7c6fff')
  try {
    const { data } = await verificarPunto(lat, lon)
    if (data.zona) {
      resultado.value = { visible: true, type: 'found', label: 'Zona identificada', zona: data.zona, coords: lat + ', ' + lon }
      colocarMarcador(lat, lon, '#00e5a0')
    } else {
      resultado.value = { visible: true, type: 'notfound', label: 'Sin coincidencia', zona: 'Fuera de todas las zonas', coords: lat + ', ' + lon }
      colocarMarcador(lat, lon, '#ff4d6a')
    }
  } catch (err) {
    resultado.value = { visible: true, type: 'notfound', label: 'Error', zona: 'No se pudo conectar', coords: '' }
  }
}

function verificarDesdeCaptura() {
  if (capturedLat.value === null) return
  verificar(capturedLat.value, capturedLon.value)
}

function verificarManual() {
  var lat = parseFloat(latInput.value)
  var lon = parseFloat(lonInput.value)
  if (isNaN(lat) || isNaN(lon)) {
    resultado.value = { visible: true, type: 'notfound', label: 'Error', zona: 'Coordenadas invalidas', coords: '' }
    return
  }
  verificar(lat, lon)
}
</script>

<style scoped>
.verif-layout {
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
  overflow-y: auto;
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

.tabs {
  display: flex;
  gap: 4px;
}

.tab {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: none;
  color: #6b6b80;
  font-family: 'Syne', sans-serif;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.12s;
  text-align: center;
}

.tab.active {
  background: rgba(124, 111, 255, 0.15);
  border-color: rgba(124, 111, 255, 0.4);
  color: #7c6fff;
}

.tab:hover:not(.active) {
  color: #f0f0f5;
}

.coords-box {
  background: #1a1a24;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 10px 12px;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: #6b6b80;
  margin-bottom: 10px;
}

.coord-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
}

.cv {
  color: #f0f0f5;
}

.coord-hint {
  font-size: 10px;
  text-align: center;
  padding: 4px 0;
  color: #4a4a5a;
}

.field {
  margin-bottom: 10px;
}

.field label {
  font-size: 10px;
  color: #6b6b80;
  margin-bottom: 4px;
  display: block;
  font-family: 'DM Mono', monospace;
}

.field input {
  width: 100%;
  padding: 9px 12px;
  background: #1a1a24;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  color: #f0f0f5;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  outline: none;
}

.field input:focus {
  border-color: #7c6fff;
}

.btn-check {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  background: rgba(124, 111, 255, 0.15);
  border: 1px solid rgba(124, 111, 255, 0.35);
  color: #f0f0f5;
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: all 0.15s;
}

.btn-check:hover {
  background: rgba(124, 111, 255, 0.3);
}

.btn-check:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.result {
  border-radius: 8px;
  padding: 14px;
}

.result.found {
  background: rgba(0, 229, 160, 0.08);
  border: 1px solid rgba(0, 229, 160, 0.25);
}

.result.notfound {
  background: rgba(255, 77, 106, 0.08);
  border: 1px solid rgba(255, 77, 106, 0.25);
}

.result.loading {
  background: rgba(124, 111, 255, 0.08);
  border: 1px solid rgba(124, 111, 255, 0.25);
}

.result-tag {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 6px;
  color: #6b6b80;
}

.result-val {
  font-size: 16px;
  font-weight: 700;
}

.result.found .result-val {
  color: #00e5a0;
}

.result.notfound .result-val {
  color: #ff4d6a;
  font-size: 13px;
}

.result.loading .result-val {
  color: #7c6fff;
  font-size: 13px;
}

.result-xy {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #4a4a5a;
  margin-top: 4px;
}

.result-empty {
  font-size: 11px;
  color: #4a4a5a;
  text-align: center;
  padding: 6px 0;
}

.map-area {
  flex: 1;
  height: 100%;
  cursor: crosshair;
}
</style>