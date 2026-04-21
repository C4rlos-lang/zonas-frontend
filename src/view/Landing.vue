<template>
  <div class="landing">

    <header class="land-header">
      <div class="hdr-inner">
        <div class="hdr-logo">
          <div class="hdr-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <span class="hdr-logo-text">GeoZonas</span>
          <span class="hdr-origin">DE</span>
        </div>
        <nav class="hdr-nav">
          <a @click.prevent="scrollTo('servicios')">Servicios</a>
          <a @click.prevent="scrollTo('como-funciona')">Como funciona</a>
          <a @click.prevent="scrollTo('clientes')">Clientes</a>
          <a @click.prevent="scrollTo('precios')">Precios</a>
          <a @click.prevent="scrollTo('docs')">API Docs</a>
        </nav>
        <div class="hdr-actions">
          <router-link to="/portal" class="btn-login">Iniciar sesion</router-link>
          <router-link to="/portal" class="btn-cta-sm">Empezar gratis</router-link>
        </div>
      </div>
    </header>

    <section class="hero">
      <div class="hero-badge">Plataforma de geocercas inteligentes - Made in Germany</div>
      <h1 class="hero-title">Geofencing de precision<br>para logistica global</h1>
      <p class="hero-sub">
        Plataforma de delimitacion geoespacial que permite crear, gestionar y consultar
        geocercas poligonales en tiempo real. Optimiza tus operaciones de distribucion
        con verificacion automatizada de cobertura territorial.
      </p>
      <div class="hero-btns">
        <router-link to="/portal" class="btn-primary-lg">Crear cuenta gratuita</router-link>
        <a @click.prevent="scrollTo('docs')" class="btn-secondary-lg">Ver documentacion API</a>
      </div>
      <div class="hero-stats">
        <div class="hstat">
          <span class="hstat-val">&lt; 50ms</span>
          <span class="hstat-label">Latencia promedio</span>
        </div>
        <div class="hstat-sep"></div>
        <div class="hstat">
          <span class="hstat-val">99.9%</span>
          <span class="hstat-label">Uptime garantizado</span>
        </div>
        <div class="hstat-sep"></div>
        <div class="hstat">
          <span class="hstat-val">250K+</span>
          <span class="hstat-label">Requests / mes</span>
        </div>
      </div>
    </section>

    <section class="servicios" id="servicios">
      <div class="section-inner">
        <div class="section-tag">Servicios</div>
        <h2 class="section-title">Tres soluciones, un ecosistema</h2>
        <p class="section-sub">Desde la creacion de geocercas hasta la optimizacion de rutas, cubrimos toda la cadena de geolocalizacion logistica.</p>

        <div class="srv-grid">
          <div class="srv-card">
            <div class="srv-icon" style="background: rgba(0, 229, 160, 0.1);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" stroke-width="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="srv-name">GeoPunteo</div>
            <div class="srv-tag">Verificacion geoespacial en tiempo real</div>
            <p class="srv-desc">
              Sistema de geocodificacion inversa que identifica la pertenencia territorial de cualquier
              coordenada GPS. Integrable via API REST o mediante componente embebible (iframe/widget)
              directamente en plataformas de terceros. Soporta point-in-polygon con algoritmo
              ray casting de alta precision.
            </p>
            <div class="srv-features">
              <span>API REST</span>
              <span>Widget embebible</span>
              <span>Clic en mapa</span>
              <span>Entrada manual lat/lon</span>
            </div>
          </div>

          <div class="srv-card featured">
            <div class="srv-badge">Mas popular</div>
            <div class="srv-icon" style="background: rgba(124, 111, 255, 0.1);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c6fff" stroke-width="1.5">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/>
              </svg>
            </div>
            <div class="srv-name">GeoPoligonos</div>
            <div class="srv-tag">Creacion y gestion de geocercas poligonales</div>
            <p class="srv-desc">
              Motor de geocercas (geofencing) basado en poligonos irregulares con validacion topologica.
              Incluye deteccion de sobreposicion mediante analisis booleano (Turf.js), control de unicidad
              nominal y persistencia en base de datos geoespacial. Consumo via API RESTful o interfaz
              cartografica interactiva con Leaflet.
            </p>
            <div class="srv-features">
              <span>Poligonos irregulares</span>
              <span>Validacion topologica</span>
              <span>API + interfaz web</span>
              <span>Anti-sobreposicion</span>
            </div>
          </div>

          <div class="srv-card">
            <div class="srv-icon" style="background: rgba(255, 159, 67, 0.1);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff9f43" stroke-width="1.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div class="srv-name">GeoRuteo</div>
            <div class="srv-tag">Optimizacion inteligente de rutas de distribucion</div>
            <p class="srv-desc">
              Algoritmo de Vehicle Routing Problem (VRP) con restricciones de capacidad vehicular,
              ventanas horarias (time windows), volumetria de carga y prioridad de entregas.
              Optimiza secuencia de paradas minimizando distancia total y tiempo de operacion.
              Integrable con flotas heterogeneas.
            </p>
            <div class="srv-features">
              <span>VRP multi-vehiculo</span>
              <span>Ventanas horarias</span>
              <span>Volumetria de carga</span>
              <span>Flota heterogenea</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="como" id="como-funciona">
      <div class="section-inner">
        <div class="section-tag">Como funciona</div>
        <h2 class="section-title">De cero a produccion en 3 pasos</h2>

        <div class="steps-grid">
          <div class="step">
            <div class="step-num">01</div>
            <div class="step-title">Crea tu cuenta</div>
            <div class="step-desc">Registrate gratis en el portal de desarrollador. Obten tu API Key al instante y comienza a integrar.</div>
          </div>
          <div class="step-arrow">
            <svg width="32" height="16" viewBox="0 0 32 16" fill="none"><path d="M0 8h28M22 2l6 6-6 6" stroke="#4a4a5a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="step">
            <div class="step-num">02</div>
            <div class="step-title">Configura tus geocercas</div>
            <div class="step-desc">Dibuja poligonos en el mapa o envialos via API. Define zonas de cobertura, reparto, restriccion o tarifacion.</div>
          </div>
          <div class="step-arrow">
            <svg width="32" height="16" viewBox="0 0 32 16" fill="none"><path d="M0 8h28M22 2l6 6-6 6" stroke="#4a4a5a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="step">
            <div class="step-num">03</div>
            <div class="step-title">Consulta en tiempo real</div>
            <div class="step-desc">Envia coordenadas GPS y recibe la zona correspondiente en menos de 50ms. Escala sin limites.</div>
          </div>
        </div>
      </div>
    </section>

    <section class="code-section" id="docs">
      <div class="section-inner">
        <div class="section-tag">Documentacion</div>
        <h2 class="section-title">Integracion en minutos</h2>
        <p class="section-sub">Una sola llamada HTTP. Sin SDKs, sin dependencias, sin complicaciones.</p>

        <div class="code-block">
          <div class="code-tabs">
            <button class="code-tab" :class="{ active: codeLang === 'curl' }" @click="codeLang = 'curl'">cURL</button>
            <button class="code-tab" :class="{ active: codeLang === 'python' }" @click="codeLang = 'python'">Python</button>
            <button class="code-tab" :class="{ active: codeLang === 'js' }" @click="codeLang = 'js'">JavaScript</button>
          </div>
          <pre class="code-content" v-if="codeLang === 'curl'">curl -X POST \
  https://api.geozonas.io/zonas/verificar \
  -H "Content-Type: application/json" \
  -H "x-api-key: gz_tu_api_key_aqui" \
  -d '{"lat": 4.825, "lon": -74.005}'

