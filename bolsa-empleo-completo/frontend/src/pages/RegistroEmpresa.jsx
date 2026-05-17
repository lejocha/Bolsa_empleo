import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'

export default function RegistroEmpresa() {
  const [form, setForm] = useState({
    correo: '', clave: '', nombre: '',
    localizacion: '', telefono: '', descripcion: ''
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
      await authAPI.registrarEmpresa(form)
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
        <h2 style={{ marginBottom: '4px' }}>🏢 Registrar Empresa</h2>
        <p style={{ color: 'var(--gris-texto)', fontSize: '13px', marginBottom: '20px' }}>
          Su registro será revisado por el administrador antes de activarse.
        </p>

        {error && <div className="alerta alerta-error">{error}</div>}
        {exito && <div className="alerta alerta-exito">{exito}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de la empresa</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input type="email" name="correo" value={form.correo} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" name="clave" value={form.clave} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Localización</label>
            <input name="localizacion" value={form.localizacion} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input name="telefono" value={form.telefono} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrar empresa'}
          </button>
        </form>
      </div>
    </div>
  )
}
