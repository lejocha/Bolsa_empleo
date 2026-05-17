import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { oferenteAPI, caracAPI } from '../services/api'

export default function DashboardOferente() {
  const { usuario } = useAuth()
  const [perfil, setPerfil]         = useState(null)
  const [caracteristicas, setCarac] = useState([])
  const [habilidades, setHabilidades] = useState([])
  const [archivo, setArchivo]       = useState(null)
  const [msg, setMsg]               = useState('')

  useEffect(() => {
    oferenteAPI.perfil(usuario.perfilId).then(data => {
      setPerfil(data)
      setHabilidades(data.habilidades || [])
    })
    caracAPI.todas().then(data => setCarac(data.filter(c => c.padre)))
  }, [])

  function toggleHabilidad(id) {
    setHabilidades(prev => {
      const existe = prev.find(h => h.caracteristicaId === id)
      if (existe) return prev.filter(h => h.caracteristicaId !== id)
      return [...prev, { caracteristicaId: id, nivel: 1 }]
    })
  }

  function cambiarNivel(id, nivel) {
    setHabilidades(prev =>
      prev.map(h => h.caracteristicaId === id ? { ...h, nivel: Number(nivel) } : h)
    )
  }

  async function guardarHabilidades() {
    try {
      await oferenteAPI.actualizarHabilidades(usuario.perfilId, habilidades)
      setMsg('✅ Habilidades actualizadas')
    } catch (err) { setMsg('❌ ' + err.message) }
  }

  async function subirCurriculum() {
    if (!archivo) return setMsg('❌ Seleccione un archivo PDF')
    try {
      await oferenteAPI.subirCurriculum(usuario.perfilId, archivo)
      setMsg('✅ Currículum subido correctamente')
    } catch (err) { setMsg('❌ ' + err.message) }
  }

  if (!perfil) return <p className="cargando">Cargando perfil...</p>

  return (
    <div className="contenedor" style={{ padding: '30px 20px' }}>
      <h2>👤 Mi Perfil — Oferente</h2>

      {msg && <div className={`alerta ${msg.startsWith('✅') ? 'alerta-exito' : 'alerta-error'}`}
        style={{ marginTop: '12px' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        {/* Info personal */}
        <div className="card">
          <h3 style={{ marginBottom: '14px' }}>Datos personales</h3>
          <table>
            <tbody>
              <tr><td><strong>Nombre</strong></td><td>{perfil.nombre} {perfil.primerApellido}</td></tr>
              <tr><td><strong>Identificación</strong></td><td>{perfil.identificacion}</td></tr>
              <tr><td><strong>Correo</strong></td><td>{perfil.correo}</td></tr>
              <tr><td><strong>Teléfono</strong></td><td>{perfil.telefono}</td></tr>
              <tr><td><strong>Residencia</strong></td><td>{perfil.residencia}</td></tr>
              <tr><td><strong>Nacionalidad</strong></td><td>{perfil.nacionalidad}</td></tr>
            </tbody>
          </table>
        </div>

        {/* Currículum */}
        <div className="card">
          <h3 style={{ marginBottom: '14px' }}>Currículum (PDF)</h3>
          {perfil.curriculumPdf && (
            <div className="alerta alerta-info" style={{ marginBottom: '14px' }}>
              Ya tiene un currículum subido.{' '}
              <a href={perfil.curriculumPdf} target="_blank" rel="noreferrer">Ver currículum</a>
            </div>
          )}
          <div className="form-group">
            <label>Subir nuevo currículum</label>
            <input type="file" accept="application/pdf"
              onChange={e => setArchivo(e.target.files[0])} />
          </div>
          <button className="btn btn-primary" onClick={subirCurriculum}>
            Subir PDF
          </button>
        </div>
      </div>

      {/* Habilidades */}
      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '14px' }}>Mis habilidades y nivel</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {caracteristicas.map(c => {
            const sel = habilidades.find(h => h.caracteristicaId === c.id)
            return (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: sel ? 'var(--azul-claro)' : 'var(--gris-claro)',
                border: `1px solid ${sel ? 'var(--azul)' : 'var(--gris-borde)'}`,
                borderRadius: '6px', padding: '5px 12px', fontSize: '13px'
              }}>
                <input type="checkbox" checked={!!sel} onChange={() => toggleHabilidad(c.id)}
                  style={{ accentColor: 'var(--azul)' }} />
                {c.nombre}
                {sel && (
                  <select style={{ fontSize: '12px', border: 'none', background: 'transparent' }}
                    value={sel.nivel} onChange={e => cambiarNivel(c.id, e.target.value)}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>Niv {n}</option>)}
                  </select>
                )}
              </div>
            )
          })}
        </div>
        <button className="btn btn-success" onClick={guardarHabilidades}>
          Guardar habilidades
        </button>
      </div>
    </div>
  )
}
