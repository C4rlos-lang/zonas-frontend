import { createRouter, createWebHashHistory } from 'vue-router'
import Landing from '../view/Landing.vue'
import Admin from '../view/Admin.vue'
import Verificador from '../view/Verificador.vue'
import PortalLogin from '../view/PortalLogin.vue'
import PortalDashboard from '../view/PortalDashboard.vue'
import { validarToken } from '../api/zonas.js'

const routes = [
  { path: '/', component: Landing, meta: { publica: true, landing: true } },
  { path: '/portal', component: PortalLogin, meta: { publica: true } },
  { path: '/admin', component: Admin },
  { path: '/verificador', component: Verificador },
  { path: '/portal/dashboard', component: PortalDashboard }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.publica) {
    next()
    return
  }
  var token = localStorage.getItem('gz_token')
  if (!token) {
    next('/portal')
    return
  }
  try {
    await validarToken(token)
    next()
  } catch (err) {
    localStorage.removeItem('gz_token')
    localStorage.removeItem('gz_cliente')
    localStorage.removeItem('gz_api_key')
    next('/portal')
  }
})

export default router