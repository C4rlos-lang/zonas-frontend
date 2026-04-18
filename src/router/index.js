import { createRouter, createWebHashHistory } from 'vue-router'
import Admin from '../view/Admin.vue'
import Verificador from '../view/Verificador.vue'

const routes = [
  { path: '/', redirect: '/admin' },
  { path: '/admin', component: Admin },
  { path: '/verificador', component: Verificador }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})