<template>
  <div class="portal-login">
    <div class="login-card">
      <div class="card-header">
        <div class="card-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7c6fff" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9l3 3-3 3"/>
            <line x1="15" y1="15" x2="19" y2="15"/>
          </svg>
        </div>
        <div class="card-title">GeoZonas API</div>
        <div class="card-sub">Portal de desarrollador</div>
      </div>

      <div class="tabs">
        <button class="tab" :class="{ active: modo === 'login' }" @click="modo = 'login'">Iniciar sesion</button>
        <button class="tab" :class="{ active: modo === 'registro' }" @click="modo = 'registro'">Registrarse</button>
      </div>

      <div v-if="modo === 'registro'" class="form">
        <div class="field">
          <label>Nombre completo</label>
          <input v-model="reg.nombre" type="text" placeholder="Tu nombre"/>
        </div>
        <div class="field">
          <label>Empresa</label>
          <input v-model="reg.empresa" type="text" placeholder="Nombre de tu empresa"/>
        </div>
        <div class="field">
          <label>Email</label>
          <input v-model="reg.email" type="email" placeholder="tu@empresa.com"/>
        </div>
        <div class="field">
          <label>Password</label>
          <input v-model="reg.password" type="password" placeholder="Minimo 6 caracteres" @keydown.enter="registrar"/>
        </div>
        <button class="btn-primary" @click="registrar" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Crear cuenta' }}
        </button>
      </div>

      <div v-if="modo === 'login'" class="form">
        <div class="field">
          <label>Email</label>
          <input v-model="log.email" type="email" placeholder="tu@empresa.com"/>
        </div>
        <div class="field">
          <label>Password</label>
          <input v-model="log.password" type="password" placeholder="Tu password" @keydown.enter="iniciarSesion"/>
        </div>
        <button class="btn-primary" @click="iniciarSesion" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Iniciar sesion' }}
        </button>
      </div>

      <div v-if="mensaje.visible" class="msg" :class="mensaje.type">
        {{ mensaje.text }}
      </div>

      <div class="features">
        <div class="feature">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Genera tus API Keys</span>
        </div>
        <div class="feature">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Documentacion interactiva</span>
        </div>
        <div class="feature">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Monitorea tu consumo</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { registro, login } from '../api/zonas.js'

const router = useRouter()
const modo = ref('login')
const loading = ref(false)
const mensaje = ref({ visible: false, text: '', type: '' })

const reg = reactive({ nombre: '', empresa: '', email: '', password: '' })
const log = reactive({ email: '', password: '' })

async function registrar() {
  if (!reg.nombre || !reg.empresa || !reg.email || !reg.password) {
    showMsg('Completa todos los campos', 'error')
    return
  }
  if (reg.password.length < 6) {
    showMsg('El password debe tener minimo 6 caracteres', 'error')
    return
  }
  loading.value = true
  try {
    const { data } = await registro(reg)
    localStorage.setItem('gz_token', data.token || '')
    localStorage.setItem('gz_cliente', JSON.stringify(data.cliente))
    localStorage.setItem('gz_api_key', data.api_key)
    showMsg('Registro exitoso. Tu API Key: ' + data.api_key, 'success')
    setTimeout(() => {
      router.push('/portal/dashboard')
    }, 2000)
  } catch (err) {
    var msg = err.response?.data?.detail || 'Error en el registro'
    showMsg(msg, 'error')
  }
  loading.value = false
}

async function iniciarSesion() {
  if (!log.email || !log.password) {
    showMsg('Ingresa email y password', 'error')
    return
  }
  loading.value = true
  try {
    const { data } = await login(log)
    localStorage.setItem('gz_token', data.token)
    localStorage.setItem('gz_cliente', JSON.stringify(data.cliente))
    router.push('/portal/dashboard')
  } catch (err) {
    var msg = err.response?.data?.detail || 'Credenciales invalidas'
    showMsg(msg, 'error')
  }
  loading.value = false
}

function showMsg(text, type) {
  mensaje.value = { visible: true, text: text, type: type }
  setTimeout(() => { mensaje.value.visible = false }, 5000)
}
</script>

<style scoped>
.portal-login {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0f;
}

.login-card {
  width: 380px;
  background: #13131a;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 32px;
}

.card-header {
  text-align: center;
  margin-bottom: 24px;
}

.card-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(124, 111, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
}

.card-sub {
  font-size: 12px;
  color: #6b6b80;
  margin-top: 4px;
}

.tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
  background: #1a1a24;
  border-radius: 8px;
  padding: 3px;
}

.tab {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: none;
  background: none;
  color: #6b6b80;
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}

.tab.active {
  background: rgba(124, 111, 255, 0.2);
  color: #7c6fff;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field label {
  font-size: 11px;
  color: #6b6b80;
  font-family: 'DM Mono', monospace;
}

.field input {
  padding: 10px 12px;
  background: #1a1a24;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 6px;
  color: #f0f0f5;
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;
}

.field input:focus {
  border-color: #7c6fff;
}

.field input::placeholder {
  color: #4a4a5a;
}

.btn-primary {
  padding: 12px;
  border-radius: 8px;
  background: #7c6fff;
  border: none;
  color: white;
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: all 0.15s;
  margin-top: 4px;
}

.btn-primary:hover {
  background: #9080ff;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.msg {
  margin-top: 14px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  word-break: break-all;
}

.msg.success {
  background: rgba(0, 229, 160, 0.1);
  border: 1px solid rgba(0, 229, 160, 0.3);
  color: #00e5a0;
}

.msg.error {
  background: rgba(255, 77, 106, 0.1);
  border: 1px solid rgba(255, 77, 106, 0.3);
  color: #ff4d6a;
}

.features {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #6b6b80;
}
</style>