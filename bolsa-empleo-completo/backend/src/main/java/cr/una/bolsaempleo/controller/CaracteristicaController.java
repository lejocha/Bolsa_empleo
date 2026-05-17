package cr.una.bolsaempleo.controller;

import cr.una.bolsaempleo.entity.Caracteristica;
import cr.una.bolsaempleo.repository.CaracteristicaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/caracteristicas")
public class CaracteristicaController {

    private final CaracteristicaRepository caracRepo;

    public CaracteristicaController(CaracteristicaRepository caracRepo) {
        this.caracRepo = caracRepo;
    }

    /** GET /api/caracteristicas  → todas las categorías raíz activas */
    @GetMapping
    public ResponseEntity<List<Caracteristica>> raices() {
        return ResponseEntity.ok(caracRepo.findByPadreIsNullAndActivoTrue());
    }

    /** GET /api/caracteristicas/{padreId}/hijos */
    @GetMapping("/{padreId}/hijos")
    public ResponseEntity<List<Caracteristica>> hijos(@PathVariable Long padreId) {
        return ResponseEntity.ok(caracRepo.findByPadreIdAndActivoTrue(padreId));
    }

    /** GET /api/caracteristicas/todas  → árbol completo (para checkboxes del frontend) */
    @GetMapping("/todas")
    public ResponseEntity<List<Caracteristica>> todas() {
        return ResponseEntity.ok(caracRepo.findByActivoTrue());
    }
}