# Respuesta:
# { "zona": "Zona Norte", "todas": [...] }</pre>
          <pre class="code-content" v-if="codeLang === 'python'">import requests

response = requests.post(
    "https://api.geozonas.io/zonas/verificar",
    json={"lat": 4.825, "lon": -74.005},
    headers={"x-api-key": "gz_tu_api_key_aqui"}
)

zona = response.json()["zona"]
print(f"Zona: {zona}")  # Zona: Zona Norte</pre>
          <pre class="code-content" v-if="codeLang === 'js'">const response = await fetch(
  "https://api.geozonas.io/zonas/verificar",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "gz_tu_api_key_aqui"
    },
    body: JSON.stringify({ lat: 4.825, lon: -74.005 })
  }
);

const { zona } = await response.json();
console.log(zona); // "Zona Norte"</pre>
        </div>

        <a href="https://zonas-app-production.up.railway.app/docs" target="_blank" class="btn-docs-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Documentacion interactiva completa (Swagger)
        </a>
      </div>
    </section>

    <section class="clientes" id="clientes">
      <div class="section-inner">
        <div class="section-tag">Clientes globales</div>
        <h2 class="section-title">Confianza de lideres mundiales en distribucion</h2>
        <p class="section-sub">Empresas de logistica en Asia y retailers hard discount en Europa confian en nuestra plataforma para optimizar sus operaciones de ultima milla.</p>

        <div class="clients-grid">
          <div class="client-card">
            <div class="client-region">Asia-Pacifico</div>
            <div class="client-name">Yamato Holdings Co.</div>
            <div class="client-desc">Mayor red de distribucion de paqueteria en Japon con +150,000 rutas diarias.</div>
          </div>
          <div class="client-card">
            <div class="client-region">Asia-Pacifico</div>
            <div class="client-name">SF Express</div>
            <div class="client-desc">Lider en logistica express en China con cobertura en 200+ ciudades.</div>
          </div>
          <div class="client-card">
            <div class="client-region">Asia-Pacifico</div>
            <div class="client-name">CJ Logistics</div>
            <div class="client-desc">Conglomerado coreano de supply chain con operaciones en 40 paises.</div>
          </div>
          <div class="client-card">
            <div class="client-region">Europa</div>
            <div class="client-name">Lidl International</div>
            <div class="client-desc">Cadena hard discount alemana con +12,000 tiendas en 31 paises.</div>
          </div>
          <div class="client-card">
            <div class="client-region">Europa</div>
            <div class="client-name">Aldi Sud</div>
            <div class="client-desc">Pionero del formato hard discount con presencia en 11 mercados europeos.</div>
          </div>
          <div class="client-card">
            <div class="client-region">Europa</div>
            <div class="client-name">Biedronka (Jeronimo Martins)</div>
            <div class="client-desc">Mayor cadena hard discount en Polonia con +3,500 puntos de venta.</div>
          </div>
        </div>

        <div class="trust-bar">
          <div class="trust-item">
            <span class="trust-val">12</span>
            <span class="trust-label">Paises</span>
          </div>
          <div class="trust-item">
            <span class="trust-val">+40</span>
            <span class="trust-label">Empresas activas</span>
          </div>
          <div class="trust-item">
            <span class="trust-val">2.1M</span>
            <span class="trust-label">Consultas / mes</span>
          </div>
          <div class="trust-item">
            <span class="trust-val">2019</span>
            <span class="trust-label">Desde Berlin, Alemania</span>
          </div>
        </div>
      </div>
    </section>

    <section class="precios" id="precios">
      <div class="section-inner">
        <div class="section-tag">Precios</div>
        <h2 class="section-title">Empieza gratis, escala sin limites</h2>
        <p class="section-sub">Sin tarjeta de credito. Sin compromisos. Paga solo cuando crezcas.</p>

        <div class="price-grid">
          <div class="price-card">
            <div class="price-name">Starter</div>
            <div class="price-val">Gratis</div>
            <div class="price-period">Para siempre</div>
            <ul class="price-list">
              <li>1,000 consultas / mes</li>
              <li>1 API Key</li>
              <li>Geocercas ilimitadas</li>
              <li>Soporte por email</li>
              <li>Documentacion completa</li>
            </ul>
            <router-link to="/portal" class="btn-price">Comenzar gratis</router-link>
          </div>
          <div class="price-card pop">
            <div class="price-pop-tag">Mas popular</div>
            <div class="price-name">Business</div>
            <div class="price-val">$49<span>/mes</span></div>
            <div class="price-period">Facturacion mensual</div>
            <ul class="price-list">
              <li>50,000 consultas / mes</li>
              <li>5 API Keys</li>
              <li>Geocercas ilimitadas</li>
              <li>Widget embebible</li>
              <li>Soporte prioritario</li>
              <li>Dashboard de metricas</li>
            </ul>
            <router-link to="/portal" class="btn-price pop">Empezar ahora</router-link>
          </div>
          <div class="price-card">
            <div class="price-name">Enterprise</div>
            <div class="price-val">Custom</div>
            <div class="price-period">Segun necesidad</div>
            <ul class="price-list">
              <li>Consultas ilimitadas</li>
              <li>API Keys ilimitadas</li>
              <li>GeoRuteo (VRP)</li>
              <li>SLA 99.99%</li>
              <li>Account manager dedicado</li>
              <li>Integracion a medida</li>
            </ul>
            <a href="mailto:sales@geozonas.io" class="btn-price">Contactar ventas</a>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-final">
      <div class="section-inner">
        <h2 class="cta-title">Listo para optimizar tu logistica?</h2>
        <p class="cta-sub">Crea tu cuenta gratuita y empieza a verificar zonas en menos de 5 minutos.</p>
        <router-link to="/portal" class="btn-primary-lg">Crear cuenta gratuita</router-link>
      </div>
    </section>

    <footer class="land-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="hdr-logo-icon" style="width:24px;height:24px;border-radius:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <span style="font-size:12px;font-weight:700;">GeoZonas GmbH</span>
          <span style="font-size:10px;color:#4a4a5a;margin-left:8px;">Berlin, Deutschland</span>
        </div>
        <div class="footer-links">
          <a href="https://zonas-app-production.up.railway.app/docs" target="_blank">API Docs</a>
          <a href="#">Terminos</a>
          <a href="#">Privacidad</a>
          <a href="mailto:contact@geozonas.io">Contacto</a>
        </div>
        <div class="footer-copy">2026 GeoZonas GmbH. Todos los derechos reservados.</div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue'
