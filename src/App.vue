<template>
  <div id="app">
    <aside v-if="logueado && !esLanding" class="nav-sidebar">
      <div class="nav-logo">
        <div class="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div class="logo-info">
          <span class="logo-name">GeoZonas</span>
          <span class="logo-sub">Transporte</span>
        </div>
      </div>

      <nav class="nav-menu">
        <div class="nav-section-label">Admin</div>
        <router-link to="/admin" class="nav-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
          </svg>
          <span>Admin zonas</span>
        </router-link>
        <router-link to="/verificador" class="nav-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>Verificador</span>
        </router-link>

        <div class="nav-section-label" style="margin-top: 16px;">Developers</div>
        <router-link to="/portal/dashboard" class="nav-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9l3 3-3 3"/>
            <line x1="15" y1="15" x2="19" y2="15"/>
          </svg>
          <span>Portal API</span>
        </router-link>
      </nav>

      <div class="nav-footer">
        <div class="nav-user">
          <span>{{ nombreUsuario }}</span>
        </div>
        <button class="btn-logout" @click="cerrarSesion">Cerrar sesion</button>
      </div>
    </aside>

    <div class="content-area">
      <router-view />
    </div>

    <div v-if="mostrarAviso" class="session-warning">
      <div class="session-card">
        <div class="session-title">Tu sesion va a expirar</div>
        <div class="session-sub">Llevas 25 minutos sin actividad. La sesion se cerrara en <span class="session-countdown">{{ countdown }}</span> segundos.</div>
        <div class="session-btns">
          <button class="session-btn-stay" @click="mantenerSesion">Continuar trabajando</button>
          <button class="session-btn-close" @click="cerrarSesion">Cerrar sesion</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const logueado = ref(false)
const nombreUsuario = ref('')
const esLanding = computed(() => route.path === '/')
const mostrarAviso = ref(false)
const countdown = ref(300)

var timerInactividad = null
var timerAviso = null
var timerCountdown = null
var TIEMPO_INACTIVIDAD = 25 * 60 * 1000
var TIEMPO_AVISO = 5 * 60 * 1000

function verificarSesion() {
  var token = localStorage.getItem('gz_token')
  var clienteStr = localStorage.getItem('gz_cliente')
  if (token && clienteStr) {
    logueado.value = true
    var cliente = JSON.parse(clienteStr)
    nombreUsuario.value = cliente.nombre || ''
  } else {
    logueado.value = false
    nombreUsuario.value = ''
  }
}

function cerrarSesion() {
  limpiarTimers()
  mostrarAviso.value = false
  localStorage.removeItem('gz_token')
  localStorage.removeItem('gz_cliente')
  localStorage.removeItem('gz_api_key')
  logueado.value = false
  nombreUsuario.value = ''
  router.push('/portal')
}

function resetearInactividad() {
  if (!logueado.value) return
  limpiarTimers()
  mostrarAviso.value = false

  timerInactividad = setTimeout(function() {
    mostrarAviso.value = true
    countdown.value = Math.floor(TIEMPO_AVISO / 1000)

    timerCountdown = setInterval(function() {
      countdown.value = countdown.value - 1
      if (countdown.value <= 0) {
        cerrarSesion()
      }
    }, 1000)

    timerAviso = setTimeout(function() {
      cerrarSesion()
    }, TIEMPO_AVISO)
  }, TIEMPO_INACTIVIDAD)
}

function mantenerSesion() {
  mostrarAviso.value = false
  resetearInactividad()
}

function limpiarTimers() {
  if (timerInactividad) clearTimeout(timerInactividad)
  if (timerAviso) clearTimeout(timerAviso)
  if (timerCountdown) clearInterval(timerCountdown)
  timerInactividad = null
  timerAviso = null
  timerCountdown = null
}

function onActividad() {
  if (mostrarAviso.value) return
  resetearInactividad()
}

onMounted(function() {
  verificarSesion()
  if (logueado.value) {
    resetearInactividad()
  }
  window.addEventListener('mousemove', onActividad)
  window.addEventListener('keydown', onActividad)
  window.addEventListener('click', onActividad)
  window.addEventListener('scroll', onActividad)
  window.addEventListener('touchstart', onActividad)
})

onUnmounted(function() {
  limpiarTimers()
  window.removeEventListener('mousemove', onActividad)
  window.removeEventListener('keydown', onActividad)
  window.removeEventListener('click', onActividad)
  window.removeEventListener('scroll', onActividad)
  window.removeEventListener('touchstart', onActividad)
})

watch(() => route.path, function() {
  verificarSesion()
  if (logueado.value) {
    resetearInactividad()
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  font-family: 'Syne', sans-serif;
  background: #0e0e15;
  color: #f0f0f5;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

#app {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.nav-sidebar {
  width: 180px;
  flex-shrink: 0;
  background: #0e0e15;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(0, 229, 160, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-info {
  display: flex;
  flex-direction: column;
}

.logo-name {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.logo-sub {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  color: #00e5a0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nav-menu {
  flex: 1;
  padding: 14px 8px;
}

.nav-section-label {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  color: #4a4a5a;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 0 8px;
  margin-bottom: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 10px;
  border-radius: 6px;
  color: #6b6b80;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.15s;
  margin-bottom: 2px;
}

.nav-item:hover {
  color: #f0f0f5;
  background: rgba(255, 255, 255, 0.04);
}

.nav-item.router-link-active {
  color: #00e5a0;
  background: rgba(0, 229, 160, 0.08);
}

.nav-item.router-link-active svg {
  stroke: #00e5a0;
}

.nav-footer {
  padding: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.nav-user {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #6b6b80;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-logout {
  width: 100%;
  padding: 7px;
  border-radius: 6px;
  background: none;
  border: 1px solid rgba(255, 77, 106, 0.25);
  color: #ff4d6a;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-logout:hover {
  background: rgba(255, 77, 106, 0.1);
}

.content-area {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.session-warning {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.session-card {
  background: #13131a;
  border: 1px solid rgba(255, 159, 67, 0.3);
  border-radius: 16px;
  padding: 32px;
  width: 380px;
  text-align: center;
}

.session-title {
  font-size: 18px;
  font-weight: 700;
  color: #ff9f43;
  margin-bottom: 10px;
}

.session-sub {
  font-size: 13px;
  color: #6b6b80;
  line-height: 1.6;
  margin-bottom: 24px;
}

.session-countdown {
  color: #ff9f43;
  font-weight: 700;
  font-family: 'DM Mono', monospace;
}

.session-btns {
  display: flex;
  gap: 10px;
}

.session-btn-stay {
  flex: 2;
  padding: 12px;
  border-radius: 8px;
  background: #00e5a0;
  border: none;
  color: #000;
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.session-btn-stay:hover {
  background: #00ffb0;
}

.session-btn-close {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  background: none;
  border: 1px solid rgba(255, 77, 106, 0.3);
  color: #ff4d6a;
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.session-btn-close:hover {
  background: rgba(255, 77, 106, 0.1);
}
</style>