package cr.una.bolsaempleo.repository;

import cr.una.bolsaempleo.entity.Puesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PuestoRepository extends JpaRepository<Puesto, Long> {

    // Los 5 puestos públicos más recientes (parte pública del sitio)
    List<Puesto> findTop5ByTipoAndActivoTrueOrderByCreadoEnDesc(Puesto.Tipo tipo);

    // Puestos de una empresa
    List<Puesto> findByEmpresaIdAndActivoTrue(Long empresaId);

    // Buscar puestos públicos que contengan al menos una de las características dadas
    @Query("""
        SELECT DISTINCT p FROM Puesto p
        JOIN p.caracteristicas pc
        WHERE p.tipo = 'PUBLICO'
          AND p.activo = true
          AND pc.caracteristica.id IN :caracteristicaIds
        ORDER BY p.creadoEn DESC
        """)
    List<Puesto> buscarPublicosPorCaracteristicas(
            @Param("caracteristicaIds") List<Long> caracteristicaIds);

    // Puestos privados (solo para oferentes aprobados)
    @Query("""
        SELECT p FROM Puesto p
        WHERE p.activo = true
          AND (p.tipo = 'PUBLICO' OR p.tipo = 'PRIVADO')
        ORDER BY p.creadoEn DESC
        """)
    List<Puesto> findTodosActivosParaOferente();
}
