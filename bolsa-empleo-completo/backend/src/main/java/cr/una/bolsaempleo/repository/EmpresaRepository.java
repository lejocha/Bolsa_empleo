package cr.una.bolsaempleo.repository;

import cr.una.bolsaempleo.entity.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    Optional<Empresa> findByUsuarioId(Long usuarioId);
    List<Empresa> findByEstado(Empresa.Estado estado);
}
