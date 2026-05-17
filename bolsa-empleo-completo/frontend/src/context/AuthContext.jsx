import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    // Al recargar la página, recuperar sesión del localStorage
    const guardado = localStorage.getItem('usuario')
    return guardado ? JSON.parse(guardado) : null
  })

  function login(datos) {
    // datos = { token, rol, correo, perfilId }
    localStorage.setItem('usuario', JSON.stringify(datos))
    setUsuario(datos)
  }

  function logout() {
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar el contexto fácilmente
export function useAuth() {
  return useContext(AuthContext)
}