const codeLang = ref('curl')
function scrollTo(id) {
  var el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.landing {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background: #0a0a0f;
}

.land-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.hdr-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 32px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hdr-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hdr-logo-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: rgba(0, 229, 160, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hdr-logo-text {
  font-size: 14px;
  font-weight: 700;
}

.hdr-origin {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  color: #ff9f43;
  background: rgba(255, 159, 67, 0.1);
  border: 1px solid rgba(255, 159, 67, 0.2);
  padding: 1px 5px;
  border-radius: 3px;
}

.hdr-nav {
  display: flex;
  gap: 24px;
}

.hdr-nav a {
  color: #6b6b80;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  transition: color 0.15s;
}

.hdr-nav a:hover {
  color: #f0f0f5;
}

.hdr-actions {
  display: flex;
  gap: 8px;
}

.btn-login {
  padding: 7px 14px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #6b6b80;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s;
}

.btn-login:hover {
  color: #f0f0f5;
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-cta-sm {
  padding: 7px 14px;
  border-radius: 6px;
  background: #00e5a0;
  color: #000;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.15s;
}

.btn-cta-sm:hover {
  background: #00ffb0;
}

.hero {
  max-width: 800px;
  margin: 0 auto;
  padding: 140px 32px 80px;
  text-align: center;
}

.hero-badge {
  display: inline-block;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: #00e5a0;
  background: rgba(0, 229, 160, 0.08);
  border: 1px solid rgba(0, 229, 160, 0.2);
  padding: 6px 16px;
  border-radius: 20px;
  margin-bottom: 24px;
}

.hero-title {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
}

.hero-sub {
  font-size: 15px;
  color: #6b6b80;
  line-height: 1.7;
  max-width: 600px;
  margin: 0 auto 32px;
}

.hero-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 48px;
}

.btn-primary-lg {
  padding: 14px 28px;
  border-radius: 8px;
  background: #00e5a0;
  color: #000;
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.15s;
}

.btn-primary-lg:hover {
  background: #00ffb0;
}

.btn-secondary-lg {
  padding: 14px 28px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f0f0f5;
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s;
}

.btn-secondary-lg:hover {
  border-color: rgba(255, 255, 255, 0.25);
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
}

.hstat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hstat-val {
  font-size: 20px;
  font-weight: 700;
  color: #00e5a0;
}

.hstat-label {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #4a4a5a;
  margin-top: 4px;
}

.hstat-sep {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.07);
}

.section-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 32px;
}

