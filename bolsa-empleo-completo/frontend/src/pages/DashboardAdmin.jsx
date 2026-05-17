import { useEffect, useState } from 'react'
import { adminAPI } from '../services/api'

export default function DashboardAdmin() {
  const [tab, setTab]                 = useState('empresas')
  const [empresas, setEmpresas]       = useState([])
  const [oferentes, setOferentes]     = useState([])
  const [caracs, setCaracs]           = useState([])
  const [nuevaCarac, setNuevaCarac]   = useState({ nombre: '', padreId: '' })
  const [msg, setMsg]                 = useState('')

  useEffect(() => {
    adminAPI.empresasPendientes().then(setEmpresas)
    adminAPI.oferentesPendientes().then(setOferentes)
    adminAPI.listarCaracteristicas().then(setCaracs)
  }, [])

  async function aprobarEmpresa(id) {
    await adminAPI.aprobarEmpresa(id)
    setEmpresas(prev => prev.filter(e => e.id !== id))
    setMsg('✅ Empresa aprobada')
  }

  async function rechazarEmpresa(id) {
    await adminAPI.rechazarEmpresa(id)
    setEmpresas(prev => prev.filter(e => e.id !== id))
    setMsg('⚠️ Empresa rechazada')
  }

  async function aprobarOferente(id) {
    await adminAPI.aprobarOferente(id)
    setOferentes(prev => prev.filter(o => o.id !== id))
    setMsg('✅ Oferente aprobado')
  }

  async function rechazarOferente(id) {
    await adminAPI.rechazarOferente(id)
    setOferentes(prev => prev.filter(o => o.id !== id))
    setMsg('⚠️ Oferente rechazado')
  }

  async function crearCarac(e) {
    e.preventDefault()
    try {
      const nueva = await adminAPI.crearCaracteristica(
        nuevaCarac.nombre,
        nuevaCarac.padreId ? Number(nuevaCarac.padreId) : null
      )
      setCaracs(prev => [...prev, nueva])
      setNuevaCarac({ nombre: '', padreId: '' })
      setMsg('✅ Característica creada')
    } catch (err) { setMsg('❌ ' + err.message) }
  }

  const tabs = [
    { id: 'empresas',  label: `Empresas (${empresas.length})` },
    { id: 'oferentes', label: `Oferentes (${oferentes.length})` },
    { id: 'caracs',    label: 'Características' },
  ]

  return (
    <div className="contenedor" style={{ padding: '30px 20px' }}>
      <h2>⚙️ Administración</h2>

      {msg && <div className={`alerta ${msg.startsWith('✅') ? 'alerta-exito' : msg.startsWith('❌') ? 'alerta-error' : 'alerta-info'}`}
        style={{ marginTop: '12px', marginBottom: '0' }}>{msg}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '20px', marginBottom: '20px' }}>
        {tabs.map(t => (
          <button key={t.id}
            className={`btn ${tab === t.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Empresas pendientes */}
      {tab === 'empresas' && (
        <div className="card">
          <h3 style={{ marginBottom: '14px' }}>Empresas pendientes de aprobación</h3>
          {empresas.length === 0
            ? <p style={{ color: 'var(--gris-texto)' }}>No hay empresas pendientes</p>
            : <table>
                <thead>
                  <tr><th>Nombre</th><th>Correo</th><th>Localización</th><th>Teléfono</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {empresas.map(e => (
                    <tr key={e.id}>
                      <td><strong>{e.nombre}</strong></td>
                      <td>{e.correo}</td>
                      <td>{e.localizacion}</td>
                      <td>{e.telefono}</td>
                      <td style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-success btn-sm" onClick={() => aprobarEmpresa(e.id)}>Aprobar</button>
                        <button className="btn btn-danger btn-sm"  onClick={() => rechazarEmpresa(e.id)}>Rechazar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      )}

      {/* Oferentes pendientes */}
      {tab === 'oferentes' && (
        <div className="card">
          <h3 style={{ marginBottom: '14px' }}>Oferentes pendientes de aprobación</h3>
          {oferentes.length === 0
            ? <p style={{ color: 'var(--gris-texto)' }}>No hay oferentes pendientes</p>
            : <table>
                <thead>
                  <tr><th>Nombre</th><th>Correo</th><th>Identificación</th><th>Residencia</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {oferentes.map(o => (
                    <tr key={o.id}>
                      <td><strong>{o.nombre} {o.primerApellido}</strong></td>
                      <td>{o.correo}</td>
                      <td>{o.identificacion}</td>
                      <td>{o.residencia}</td>
                      <td style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-success btn-sm" onClick={() => aprobarOferente(o.id)}>Aprobar</button>
                        <button className="btn btn-danger btn-sm"  onClick={() => rechazarOferente(o.id)}>Rechazar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      )}

      {/* Características */}
      {tab === 'caracs' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card">
            <h3 style={{ marginBottom: '14px' }}>Características registradas</h3>
            <table>
              <thead><tr><th>Nombre</th><th>Padre</th></tr></thead>
              <tbody>
                {caracs.map(c => (
                  <tr key={c.id}>
                    <td>{c.nombre}</td>
                    <td style={{ color: 'var(--gris-texto)', fontSize: '13px' }}>
                      {c.padre ? c.padre.nombre : '— (categoría raíz)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '14px' }}>Agregar característica</h3>
            <form onSubmit={crearCarac}>
              <div className="form-group">
                <label>Nombre</label>
                <input value={nuevaCarac.nombre}
                  onChange={e => setNuevaCarac({...nuevaCarac, nombre: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Categoría padre (opcional)</label>
                <select value={nuevaCarac.padreId}
                  onChange={e => setNuevaCarac({...nuevaCarac, padreId: e.target.value})}>
                  <option value="">— Sin padre (es categoría raíz) —</option>
                  {caracs.filter(c => !c.padre).map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Agregar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
