import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      const datos = await authAPI.login({ correo, clave })
      login(datos)  // guarda en contexto y localStorage

      // Redirige según rol
      if (datos.rol === 'ADMIN')    navigate('/admin/dashboard')
      if (datos.rol === 'EMPRESA')  navigate('/empresa/dashboard')
      if (datos.rol === 'OFERENTE') navigate('/oferente/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '380px' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>🔐 Login</h2>

        {error && <div className="alerta alerta-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={clave}
              onChange={e => setClave(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={cargando}
            style={{ marginTop: '8px' }}
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: 'var(--gris-texto)' }}>
          ¿No tiene cuenta?{' '}
          <a href="/registro/empresa">Registrar empresa</a> o{' '}
          <a href="/registro/oferente">Registrar oferente</a>
        </div>
      </div>
    </div>
  )
}
