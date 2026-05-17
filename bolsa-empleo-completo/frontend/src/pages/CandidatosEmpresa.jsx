import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { empresaAPI } from '../services/api'

export default function CandidatosEmpresa() {
  const { puestoId } = useParams()
  const [candidatos, setCandidatos] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    empresaAPI.candidatos(puestoId)
      .then(setCandidatos)
      .finally(() => setCargando(false))
  }, [puestoId])

  async function verDetalle(id) {
    const detalle = await empresaAPI.detalleOferente(id)
    setSeleccionado(detalle)
  }

  if (cargando) return <p className="cargando">Cargando candidatos...</p>

  return (
    <div className="contenedor" style={{ padding: '30px 20px' }}>
      <h2>Candidatos para el puesto</h2>
      <p style={{ color: 'var(--gris-texto)', marginBottom: '20px' }}>
        Oferentes cuyas habilidades coinciden con los requisitos del puesto
      </p>

      {candidatos.length === 0 && (
        <div className="alerta alerta-info">No se encontraron candidatos que coincidan.</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Lista */}
        <div className="card">
          <table>
            <thead>
              <tr><th>Nombre</th><th>Residencia</th><th>Detalle</th></tr>
            </thead>
            <tbody>
              {candidatos.map(c => (
                <tr key={c.id} style={{ cursor: 'pointer' }}
                  onClick={() => verDetalle(c.id)}>
                  <td><strong>{c.nombre} {c.primerApellido}</strong></td>
                  <td>{c.residencia}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm">Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detalle */}
        {seleccionado && (
          <div className="card">
            <h3 style={{ marginBottom: '14px' }}>
              {seleccionado.nombre} {seleccionado.primerApellido}
            </h3>
            <table style={{ marginBottom: '14px' }}>
              <tbody>
                <tr><td><strong>Correo</strong></td><td>{seleccionado.correo}</td></tr>
                <tr><td><strong>Teléfono</strong></td><td>{seleccionado.telefono}</td></tr>
                <tr><td><strong>Residencia</strong></td><td>{seleccionado.residencia}</td></tr>
                <tr><td><strong>Nacionalidad</strong></td><td>{seleccionado.nacionalidad}</td></tr>
              </tbody>
            </table>

            <h4 style={{ marginBottom: '8px' }}>Habilidades</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              {seleccionado.habilidades?.map(h => (
                <span key={h.caracteristicaId} className="badge badge-azul">
                  {h.nombre} — Niv {h.nivel}
                </span>
              ))}
            </div>

            {seleccionado.curriculumPdf ? (
              <a href={seleccionado.curriculumPdf} target="_blank" rel="noreferrer"
                className="btn btn-primary btn-sm">
                📄 Ver currículum PDF
              </a>
            ) : (
              <p style={{ color: 'var(--gris-texto)', fontSize: '13px' }}>Sin currículum subido</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
