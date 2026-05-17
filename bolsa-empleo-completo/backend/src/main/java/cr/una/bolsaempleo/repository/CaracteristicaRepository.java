package cr.una.bolsaempleo.repository;

import cr.una.bolsaempleo.entity.Caracteristica;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CaracteristicaRepository extends JpaRepository<Caracteristica, Long> {
    // Todas las raíces (categorías padre)
    List<Caracteristica> findByPadreIsNullAndActivoTrue();
    // Hijos de una categoría
    List<Caracteristica> findByPadreIdAndActivoTrue(Long padreId);
    List<Caracteristica> findByActivoTrue();
}
