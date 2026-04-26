<template>
  <div class="dashboard-layout">
    <div class="dash-panel">
      <div class="panel-header">
        <div class="panel-title">Dashboard</div>
        <div class="panel-sub">{{ cliente.empresa || '' }}</div>
        <button class="btn-logout" @click="cerrarSesion">Salir</button>
      </div>

      <div class="panel-section">
        <div class="panel-label">Mi plan</div>
        <div class="plan-card" :class="planInfo.plan">
          <div class="plan-name">{{ planInfo.plan.toUpperCase() }}</div>
          <div class="plan-consultas">
            <span class="plan-val">{{ planInfo.consultas_restantes }}</span>
            <span class="plan-de"> / {{ planInfo.consultas_mes }}</span>
          </div>
          <div class="plan-bar-bg">
            <div class="plan-bar-fill" :style="{ width: porcentajeUso + '%' }"></div>
          </div>
          <div class="plan-bar-label">Consultas restantes este mes</div>
        </div>
        <button v-if="planInfo.plan === 'starter'" class="btn-upgrade" @click="iniciarPago('business')">
          Upgrade a Business - $49/mes
        </button>
      </div>

      <div class="panel-section">
        <div class="panel-label">
          Mis API Keys
          <span class="badge">{{ keys.length }}/{{ planInfo.max_api_keys }}</span>
        </div>

        <div v-for="key in keys" :key="key.id" class="key-card">
          <div class="key-info">
            <div class="key-name">{{ key.nombre }}</div>
            <div class="key-value">{{ key.api_key }}</div>
          </div>
          <div class="key-actions">
            <button class="btn-copy" @click="copiar(key.api_key)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
            <button class="btn-revoke" @click="revocar(key.id)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
            </button>
          </div>
        </div>

        <div class="new-key-row">
          <input v-model="nuevaKeyNombre" type="text" placeholder="Nombre de la key" class="new-key-input"/>
          <button class="btn-new-key" @click="generarKey">+ Nueva key</button>
        </div>
      </div>

      <div class="panel-section">
        <div class="panel-label">Consumo</div>
        <div class="stat-cards">
          <div class="stat">
            <div class="stat-val">{{ consumo.total }}</div>
            <div class="stat-label">Peticiones totales</div>
          </div>
        </div>
      </div>

      <div class="panel-section">
        <div class="panel-label">Documentacion rapida</div>
        <div class="doc-block">
          <div class="doc-title">Verificar punto</div>
          <div class="doc-method">POST /zonas/verificar</div>
          <pre class="doc-code">curl -X POST \
  https://zonas-app-production.up.railway.app/zonas/verificar \
  -H "Content-Type: application/json" \
  -H "x-api-key: TU_API_KEY" \
  -d '{"lat": 4.825, "lon": -74.005}'</pre>
          <div class="doc-title" style="margin-top: 14px;">Respuesta</div>
          <pre class="doc-code">{
  "zona": "Zona Norte",
  "todas": [
    { "id": "...", "nombre": "Zona Norte" }
  ]
}</pre>
        </div>
        <a class="btn-docs" href="https://zonas-app-production.up.railway.app/docs" target="_blank">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Ver documentacion completa (Swagger)
        </a>
      </div>
    </div>

    <div class="dash-main">
      <div class="welcome">
        <div class="welcome-title">Bienvenido, {{ cliente.nombre }}</div>
        <div class="welcome-sub">Desde aqui puedes gestionar tus API Keys, monitorear el consumo y administrar tu plan.</div>
      </div>

      <div class="cards-grid">
        <div class="info-card">
          <div class="info-icon" style="background: rgba(0, 229, 160, 0.1);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="info-title">API Key segura</div>
          <div class="info-text">Cada key es unica y puede ser revocada en cualquier momento</div>
        </div>
        <div class="info-card">
          <div class="info-icon" style="background: rgba(124, 111, 255, 0.1);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c6fff" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div class="info-title">Verificacion de zonas</div>
          <div class="info-text">Envia lat/lon y recibe la zona correspondiente al instante</div>
        </div>
        <div class="info-card">
          <div class="info-icon" style="background: rgba(255, 159, 67, 0.1);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff9f43" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div class="info-title">Monitoreo en tiempo real</div>
          <div class="info-text">Visualiza cuantas peticiones has realizado desde tu cuenta</div>
        </div>
      </div>

      <div v-if="planInfo.plan === 'starter'" class="upgrade-banner">
        <div class="upgrade-info">
          <div class="upgrade-title">Desbloquea mas poder</div>
          <div class="upgrade-text">Con el plan Business obtienes 50,000 consultas/mes, 5 API Keys y soporte prioritario.</div>
        </div>
        <button class="btn-upgrade-lg" @click="iniciarPago('business')">Upgrade a Business - $49/mes</button>
      </div>
    </div>

    <div v-if="toast.visible" class="toast-msg" :class="toast.type">
      {{ toast.msg }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMisKeys, crearMiKey, revocarMiKey, getMiConsumo, getMiPlan, crearPago, verificarPago } from '../api/zonas.js'

