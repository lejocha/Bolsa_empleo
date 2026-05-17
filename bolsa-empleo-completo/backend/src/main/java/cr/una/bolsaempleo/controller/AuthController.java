package cr.una.bolsaempleo.controller;

import cr.una.bolsaempleo.dto.AuthDTO.*;
import cr.una.bolsaempleo.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /** POST /api/auth/login */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    /** POST /api/auth/registro/empresa */
    @PostMapping("/registro/empresa")
    public ResponseEntity<String> registrarEmpresa(
            @Valid @RequestBody RegistroEmpresaRequest req) {
        authService.registrarEmpresa(req);
        return ResponseEntity.ok("Registro exitoso. Espere aprobación del administrador.");
    }

    /** POST /api/auth/registro/oferente */
    @PostMapping("/registro/oferente")
    public ResponseEntity<String> registrarOferente(
            @Valid @RequestBody RegistroOferenteRequest req) {
        authService.registrarOferente(req);
        return ResponseEntity.ok("Registro exitoso. Espere aprobación del administrador.");
    }
}
