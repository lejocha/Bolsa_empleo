package cr.una.bolsaempleo.service;

import cr.una.bolsaempleo.dto.OferenteDTO;
import cr.una.bolsaempleo.dto.OferenteDTO.EmpresaResponse;
import cr.una.bolsaempleo.entity.*;
import cr.una.bolsaempleo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AdminService {

    private final EmpresaRepository        empresaRepo;
    private final OferenteRepository       oferenteRepo;
    private final UsuarioRepository        usuarioRepo;
    private final CaracteristicaRepository caracRepo;

    public AdminService(EmpresaRepository empresaRepo,
                        OferenteRepository oferenteRepo,
                        UsuarioRepository usuarioRepo,
                        CaracteristicaRepository caracRepo) {
        this.empresaRepo  = empresaRepo;
        this.oferenteRepo = oferenteRepo;
        this.usuarioRepo  = usuarioRepo;
        this.caracRepo    = caracRepo;
    }

    // ── Empresas pendientes ───────────────────────────────────
    public List<EmpresaResponse> listarEmpresasPendientes() {
        return empresaRepo.findByEstado(Empresa.Estado.PENDIENTE)
                .stream().map(this::toEmpresaResp).toList();
    }

    @Transactional
    public void aprobarEmpresa(Long empresaId) {
        Empresa e = empresaRepo.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
        e.setEstado(Empresa.Estado.APROBADA);
        empresaRepo.save(e);
        activarUsuario(e.getUsuario());
    }

    @Transactional
    public void rechazarEmpresa(Long empresaId) {
        Empresa e = empresaRepo.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
        e.setEstado(Empresa.Estado.RECHAZADA);
        empresaRepo.save(e);
    }

    // ── Oferentes pendientes ──────────────────────────────────
    public List<OferenteDTO.Response> listarOferentesPendientes() {
        return oferenteRepo.findByEstado(Oferente.Estado.PENDIENTE)
                .stream().map(this::toOferenteResp).toList();
    }

    @Transactional
    public void aprobarOferente(Long oferenteId) {
        Oferente o = oferenteRepo.findById(oferenteId)
                .orElseThrow(() -> new RuntimeException("Oferente no encontrado"));
        o.setEstado(Oferente.Estado.APROBADO);
        oferenteRepo.save(o);
        activarUsuario(o.getUsuario());
    }

    @Transactional
    public void rechazarOferente(Long oferenteId) {
        Oferente o = oferenteRepo.findById(oferenteId)
                .orElseThrow(() -> new RuntimeException("Oferente no encontrado"));
        o.setEstado(Oferente.Estado.RECHAZADO);
        oferenteRepo.save(o);
    }

    // ── Características ───────────────────────────────────────
    public List<Caracteristica> listarCaracteristicas() {
        return caracRepo.findByPadreIsNullAndActivoTrue();  // solo raíces con hijos lazy
    }

    @Transactional
    public Caracteristica crearCaracteristica(String nombre, Long padreId) {
        Caracteristica padre = padreId != null
                ? caracRepo.findById(padreId)
                        .orElseThrow(() -> new RuntimeException("Categoría padre no encontrada"))
                : null;

        Caracteristica c = Caracteristica.builder()
                .nombre(nombre)
                .padre(padre)
                .activo(true)
                .build();
        return caracRepo.save(c);
    }

    @Transactional
    public void desactivarCaracteristica(Long id) {
        Caracteristica c = caracRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Característica no encontrada"));
        c.setActivo(false);
        caracRepo.save(c);
    }

    // ── Helpers ───────────────────────────────────────────────
    private void activarUsuario(Usuario u) {
        u.setActivo(true);
        usuarioRepo.save(u);
    }

    private EmpresaResponse toEmpresaResp(Empresa e) {
        return EmpresaResponse.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .localizacion(e.getLocalizacion())
                .telefono(e.getTelefono())
                .descripcion(e.getDescripcion())
                .correo(e.getUsuario().getCorreo())
                .estado(e.getEstado().name())
                .build();
    }

    private OferenteDTO.Response toOferenteResp(Oferente o) {
        return OferenteDTO.Response.builder()
                .id(o.getId())
                .identificacion(o.getIdentificacion())
                .nombre(o.getNombre())
                .primerApellido(o.getPrimerApellido())
                .nacionalidad(o.getNacionalidad())
                .telefono(o.getTelefono())
                .residencia(o.getResidencia())
                .correo(o.getUsuario().getCorreo())
                .estado(o.getEstado().name())
                .build();
    }
}
