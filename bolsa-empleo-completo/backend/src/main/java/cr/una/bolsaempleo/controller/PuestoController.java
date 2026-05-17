package cr.una.bolsaempleo.controller;

import cr.una.bolsaempleo.dto.PuestoDTO.*;
import cr.una.bolsaempleo.service.PuestoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/puestos")
public class PuestoController {

    private final PuestoService puestoService;

    public PuestoController(PuestoService puestoService) {
        this.puestoService = puestoService;
    }

    // ── Endpoints PÚBLICOS ────────────────────────────────────

    /** GET /api/puestos/recientes  → 5 puestos públicos más recientes */
    @GetMapping("/recientes")
    public ResponseEntity<List<Response>> recientes() {
        return ResponseEntity.ok(puestoService.obtenerRecientes());
    }

    /**
     * GET /api/puestos/buscar?caracteristicas=1,3,9
     * Búsqueda pública por características (IDs separados por coma)
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<Response>> buscar(
            @RequestParam(required = false) List<Long> caracteristicas) {
        return ResponseEntity.ok(puestoService.buscarPublicos(caracteristicas));
    }

    /** GET /api/puestos/publicos/{id} */
    @GetMapping("/publicos/{id}")
    public ResponseEntity<Response> detalle(@PathVariable Long id) {
        return ResponseEntity.ok(puestoService.obtenerPorId(id));
    }

    // ── Endpoints EMPRESA ─────────────────────────────────────

    /** GET /api/empresa/puestos?empresaId=1 */
    @GetMapping("/empresa/{empresaId}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<List<Response>> deEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(puestoService.obtenerDeEmpresa(empresaId));
    }

    /** POST /api/empresa/puestos/{empresaId} */
    @PostMapping("/empresa/{empresaId}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Response> publicar(
            @PathVariable Long empresaId,
            @Valid @RequestBody Request req) {
        return ResponseEntity.ok(puestoService.publicar(empresaId, req));
    }

    /** DELETE /api/empresa/puestos/{puestoId}/empresa/{empresaId}/desactivar */
    @PutMapping("/{puestoId}/desactivar/{empresaId}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<String> desactivar(
            @PathVariable Long puestoId,
            @PathVariable Long empresaId) {
        puestoService.desactivar(puestoId, empresaId);
        return ResponseEntity.ok("Puesto desactivado correctamente.");
    }
}
