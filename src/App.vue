<template>
  <div id="app">
    <aside class="nav-sidebar">
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
        <div class="nav-section-label">Menu</div>
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
      </nav>

      <div class="nav-footer">
        <div class="nav-status">
          <div class="status-dot"></div>
          <span>API online</span>
        </div>
      </div>
    </aside>

    <div class="content-area">
      <router-view />
    </div>
  </div>
</template>

<script setup>
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

.nav-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #6b6b80;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00e5a0;
  box-shadow: 0 0 6px #00e5a0;
}

.content-area {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.content-area > * {
  width: 100%;
  height: 100%;
}
</style>