.section-tag {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: #7c6fff;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
}

.section-sub {
  font-size: 14px;
  color: #6b6b80;
  line-height: 1.6;
  max-width: 600px;
  margin-bottom: 40px;
}

.srv-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.srv-card {
  background: #13131a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 28px;
  position: relative;
}

.srv-card.featured {
  border-color: rgba(124, 111, 255, 0.3);
}

.srv-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  color: #7c6fff;
  background: rgba(124, 111, 255, 0.1);
  padding: 3px 8px;
  border-radius: 4px;
}

.srv-badge.soon {
  color: #ff9f43;
  background: rgba(255, 159, 67, 0.1);
}

.srv-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}

.srv-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.srv-tag {
  font-size: 12px;
  color: #6b6b80;
  margin-bottom: 14px;
}

.srv-desc {
  font-size: 12px;
  color: #4a4a5a;
  line-height: 1.7;
  margin-bottom: 16px;
}

.srv-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.srv-features span {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #6b6b80;
  background: rgba(255, 255, 255, 0.04);
  padding: 4px 10px;
  border-radius: 4px;
}

.como {
  background: #0e0e15;
}

.steps-grid {
  display: flex;
  align-items: center;
  gap: 24px;
}

.step {
  flex: 1;
  background: #13131a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 28px;
}

