// ─── DashboardEmpresa.jsx ────────────────────────────────────
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { puestosAPI, empresaAPI, caracAPI } from '../services/api'

export default function DashboardEmpresa() {
  const { usuario } = useAuth()
  const [puestos, setPuestos]     = useState([])
  const [caracteristicas, setCarac] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    descripcion: '', salario: '', tipo: 'PUBLICO', caracteristicas: []
  })

  useEffect(() => {
    puestosAPI.deEmpresa(usuario.perfilId).then(setPuestos)
    caracAPI.todas().then(setCarac)
  }, [])

  function toggleCarac(id, nivel) {
    setForm(prev => {
      const existe = prev.caracteristicas.find(c => c.caracteristicaId === id)
      if (existe) {
        return { ...prev, caracteristicas: prev.caracteristicas.filter(c => c.caracteristicaId !== id) }
      }
      return { ...prev, caracteristicas: [...prev.caracteristicas, { caracteristicaId: id, nivelDeseado: nivel || 1 }] }
    })
  }

  function cambiarNivel(id, nivel) {
    setForm(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.map(c =>
        c.caracteristicaId === id ? { ...c, nivelDeseado: Number(nivel) } : c
      )
    }))
  }

  async function publicarPuesto(e) {
    e.preventDefault()
    try {
      await puestosAPI.publicar(usuario.perfilId, {
        ...form, salario: parseFloat(form.salario)
      })
      setMsg('✅ Puesto publicado correctamente')
      setMostrarForm(false)
      puestosAPI.deEmpresa(usuario.perfilId).then(setPuestos)
    } catch (err) { setMsg('❌ ' + err.message) }
  }

  async function desactivar(puestoId) {
    if (!confirm('¿Desactivar este puesto?')) return
    await puestosAPI.desactivar(puestoId, usuario.perfilId)
    setPuestos(prev => prev.filter(p => p.id !== puestoId))
  }

  const hijos = caracteristicas.filter(c => c.padre)

  return (
    <div className="contenedor" style={{ padding: '30px 20px' }}>
      <h2>🏢 Mi Empresa — Dashboard</h2>
      <p style={{ color: 'var(--gris-texto)', marginBottom: '24px' }}>
        Bienvenido, {usuario.correo}
      </p>

      {msg && <div className={`alerta ${msg.startsWith('✅') ? 'alerta-exito' : 'alerta-error'}`}>{msg}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3>Mis puestos publicados</h3>
        <button className="btn btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancelar' : '+ Publicar puesto'}
        </button>
      </div>

      {/* Formulario nuevo puesto */}
      {mostrarForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '14px' }}>Nuevo puesto</h4>
          <form onSubmit={publicarPuesto}>
            <div className="form-group">
              <label>Descripción del puesto</label>
              <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
              <div className="form-group">
                <label>Salario (₡)</label>
                <input type="number" value={form.salario} onChange={e => setForm({...form, salario: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Tipo de publicación</label>
                <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                  <option value="PUBLICO">Público</option>
                  <option value="PRIVADO">Privado</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Características requeridas</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                {hijos.map(c => {
                  const sel = form.caracteristicas.find(x => x.caracteristicaId === c.id)
                  return (
                    <div key={c.id} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: sel ? 'var(--azul-claro)' : 'var(--gris-claro)',
                      border: `1px solid ${sel ? 'var(--azul)' : 'var(--gris-borde)'}`,
                      borderRadius: '6px', padding: '4px 10px', fontSize: '13px'
                    }}>
                      <input type="checkbox" checked={!!sel} onChange={() => toggleCarac(c.id)}
                        style={{ accentColor: 'var(--azul)' }} />
                      {c.nombre}
                      {sel && (
                        <select style={{ fontSize: '12px', border: 'none', background: 'transparent' }}
                          value={sel.nivelDeseado} onChange={e => cambiarNivel(c.id, e.target.value)}>
                          {[1,2,3,4,5].map(n => <option key={n} value={n}>Niv {n}</option>)}
                        </select>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <button type="submit" className="btn btn-primary">Publicar</button>
          </form>
        </div>
      )}

      {/* Tabla de puestos */}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Salario</th>
              <th>Tipo</th>
              <th>Candidatos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {puestos.map(p => (
              <tr key={p.id}>
                <td>{p.descripcion.substring(0, 50)}...</td>
                <td>₡ {Number(p.salario).toLocaleString()}</td>
                <td>
                  <span className={`badge ${p.tipo === 'PUBLICO' ? 'badge-verde' : 'badge-amarillo'}`}>
                    {p.tipo}
                  </span>
                </td>
                <td>
                  <Link to={`/empresa/candidatos/${p.id}`} className="btn btn-secondary btn-sm">
                    Ver candidatos
                  </Link>
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => desactivar(p.id)}>
                    Desactivar
                  </button>
                </td>
              </tr>
            ))}
            {puestos.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--gris-texto)' }}>No tiene puestos publicados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
