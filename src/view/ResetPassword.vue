<template>
  <div class="reset-page">
    <div class="reset-card">
      <div class="card-header">
        <div class="card-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" stroke-width="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <div class="card-title">Nueva contrasena</div>
        <div class="card-sub">Ingresa tu nueva contrasena para restablecer el acceso</div>
      </div>

      <div v-if="!exito" class="form">
        <div class="field">
          <label>Nueva contrasena</label>
          <input v-model="password" type="password" placeholder="Minimo 6 caracteres"/>
        </div>
        <div class="field">
          <label>Confirmar contrasena</label>
          <input v-model="confirmPassword" type="password" placeholder="Repite tu contrasena" @keydown.enter="cambiar"/>
        </div>
        <button class="btn-primary" @click="cambiar" :disabled="loading">
          {{ loading ? 'Actualizando...' : 'Cambiar contrasena' }}
        </button>
      </div>

      <div v-if="exito" class="success-box">
        <div class="success-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="success-title">Contrasena actualizada</div>
        <div class="success-sub">Tu contrasena ha sido cambiada exitosamente. Ya puedes iniciar sesion.</div>
        <router-link to="/portal" class="btn-primary" style="text-align:center;text-decoration:none;display:block;">Ir al login</router-link>
      </div>

      <div v-if="mensaje.visible" class="msg" :class="mensaje.type">
        {{ mensaje.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { cambiarPassword } from '../api/zonas.js'

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const exito = ref(false)
const accessToken = ref('')
const mensaje = ref({ visible: false, text: '', type: '' })

onMounted(function() {
  var hash = window.location.hash
  var tokenMatch = hash.match(/access_token=([^&]+)/)
  if (tokenMatch) {
    accessToken.value = tokenMatch[1]
  }
  if (!accessToken.value) {
    var fullUrl = window.location.href
    var tokenMatch2 = fullUrl.match(/access_token=([^&]+)/)
    if (tokenMatch2) {
      accessToken.value = tokenMatch2[1]
    }
  }
})

async function cambiar() {
  if (!password.value || !confirmPassword.value) {
    showMsg('Completa ambos campos', 'error')
    return
  }
  if (password.value.length < 6) {
    showMsg('La contrasena debe tener minimo 6 caracteres', 'error')
    return
  }
  if (password.value !== confirmPassword.value) {
    showMsg('Las contrasenas no coinciden', 'error')
    return
  }
  if (!accessToken.value) {
    showMsg('Token de recuperacion no encontrado. Solicita un nuevo enlace.', 'error')
    return
  }
  loading.value = true
  try {
    await cambiarPassword(accessToken.value, password.value)
    exito.value = true
  } catch (err) {
    var msg = err.response?.data?.detail || 'Error al cambiar la contrasena'
    showMsg(msg, 'error')
  }
  loading.value = false
}

function showMsg(text, type) {
  mensaje.value = { visible: true, text: text, type: type }
  setTimeout(function() { mensaje.value.visible = false }, 5000)
}
</script>

<style scoped>
.reset-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0f;
}

.reset-card {
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
  background: rgba(0, 229, 160, 0.1);
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
  line-height: 1.5;
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
  border-color: #00e5a0;
}

.field input::placeholder {
  color: #4a4a5a;
}

.btn-primary {
  padding: 12px;
  border-radius: 8px;
  background: #00e5a0;
  border: none;
  color: #000;
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
  background: #00ffb0;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.success-box {
  text-align: center;
}

.success-icon {
  margin-bottom: 16px;
}

.success-title {
  font-size: 18px;
  font-weight: 700;
  color: #00e5a0;
  margin-bottom: 8px;
}

.success-sub {
  font-size: 13px;
  color: #6b6b80;
  margin-bottom: 24px;
  line-height: 1.5;
}

.msg {
  margin-top: 14px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
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
</style>