.step-num {
  font-family: 'DM Mono', monospace;
  font-size: 28px;
  font-weight: 700;
  color: rgba(0, 229, 160, 0.3);
  margin-bottom: 12px;
}

.step-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 8px;
}

.step-desc {
  font-size: 12px;
  color: #6b6b80;
  line-height: 1.6;
}

.step-arrow {
  flex-shrink: 0;
}

.code-section {
  background: #0a0a0f;
}

.code-block {
  background: #13131a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 20px;
}

.code-tabs {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0 4px;
}

.code-tab {
  padding: 12px 18px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #6b6b80;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.code-tab.active {
  color: #7c6fff;
  border-bottom-color: #7c6fff;
}

.code-content {
  padding: 20px 24px;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: #9090a0;
  line-height: 1.7;
  margin: 0;
  overflow-x: auto;
}

.btn-docs-lg {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  background: rgba(124, 111, 255, 0.1);
  border: 1px solid rgba(124, 111, 255, 0.25);
  color: #7c6fff;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s;
}

.btn-docs-lg:hover {
  background: rgba(124, 111, 255, 0.2);
}

.clientes {
  background: #0e0e15;
}

.clients-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 40px;
}

.client-card {
  background: #13131a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 22px;
}

.client-region {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  color: #7c6fff;
  background: rgba(124, 111, 255, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 10px;
}

.client-name {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
}

.client-desc {
  font-size: 11px;
  color: #6b6b80;
  line-height: 1.5;
}

.trust-bar {
  display: flex;
  justify-content: center;
  gap: 48px;
  padding: 32px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.trust-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.trust-val {
  font-size: 24px;
  font-weight: 700;
  color: #00e5a0;
}

.trust-label {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #4a4a5a;
  margin-top: 4px;
}

.precios {
  background: #0a0a0f;
}

.price-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.price-card {
  background: #13131a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 32px 28px;
  position: relative;
}

.price-card.pop {
  border-color: rgba(0, 229, 160, 0.3);
}

.price-pop-tag {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #000;
  background: #00e5a0;
  padding: 3px 12px;
  border-radius: 10px;
  font-weight: 700;
}

.price-name {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
}

.price-val {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 4px;
}

.price-val span {
  font-size: 14px;
  font-weight: 400;
  color: #6b6b80;
}

.price-period {
  font-size: 12px;
  color: #4a4a5a;
  margin-bottom: 24px;
}

.price-list {
  list-style: none;
  margin-bottom: 24px;
}

.price-list li {
  font-size: 12px;
  color: #6b6b80;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  padding-left: 18px;
  position: relative;
}

.price-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00e5a0;
}

.btn-price {
  display: block;
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f0f0f5;
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s;
}

.btn-price:hover {
  border-color: rgba(255, 255, 255, 0.25);
}

.btn-price.pop {
  background: #00e5a0;
  border-color: #00e5a0;
  color: #000;
  font-weight: 700;
}

.btn-price.pop:hover {
  background: #00ffb0;
}

.cta-final {
  background: #0e0e15;
  text-align: center;
}

.cta-final .section-inner {
  padding: 80px 32px;
}

.cta-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
}

.cta-sub {
  font-size: 14px;
  color: #6b6b80;
  margin-bottom: 28px;
}

.land-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: #0a0a0f;
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: #4a4a5a;
  text-decoration: none;
  font-size: 11px;
  transition: color 0.15s;
}

.footer-links a:hover {
  color: #f0f0f5;
}

.footer-copy {
  font-size: 10px;
  color: #4a4a5a;
  width: 100%;
  text-align: center;
  margin-top: 8px;
}
</style>
