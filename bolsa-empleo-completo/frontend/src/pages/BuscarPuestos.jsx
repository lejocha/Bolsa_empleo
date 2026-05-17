import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { caracAPI, puestosAPI } from '../services/api'
import './BuscarPuestos.css'

export default function BuscarPuestos() {
  const [caracteristicas, setCaracteristicas] = useState([])
  const [seleccionadas, setSeleccionadas] = useState([])
  const [resultados, setResultados] = useState([])
  const [buscado, setBuscado] = useState(false)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    caracAPI.todas().then(data => {
      // Agrupar: primero las raíces, luego los hijos
      const raices = data.filter(c => !c.padre)
      const hijos  = data.filter(c => c.padre)
      setCaracteristicas({ raices, hijos })
    })
  }, [])

  function toggleSeleccion(id) {
    setSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  async function buscar() {
    setCargando(true)
    try {
      const data = await puestosAPI.buscar(seleccionadas)
      setResultados(data)
      setBuscado(true)
    } catch (err) {
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="contenedor buscar-layout">
      {/* Panel izquierdo: filtros */}
      <aside className="buscar-filtros card">
        <h3>Características</h3>
        <div className="filtros-lista">
          {caracteristicas.raices?.map(raiz => (
            <div key={raiz.id} className="filtro-grupo">
              <div className="filtro-raiz">
                <label>
                  <input
                    type="checkbox"
                    checked={seleccionadas.includes(raiz.id)}
                    onChange={() => toggleSeleccion(raiz.id)}
                  />
                  {raiz.nombre}
                </label>
              </div>
              {/* Hijos de esta raíz */}
              <div className="filtro-hijos">
                {caracteristicas.hijos
                  ?.filter(h => h.padre?.id === raiz.id)
                  .map(hijo => (
                    <label key={hijo.id} className="filtro-hijo">
                      <input
                        type="checkbox"
                        checked={seleccionadas.includes(hijo.id)}
                        onChange={() => toggleSeleccion(hijo.id)}
                      />
                      {hijo.nombre}
                    </label>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary btn-block" onClick={buscar} disabled={cargando}>
          {cargando ? 'Buscando...' : 'Buscar'}
        </button>
      </aside>

      {/* Panel derecho: resultados */}
      <main className="buscar-resultados">
        <h2>Resultados</h2>
        {!buscado && (
          <p style={{ color: 'var(--gris-texto)' }}>
            Seleccioná características y presioná Buscar
          </p>
        )}
        {buscado && resultados.length === 0 && (
          <p style={{ color: 'var(--gris-texto)' }}>No se encontraron puestos.</p>
        )}
        <div className="resultados-grid">
          {resultados.map(p => (
            <div key={p.id} className="card resultado-card">
              <span className="puesto-empresa">{p.empresaNombre}</span>
              <h3>{p.descripcion.substring(0, 80)}{p.descripcion.length > 80 ? '...' : ''}</h3>
              <span className="puesto-salario">₡ {Number(p.salario).toLocaleString()}</span>
              <Link to={`/puesto/${p.id}`} className="btn btn-secondary btn-sm">
                Ver detalle
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