const router = useRouter()
const cliente = ref({})
const keys = ref([])
const consumo = reactive({ total: 0 })
const planInfo = reactive({ plan: 'starter', consultas_restantes: 0, consultas_mes: 1000, max_api_keys: 1 })
const nuevaKeyNombre = ref('')
const toast = ref({ visible: false, msg: '', type: '' })

const porcentajeUso = computed(function() {
  if (planInfo.consultas_mes === 0) return 0
  return Math.round((planInfo.consultas_restantes / planInfo.consultas_mes) * 100)
})

onMounted(async function() {
  var token = localStorage.getItem('gz_token')
  var clienteStr = localStorage.getItem('gz_cliente')
  if (!token || !clienteStr) {
    router.push('/portal')
    return
  }
  cliente.value = JSON.parse(clienteStr)
  await cargarKeys()
  await cargarConsumo()
  await cargarPlan()

  var pendingRef = localStorage.getItem('gz_pago_ref')
  if (pendingRef) {
    try {
      var token2 = localStorage.getItem('gz_token')
      var resultado = await verificarPago(token2, pendingRef)
      var pagoData = resultado.data
      if (pagoData.estado === 'APPROVED') {
        localStorage.removeItem('gz_pago_ref')
        localStorage.removeItem('gz_pago_plan')
        showToast('Pago aprobado. Plan actualizado a ' + pagoData.plan, 'success')
        await cargarPlan()
      } else {
        localStorage.removeItem('gz_pago_ref')
        localStorage.removeItem('gz_pago_plan')
        showToast('El pago no fue aprobado: ' + pagoData.estado, 'error')
      }
    } catch (err) {
      localStorage.removeItem('gz_pago_ref')
      localStorage.removeItem('gz_pago_plan')
    }
  }
})

async function cargarKeys() {
  var token = localStorage.getItem('gz_token')
  try {
    const { data } = await getMisKeys(token)
    keys.value = data
  } catch (err) {
    if (err.response && err.response.status === 401) {
      cerrarSesion()
    }
  }
}

async function cargarConsumo() {
  var token = localStorage.getItem('gz_token')
  try {
    const { data } = await getMiConsumo(token)
    consumo.total = data.total
  } catch (err) {
    consumo.total = 0
  }
}

async function cargarPlan() {
  var token = localStorage.getItem('gz_token')
  try {
    const { data } = await getMiPlan(token)
    planInfo.plan = data.plan
    planInfo.consultas_restantes = data.consultas_restantes
    planInfo.consultas_mes = data.consultas_mes
    planInfo.max_api_keys = data.max_api_keys
  } catch (err) {
    console.error('Error cargando plan', err)
  }
}

async function generarKey() {
  var nombre = nuevaKeyNombre.value.trim() || 'key-' + Date.now()
  var token = localStorage.getItem('gz_token')
  try {
    await crearMiKey(token, nombre)
    nuevaKeyNombre.value = ''
    await cargarKeys()
    showToast('API Key generada', 'success')
  } catch (err) {
    var msg = err.response?.data?.detail || 'Error al generar key'
    showToast(msg, 'error')
  }
}

async function revocar(id) {
  var token = localStorage.getItem('gz_token')
  try {
    await revocarMiKey(token, id)
    await cargarKeys()
    showToast('API Key revocada', 'success')
  } catch (err) {
    showToast('Error al revocar', 'error')
  }
}

async function iniciarPago(plan) {
  var token = localStorage.getItem('gz_token')
  try {
    const { data } = await crearPago(token, plan)
    localStorage.setItem('gz_pago_ref', data.referencia)
    localStorage.setItem('gz_pago_plan', data.plan)
    var url = 'https://checkout.wompi.co/p/' +
      '?public-key=' + data.public_key +
      '&currency=' + data.moneda +
      '&amount-in-cents=' + data.monto +
      '&reference=' + data.referencia +
      '&signature:integrity=' + data.integrity +
      '&redirect-url=' + encodeURIComponent(data.redirect_url)
    window.location.href = url
  } catch (err) {
    var msg = err.response?.data?.detail || 'Error al iniciar pago'
    showToast(msg, 'error')
  }
}

function copiar(text) {
  navigator.clipboard.writeText(text)
  showToast('API Key copiada al portapapeles', 'success')
}

function cerrarSesion() {
  localStorage.removeItem('gz_token')
  localStorage.removeItem('gz_cliente')
  localStorage.removeItem('gz_api_key')
  router.push('/portal')
}

