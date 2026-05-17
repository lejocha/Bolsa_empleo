import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="contenedor navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          💼 BolsaEmpleo
        </Link>

        {/* Links públicos */}
        <div className="navbar-links">
          <Link to="/">Inicio</Link>
          <Link to="/buscar">Buscar</Link>

          {/* Links según rol */}
          {!usuario && (
            <>
              <Link to="/registro/empresa">Empresa</Link>
              <Link to="/registro/oferente">Oferente</Link>
            </>
          )}

          {usuario?.rol === 'EMPRESA' && (
            <Link to="/empresa/dashboard">Mi Empresa</Link>
          )}

          {usuario?.rol === 'OFERENTE' && (
            <Link to="/oferente/dashboard">Mi Perfil</Link>
          )}

          {usuario?.rol === 'ADMIN' && (
            <Link to="/admin/dashboard">Administración</Link>
          )}

          {/* Login / Logout */}
          {usuario ? (
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Salir
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
