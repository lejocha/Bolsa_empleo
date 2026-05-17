// Todas las llamadas al backend pasan por aquí

const BASE = '/api'

function getToken() {
  const usuario = localStorage.getItem('usuario')
  return usuario ? JSON.parse(usuario).token : null
}

async function request(url, opciones = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...opciones.headers }

  if (token) headers['Authorization'] = `Bearer ${token}`

  const resp = await fetch(BASE + url, { ...opciones, headers })

  if (!resp.ok) {
    const error = await resp.json().catch(() => ({ error: 'Error del servidor' }))
    throw new Error(error.error || 'Error inesperado')
  }

  // Si la respuesta no tiene cuerpo (204, etc.)
  const texto = await resp.text()
  return texto ? JSON.parse(texto) : null
}

// ── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  login: (datos) => request('/auth/login', { method: 'POST', body: JSON.stringify(datos) }),

  registrarEmpresa: (datos) =>
    request('/auth/registro/empresa', { method: 'POST', body: JSON.stringify(datos) }),

  registrarOferente: (datos) =>
    request('/auth/registro/oferente', { method: 'POST', body: JSON.stringify(datos) }),
}

// ── Puestos (público) ─────────────────────────────────────────
export const puestosAPI = {
  recientes: () => request('/puestos/recientes'),

  buscar: (caracteristicaIds) => {
    const params = caracteristicaIds.length
      ? '?caracteristicas=' + caracteristicaIds.join(',')
      : ''
    return request('/puestos/buscar' + params)
  },

  detalle: (id) => request('/puestos/publicos/' + id),

  // Empresa: publicar puesto
  publicar: (empresaId, datos) =>
    request('/puestos/empresa/' + empresaId, { method: 'POST', body: JSON.stringify(datos) }),

  // Empresa: ver sus puestos
  deEmpresa: (empresaId) => request('/puestos/empresa/' + empresaId),

  // Empresa: desactivar puesto
  desactivar: (puestoId, empresaId) =>
    request(`/puestos/${puestoId}/desactivar/${empresaId}`, { method: 'PUT' }),
}

// ── Características ───────────────────────────────────────────
export const caracAPI = {
  todas: () => request('/caracteristicas/todas'),
  raices: () => request('/caracteristicas'),
}

// ── Oferente ──────────────────────────────────────────────────
export const oferenteAPI = {
  perfil: (usuarioId) => request('/oferente/perfil/' + usuarioId),

  actualizarHabilidades: (usuarioId, habilidades) =>
    request('/oferente/habilidades/' + usuarioId, {
      method: 'PUT',
      body: JSON.stringify({ habilidades }),
    }),

  subirCurriculum: (usuarioId, archivo) => {
    const token = getToken()
    const form = new FormData()
    form.append('archivo', archivo)
    return fetch(`${BASE}/oferente/curriculum/${usuarioId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    }).then(r => r.text())
  },
}

// ── Empresa (candidatos) ──────────────────────────────────────
export const empresaAPI = {
  candidatos: (puestoId) => request('/empresa/candidatos/' + puestoId),
  detalleOferente: (id) => request('/empresa/oferente/' + id),
}

// ── Admin ─────────────────────────────────────────────────────
export const adminAPI = {
  empresasPendientes: () => request('/admin/empresas/pendientes'),
  aprobarEmpresa: (id) => request(`/admin/empresas/${id}/aprobar`, { method: 'PUT' }),
  rechazarEmpresa: (id) => request(`/admin/empresas/${id}/rechazar`, { method: 'PUT' }),

  oferentesPendientes: () => request('/admin/oferentes/pendientes'),
  aprobarOferente: (id) => request(`/admin/oferentes/${id}/aprobar`, { method: 'PUT' }),
  rechazarOferente: (id) => request(`/admin/oferentes/${id}/rechazar`, { method: 'PUT' }),

  listarCaracteristicas: () => request('/admin/caracteristicas'),
  crearCaracteristica: (nombre, padreId) =>
    request('/admin/caracteristicas', {
      method: 'POST',
      body: JSON.stringify({ nombre, padreId }),
    }),
}
