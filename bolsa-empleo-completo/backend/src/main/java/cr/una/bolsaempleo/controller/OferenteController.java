package cr.una.bolsaempleo.controller;

import cr.una.bolsaempleo.dto.OferenteDTO.*;
import cr.una.bolsaempleo.service.OferenteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/oferente")
@PreAuthorize("hasRole('OFERENTE')")
public class OferenteController {

    private final OferenteService oferenteService;

    public OferenteController(OferenteService oferenteService) {
        this.oferenteService = oferenteService;
    }

    /** GET /api/oferente/perfil/{usuarioId} */
    @GetMapping("/perfil/{usuarioId}")
    public ResponseEntity<Response> perfil(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(oferenteService.obtenerPerfil(usuarioId));
    }

    /** PUT /api/oferente/habilidades/{usuarioId} */
    @PutMapping("/habilidades/{usuarioId}")
    public ResponseEntity<Response> actualizarHabilidades(
            @PathVariable Long usuarioId,
            @RequestBody HabilidadesRequest req) {
        return ResponseEntity.ok(oferenteService.actualizarHabilidades(usuarioId, req));
    }

    /** POST /api/oferente/curriculum/{usuarioId}  (multipart/form-data) */
    @PostMapping("/curriculum/{usuarioId}")
    public ResponseEntity<String> subirCurriculum(
            @PathVariable Long usuarioId,
            @RequestParam("archivo") MultipartFile archivo) throws IOException {
        String nombre = oferenteService.subirCurriculum(usuarioId, archivo);
        return ResponseEntity.ok("Currículum guardado: " + nombre);
    }
}
