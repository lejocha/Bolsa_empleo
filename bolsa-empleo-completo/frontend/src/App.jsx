import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar        from './components/Navbar'
import Inicio        from './pages/Inicio'
import Login         from './pages/Login'
import BuscarPuestos from './pages/BuscarPuestos'
import RegistroEmpresa  from './pages/RegistroEmpresa'
import RegistroOferente from './pages/RegistroOferente'
import DashboardEmpresa  from './pages/DashboardEmpresa'
import DashboardOferente from './pages/DashboardOferente'
import DashboardAdmin    from './pages/DashboardAdmin'
import CandidatosEmpresa from './pages/CandidatosEmpresa'

// Componente que protege rutas según rol
function RutaProtegida({ children, rol }) {
  const { usuario } = useAuth()
  if (!usuario) return <Navigate to="/login" />
  if (rol && usuario.rol !== rol) return <Navigate to="/" />
  return children
}

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/"                    element={<Inicio />} />
        <Route path="/login"               element={<Login />} />
        <Route path="/buscar"              element={<BuscarPuestos />} />
        <Route path="/registro/empresa"    element={<RegistroEmpresa />} />
        <Route path="/registro/oferente"   element={<RegistroOferente />} />

        {/* Rutas empresa */}
        <Route path="/empresa/dashboard" element={
          <RutaProtegida rol="EMPRESA"><DashboardEmpresa /></RutaProtegida>
        } />
        <Route path="/empresa/candidatos/:puestoId" element={
          <RutaProtegida rol="EMPRESA"><CandidatosEmpresa /></RutaProtegida>
        } />

        {/* Rutas oferente */}
        <Route path="/oferente/dashboard" element={
          <RutaProtegida rol="OFERENTE"><DashboardOferente /></RutaProtegida>
        } />

        {/* Rutas admin */}
        <Route path="/admin/dashboard" element={
          <RutaProtegida rol="ADMIN"><DashboardAdmin /></RutaProtegida>
        } />

        {/* Cualquier ruta desconocida → inicio */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}
