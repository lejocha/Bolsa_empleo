package cr.una.bolsaempleo.repository;

import cr.una.bolsaempleo.entity.Oferente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface OferenteRepository extends JpaRepository<Oferente, Long> {

    Optional<Oferente> findByUsuarioId(Long usuarioId);
    List<Oferente> findByEstado(Oferente.Estado estado);
    boolean existsByIdentificacion(String identificacion);

    /**
     * Busca oferentes cuyas habilidades coincidan con las características
     * requeridas por el puesto indicado, al menos en el nivel deseado.
     * Retorna los que tienen AL MENOS UNA coincidencia.
     */
    @Query("""
        SELECT DISTINCT o FROM Oferente o
        JOIN o.usuario u
        JOIN OferenteCaracteristica oc ON oc.oferente = o
        JOIN PuestoCaracteristica pc ON pc.caracteristica = oc.caracteristica
        WHERE pc.puesto.id = :puestoId
          AND oc.nivel >= pc.nivelDeseado
          AND u.activo = true
          AND o.estado = 'APROBADO'
        """)
    List<Oferente> buscarCandidatosParaPuesto(@Param("puestoId") Long puestoId);
}
