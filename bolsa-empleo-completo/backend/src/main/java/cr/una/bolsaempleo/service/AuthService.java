package cr.una.bolsaempleo.service;

import cr.una.bolsaempleo.dto.AuthDTO.*;
import cr.una.bolsaempleo.entity.*;
import cr.una.bolsaempleo.repository.*;
import cr.una.bolsaempleo.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository  usuarioRepo;
    private final EmpresaRepository  empresaRepo;
    private final OferenteRepository oferenteRepo;
    private final PasswordEncoder    encoder;
    private final JwtUtil            jwtUtil;

    public AuthService(UsuarioRepository usuarioRepo,
                       EmpresaRepository empresaRepo,
                       OferenteRepository oferenteRepo,
                       PasswordEncoder encoder,
                       JwtUtil jwtUtil) {
        this.usuarioRepo  = usuarioRepo;
        this.empresaRepo  = empresaRepo;
        this.oferenteRepo = oferenteRepo;
        this.encoder      = encoder;
        this.jwtUtil      = jwtUtil;
    }

    // ── Login ─────────────────────────────────────────────────
    public LoginResponse login(LoginRequest req) {
        Usuario u = usuarioRepo.findByCorreo(req.getCorreo())
                .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));

        if (!encoder.matches(req.getClave(), u.getClaveHash()))
            throw new RuntimeException("Credenciales incorrectas");

        if (!u.isActivo())
            throw new RuntimeException("Usuario pendiente de aprobación");

        Long perfilId = obtenerPerfilId(u);
        String token  = jwtUtil.generarToken(u.getCorreo(), u.getRol().name());

        return new LoginResponse(token, u.getRol().name(), u.getCorreo(), perfilId);
    }

    // ── Registro Empresa ──────────────────────────────────────
    @Transactional
    public void registrarEmpresa(RegistroEmpresaRequest req) {
        if (usuarioRepo.existsByCorreo(req.getCorreo()))
            throw new RuntimeException("El correo ya está registrado");

        Usuario u = Usuario.builder()
                .correo(req.getCorreo())
                .claveHash(encoder.encode(req.getClave()))
                .rol(Usuario.Rol.EMPRESA)
                .activo(false)         // espera aprobación del admin
                .build();
        usuarioRepo.save(u);

        Empresa e = Empresa.builder()
                .usuario(u)
                .nombre(req.getNombre())
                .localizacion(req.getLocalizacion())
                .telefono(req.getTelefono())
                .descripcion(req.getDescripcion())
                .estado(Empresa.Estado.PENDIENTE)
                .build();
        empresaRepo.save(e);
    }

    // ── Registro Oferente ─────────────────────────────────────
    @Transactional
    public void registrarOferente(RegistroOferenteRequest req) {
        if (usuarioRepo.existsByCorreo(req.getCorreo()))
            throw new RuntimeException("El correo ya está registrado");

        Usuario u = Usuario.builder()
                .correo(req.getCorreo())
                .claveHash(encoder.encode(req.getClave()))
                .rol(Usuario.Rol.OFERENTE)
                .activo(false)
                .build();
        usuarioRepo.save(u);

        Oferente o = Oferente.builder()
                .usuario(u)
                .identificacion(req.getIdentificacion())
                .nombre(req.getNombre())
                .primerApellido(req.getPrimerApellido())
                .nacionalidad(req.getNacionalidad())
                .telefono(req.getTelefono())
                .residencia(req.getResidencia())
                .estado(Oferente.Estado.PENDIENTE)
                .build();
        oferenteRepo.save(o);
    }

    // ── Helpers ───────────────────────────────────────────────
    private Long obtenerPerfilId(Usuario u) {
        return switch (u.getRol()) {
            case EMPRESA  -> empresaRepo.findByUsuarioId(u.getId())
                                .map(Empresa::getId).orElse(null);
            case OFERENTE -> oferenteRepo.findByUsuarioId(u.getId())
                                .map(Oferente::getId).orElse(null);
            case ADMIN    -> u.getId();
        };
    }
}
