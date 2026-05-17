package cr.una.bolsaempleo.controller;

import cr.una.bolsaempleo.dto.OferenteDTO.*;
import cr.una.bolsaempleo.service.OferenteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/empresa")
@PreAuthorize("hasRole('EMPRESA')")
public class EmpresaController {

    private final OferenteService oferenteService;

    public EmpresaController(OferenteService oferenteService) {
        this.oferenteService = oferenteService;
    }

    /**
     * GET /api/empresa/candidatos/{puestoId}
     * Oferentes cuyas habilidades coinciden con el puesto indicado
     */
    @GetMapping("/candidatos/{puestoId}")
    public ResponseEntity<List<Response>> candidatos(@PathVariable Long puestoId) {
        return ResponseEntity.ok(oferenteService.buscarCandidatos(puestoId));
    }

    /**
     * GET /api/empresa/oferente/{id}
     * Ver detalle completo de un oferente (incluyendo link al currículum)
     */
    @GetMapping("/oferente/{id}")
    public ResponseEntity<Response> detalleOferente(@PathVariable Long id) {
        return ResponseEntity.ok(oferenteService.obtenerPorId(id));
    }
}
