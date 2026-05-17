import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'

export default function RegistroOferente() {
  const [form, setForm] = useState({
    correo: '', clave: '', identificacion: '', nombre: '',
    primerApellido: '', nacionalidad: '', telefono: '', residencia: ''
  })
  const [error, setError]   = useState('')
  const [exito, setExito]   = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setExito('')
    setCargando(true)
    try {
      await authAPI.registrarOferente(form)
      setExito('¡Registro exitoso! Su solicitud está pendiente de aprobación.')
      setTimeout(() => navigate('/'), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px' }}>
        <h2 style={{ marginBottom: '4px' }}>👤 Registrar Oferente</h2>
        <p style={{ color: 'var(--gris-texto)', fontSize: '13px', marginBottom: '20px' }}>
          Su registro será revisado por el administrador antes de activarse.
        </p>

        {error && <div className="alerta alerta-error">{error}</div>}
        {exito && <div className="alerta alerta-exito">{exito}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
            <div className="form-group">
              <label>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Primer apellido</label>
              <input name="primerApellido" value={form.primerApellido} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Identificación</label>
            <input name="identificacion" value={form.identificacion} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input type="email" name="correo" value={form.correo} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" name="clave" value={form.clave} onChange={handleChange} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
            <div className="form-group">
              <label>Nacionalidad</label>
              <input name="nacionalidad" value={form.nacionalidad} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input name="telefono" value={form.telefono} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Lugar de residencia</label>
            <input name="residencia" value={form.residencia} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrar oferente'}
          </button>
        </form>
      </div>
    </div>
  )
}
