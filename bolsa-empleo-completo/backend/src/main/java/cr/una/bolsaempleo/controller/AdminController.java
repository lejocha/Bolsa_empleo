package cr.una.bolsaempleo.controller;

import cr.una.bolsaempleo.dto.OferenteDTO.*;
import cr.una.bolsaempleo.entity.Caracteristica;
import cr.una.bolsaempleo.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ── Empresas ──────────────────────────────────────────────

    @GetMapping("/empresas/pendientes")
    public ResponseEntity<List<EmpresaResponse>> empresasPendientes() {
        return ResponseEntity.ok(adminService.listarEmpresasPendientes());
    }

    @PutMapping("/empresas/{id}/aprobar")
    public ResponseEntity<String> aprobarEmpresa(@PathVariable Long id) {
        adminService.aprobarEmpresa(id);
        return ResponseEntity.ok("Empresa aprobada.");
    }

    @PutMapping("/empresas/{id}/rechazar")
    public ResponseEntity<String> rechazarEmpresa(@PathVariable Long id) {
        adminService.rechazarEmpresa(id);
        return ResponseEntity.ok("Empresa rechazada.");
    }

    // ── Oferentes ─────────────────────────────────────────────

    @GetMapping("/oferentes/pendientes")
    public ResponseEntity<List<Response>> oferentesPendientes() {
        return ResponseEntity.ok(adminService.listarOferentesPendientes());
    }

    @PutMapping("/oferentes/{id}/aprobar")
    public ResponseEntity<String> aprobarOferente(@PathVariable Long id) {
        adminService.aprobarOferente(id);
        return ResponseEntity.ok("Oferente aprobado.");
    }

    @PutMapping("/oferentes/{id}/rechazar")
    public ResponseEntity<String> rechazarOferente(@PathVariable Long id) {
        adminService.rechazarOferente(id);
        return ResponseEntity.ok("Oferente rechazado.");
    }

    // ── Características ───────────────────────────────────────

    @GetMapping("/caracteristicas")
    public ResponseEntity<List<Caracteristica>> listarCaracteristicas() {
        return ResponseEntity.ok(adminService.listarCaracteristicas());
    }

    /**
     * POST /api/admin/caracteristicas
     * Body: { "nombre": "Java", "padreId": 1 }   (padreId es opcional)
     */
    @PostMapping("/caracteristicas")
    public ResponseEntity<Caracteristica> crearCaracteristica(
            @RequestBody Map<String, Object> body) {
        String nombre  = (String) body.get("nombre");
        Long   padreId = body.get("padreId") != null
                         ? Long.valueOf(body.get("padreId").toString()) : null;
        return ResponseEntity.ok(adminService.crearCaracteristica(nombre, padreId));
    }

    @PutMapping("/caracteristicas/{id}/desactivar")
    public ResponseEntity<String> desactivarCaracteristica(@PathVariable Long id) {
        adminService.desactivarCaracteristica(id);
        return ResponseEntity.ok("Característica desactivada.");
    }
}