function showToast(msg, type) {
  toast.value = { visible: true, msg: msg, type: type }
  setTimeout(function() { toast.value.visible = false }, 2800)
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  width: 100%;
  height: 100%;
}

.dash-panel {
  width: 340px;
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
  position: relative;
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

.btn-logout {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: 1px solid rgba(255, 77, 106, 0.3);
  color: #ff4d6a;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-logout:hover {
  background: rgba(255, 77, 106, 0.1);
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
  background: rgba(124, 111, 255, 0.15);
  color: #7c6fff;
  padding: 1px 7px;
  border-radius: 10px;
  font-size: 10px;
}

.plan-card {
  background: #1a1a24;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 10px;
}

.plan-card.business {
  border-color: rgba(124, 111, 255, 0.3);
}

.plan-card.enterprise {
  border-color: rgba(0, 229, 160, 0.3);
}

.plan-name {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #7c6fff;
  margin-bottom: 10px;
}

.plan-card.starter .plan-name { color: #6b6b80; }
.plan-card.business .plan-name { color: #7c6fff; }
.plan-card.enterprise .plan-name { color: #00e5a0; }

.plan-consultas {
  margin-bottom: 8px;
}

.plan-val {
  font-size: 24px;
  font-weight: 700;
  color: #f0f0f5;
}

.plan-de {
  font-size: 14px;
  color: #4a4a5a;
}

.plan-bar-bg {
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.plan-bar-fill {
  height: 100%;
  background: #00e5a0;
  border-radius: 3px;
  transition: width 0.3s;
}

.plan-bar-label {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  color: #4a4a5a;
}

.btn-upgrade {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  background: rgba(124, 111, 255, 0.15);
  border: 1px solid rgba(124, 111, 255, 0.3);
  color: #7c6fff;
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-upgrade:hover {
  background: rgba(124, 111, 255, 0.25);
}

.key-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: #1a1a24;
  margin-bottom: 6px;
}

.key-info {
  flex: 1;
  min-width: 0;
}

.key-name {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 2px;
}

.key-value {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  color: #4a4a5a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.key-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.btn-copy {
  background: none;
  border: none;
  color: #6b6b80;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.btn-copy:hover {
  color: #00e5a0;
  background: rgba(0, 229, 160, 0.1);
}

.btn-revoke {
  background: none;
  border: none;
  color: #6b6b80;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.btn-revoke:hover {
  color: #ff4d6a;
  background: rgba(255, 77, 106, 0.1);
}

.new-key-row {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.new-key-input {
  flex: 1;
  padding: 8px 10px;
  background: #1a1a24;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  color: #f0f0f5;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  outline: none;
}

.new-key-input:focus {
  border-color: #7c6fff;
}

.btn-new-key {
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(124, 111, 255, 0.15);
  border: 1px solid rgba(124, 111, 255, 0.3);
  color: #7c6fff;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  cursor: pointer;
  white-space: nowrap;
}

.btn-new-key:hover {
  background: rgba(124, 111, 255, 0.25);
}

.stat-cards {
  display: flex;
  gap: 8px;
}

.stat {
  flex: 1;
  background: #1a1a24;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 14px;
  text-align: center;
}

.stat-val {
  font-size: 24px;
  font-weight: 700;
  color: #00e5a0;
}

.stat-label {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  color: #4a4a5a;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.doc-block {
  background: #1a1a24;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 10px;
}

.doc-title {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
}

.doc-method {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: #7c6fff;
  margin-bottom: 8px;
}

.doc-code {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #9090a0;
  background: #0e0e15;
  border-radius: 6px;
  padding: 10px;
  overflow-x: auto;
  white-space: pre;
  margin: 0;
}

.btn-docs {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 6px;
  background: rgba(124, 111, 255, 0.1);
  border: 1px solid rgba(124, 111, 255, 0.25);
  color: #7c6fff;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s;
}

.btn-docs:hover {
  background: rgba(124, 111, 255, 0.2);
}

.dash-main {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  background: #0a0a0f;
}

.welcome {
  margin-bottom: 28px;
}

.welcome-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
}

.welcome-sub {
  font-size: 13px;
  color: #6b6b80;
  line-height: 1.6;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.info-card {
  background: #13131a;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 20px;
}

.info-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.info-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
}

.info-text {
  font-size: 12px;
  color: #6b6b80;
  line-height: 1.5;
}

.upgrade-banner {
  background: #13131a;
  border: 1px solid rgba(124, 111, 255, 0.25);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.upgrade-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.upgrade-text {
  font-size: 12px;
  color: #6b6b80;
}

.btn-upgrade-lg {
  padding: 12px 24px;
  border-radius: 8px;
  background: #7c6fff;
  border: none;
  color: white;
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.btn-upgrade-lg:hover {
  background: #9080ff;
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