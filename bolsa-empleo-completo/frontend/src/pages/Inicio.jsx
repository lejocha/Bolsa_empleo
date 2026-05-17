import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { puestosAPI } from '../services/api'
import './Inicio.css'

export default function Inicio() {
  const [puestos, setPuestos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [puestoHover, setPuestoHover] = useState(null)

  useEffect(() => {
    puestosAPI.recientes()
      .then(data => setPuestos(data))
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }, [])

  return (
    <div className="inicio">
      {/* Hero */}
      <div className="inicio-hero">
        <div className="contenedor">
          <h1>Bolsa de Empleo</h1>
          <p>Conectamos empresas con el talento que buscan</p>
          <Link to="/buscar" className="btn btn-primary">
            Buscar puestos disponibles
          </Link>
        </div>
      </div>

      {/* Puestos recientes */}
      <div className="contenedor inicio-seccion">
        <h2>Puestos recién publicados</h2>
        <p className="inicio-subtitulo">
          Posicioná el mouse sobre un puesto para ver sus requisitos
        </p>

        {cargando && <p className="cargando">Cargando puestos...</p>}

        <div className="puestos-grid">
          {puestos.map(p => (
            <div
              key={p.id}
              className="puesto-card"
              onMouseEnter={() => setPuestoHover(p.id)}
              onMouseLeave={() => setPuestoHover(null)}
            >
              {/* Info principal */}
              <div className={`puesto-info ${puestoHover === p.id ? 'oculto' : ''}`}>
                <span className="puesto-empresa">{p.empresaNombre}</span>
                <h3 className="puesto-titulo">{p.descripcion.substring(0, 60)}...</h3>
                <span className="puesto-salario">₡ {Number(p.salario).toLocaleString()}</span>
                <Link to={`/puesto/${p.id}`} className="btn btn-secondary btn-sm">
                  Ver detalle
                </Link>
              </div>

              {/* Detalle al hacer hover */}
              {puestoHover === p.id && (
                <div className="puesto-detalle">
                  <h4>Requisitos</h4>
                  {p.caracteristicas && p.caracteristicas.length > 0 ? (
                    <ul>
                      {p.caracteristicas.map(c => (
                        <li key={c.caracteristicaId}>
                          {c.nombre}
                          <span className="nivel-badge">Nivel {c.nivelDeseado}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Sin requisitos especificados</p>
                  )}
                  <Link to={`/puesto/${p.id}`} className="btn btn-primary btn-sm" style={{marginTop: '10px'}}>
                    Ver detalle completo
                  </Link>
                </div>
              )}
            </div>
          ))}

          {!cargando && puestos.length === 0 && (
            <p style={{color: 'var(--gris-texto)'}}>No hay puestos publicados aún.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="inicio-footer">
        <div className="contenedor footer-inner">
          <div>
            <strong>Bolsa de Empleo</strong><br />
            <small>Total Soft Inc.</small>
          </div>
          <div style={{textAlign: 'right'}}>
            <small>Contacto: info@bolsaempleo.local</small><br />
            <small>Créditos: Equipo de desarrollo</small>
          </div>
        </div>
      </footer>
    </div>
  )
}
