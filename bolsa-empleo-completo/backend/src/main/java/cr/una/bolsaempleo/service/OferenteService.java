package cr.una.bolsaempleo.service;

import cr.una.bolsaempleo.dto.OferenteDTO.*;
import cr.una.bolsaempleo.entity.*;
import cr.una.bolsaempleo.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class OferenteService {

    private final OferenteRepository       oferenteRepo;
    private final CaracteristicaRepository caracRepo;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public OferenteService(OferenteRepository oferenteRepo,
                           CaracteristicaRepository caracRepo) {
        this.oferenteRepo = oferenteRepo;
        this.caracRepo    = caracRepo;
    }

    // ── Perfil del oferente ───────────────────────────────────
    public Response obtenerPerfil(Long usuarioId) {
        Oferente o = oferenteRepo.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Oferente no encontrado"));
        return toResponse(o);
    }

    // ── Actualizar habilidades ────────────────────────────────
    @Transactional
    public Response actualizarHabilidades(Long usuarioId, HabilidadesRequest req) {
        Oferente o = oferenteRepo.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Oferente no encontrado"));

        // Reemplaza todas las habilidades actuales
        o.getHabilidades().clear();

        List<OferenteCaracteristica> nuevas = req.getHabilidades().stream()
                .map(item -> {
                    Caracteristica c = caracRepo.findById(item.getCaracteristicaId())
                            .orElseThrow(() -> new RuntimeException(
                                    "Característica no encontrada: " + item.getCaracteristicaId()));
                    return OferenteCaracteristica.builder()
                            .oferente(o)
                            .caracteristica(c)
                            .nivel(item.getNivel())
                            .build();
                }).toList();

        o.getHabilidades().addAll(nuevas);
        oferenteRepo.save(o);
        return toResponse(o);
    }

    // ── Subir currículum PDF ──────────────────────────────────
    @Transactional
    public String subirCurriculum(Long usuarioId, MultipartFile archivo) throws IOException {
        if (!isPdf(archivo))
            throw new RuntimeException("Solo se aceptan archivos PDF");

        Oferente o = oferenteRepo.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Oferente no encontrado"));

        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);

        String nombreArchivo = UUID.randomUUID() + ".pdf";
        Files.copy(archivo.getInputStream(),
                   dir.resolve(nombreArchivo),
                   StandardCopyOption.REPLACE_EXISTING);

        o.setCurriculumPdf(nombreArchivo);
        oferenteRepo.save(o);
        return nombreArchivo;
    }

    // ── Buscar candidatos para un puesto (usado por empresas) ─
    public List<Response> buscarCandidatos(Long puestoId) {
        return oferenteRepo.buscarCandidatosParaPuesto(puestoId)
                .stream().map(this::toResponse).toList();
    }

    // ── Ver detalle de un oferente (usado por empresa) ────────
    public Response obtenerPorId(Long id) {
        Oferente o = oferenteRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferente no encontrado"));
        return toResponse(o);
    }

    // ── Helpers ───────────────────────────────────────────────
    private boolean isPdf(MultipartFile f) {
        String ct = f.getContentType();
        return ct != null && ct.equalsIgnoreCase("application/pdf");
    }

    private Response toResponse(Oferente o) {
        List<HabilidadItem> habilidades = o.getHabilidades() == null
                ? List.of()
                : o.getHabilidades().stream()
                    .map(oc -> HabilidadItem.builder()
                            .caracteristicaId(oc.getCaracteristica().getId())
                            .nombre(oc.getCaracteristica().getNombre())
                            .nivel(oc.getNivel())
                            .build())
                    .toList();

        return Response.builder()
                .id(o.getId())
                .identificacion(o.getIdentificacion())
                .nombre(o.getNombre())
                .primerApellido(o.getPrimerApellido())
                .nacionalidad(o.getNacionalidad())
                .telefono(o.getTelefono())
                .residencia(o.getResidencia())
                .correo(o.getUsuario().getCorreo())
                .estado(o.getEstado().name())
                .curriculumPdf(o.getCurriculumPdf() != null
                        ? "/uploads/curriculos/" + o.getCurriculumPdf() : null)
                .habilidades(habilidades)
                .build();
    }
}
