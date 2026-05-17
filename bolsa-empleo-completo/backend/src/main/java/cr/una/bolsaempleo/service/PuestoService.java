package cr.una.bolsaempleo.service;

import cr.una.bolsaempleo.dto.PuestoDTO.*;
import cr.una.bolsaempleo.entity.*;
import cr.una.bolsaempleo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class PuestoService {

    private final PuestoRepository        puestoRepo;
    private final EmpresaRepository       empresaRepo;
    private final CaracteristicaRepository caracRepo;

    public PuestoService(PuestoRepository puestoRepo,
                         EmpresaRepository empresaRepo,
                         CaracteristicaRepository caracRepo) {
        this.puestoRepo  = puestoRepo;
        this.empresaRepo = empresaRepo;
        this.caracRepo   = caracRepo;
    }

    // ── Parte pública: 5 más recientes ───────────────────────
    public List<Response> obtenerRecientes() {
        return puestoRepo
                .findTop5ByTipoAndActivoTrueOrderByCreadoEnDesc(Puesto.Tipo.PUBLICO)
                .stream().map(this::toResponse).toList();
    }

    // ── Búsqueda pública por características ─────────────────
    public List<Response> buscarPublicos(List<Long> caracteristicaIds) {
        if (caracteristicaIds == null || caracteristicaIds.isEmpty())
            return puestoRepo
                    .findTop5ByTipoAndActivoTrueOrderByCreadoEnDesc(Puesto.Tipo.PUBLICO)
                    .stream().map(this::toResponse).toList();

        return puestoRepo.buscarPublicosPorCaracteristicas(caracteristicaIds)
                .stream().map(this::toResponse).toList();
    }

    // ── Detalle de un puesto ──────────────────────────────────
    public Response obtenerPorId(Long id) {
        Puesto p = puestoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Puesto no encontrado"));
        return toResponse(p);
    }

    // ── Puestos de la empresa logueada ────────────────────────
    public List<Response> obtenerDeEmpresa(Long empresaId) {
        return puestoRepo.findByEmpresaIdAndActivoTrue(empresaId)
                .stream().map(this::toResponse).toList();
    }

    // ── Publicar un puesto ────────────────────────────────────
    @Transactional
    public Response publicar(Long empresaId, Request req) {
        Empresa empresa = empresaRepo.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

        Puesto puesto = Puesto.builder()
                .empresa(empresa)
                .descripcion(req.getDescripcion())
                .salario(req.getSalario())
                .tipo(req.getTipo())
                .activo(true)
                .build();

        List<PuestoCaracteristica> reqs = req.getCaracteristicas().stream()
                .map(item -> {
                    Caracteristica c = caracRepo.findById(item.getCaracteristicaId())
                            .orElseThrow(() -> new RuntimeException(
                                    "Característica no encontrada: " + item.getCaracteristicaId()));
                    return PuestoCaracteristica.builder()
                            .puesto(puesto)
                            .caracteristica(c)
                            .nivelDeseado(item.getNivelDeseado())
                            .build();
                }).toList();

        puesto.setCaracteristicas(reqs);
        puestoRepo.save(puesto);
        return toResponse(puesto);
    }

    // ── Desactivar (la empresa ya cubrió el puesto) ───────────
    @Transactional
    public void desactivar(Long puestoId, Long empresaId) {
        Puesto p = puestoRepo.findById(puestoId)
                .orElseThrow(() -> new RuntimeException("Puesto no encontrado"));

        if (!p.getEmpresa().getId().equals(empresaId))
            throw new RuntimeException("No autorizado para este puesto");

        p.setActivo(false);
        puestoRepo.save(p);
    }

    // ── Mapper entidad → DTO ──────────────────────────────────
    private Response toResponse(Puesto p) {
        List<CaracteristicaRespItem> items = p.getCaracteristicas() == null
                ? List.of()
                : p.getCaracteristicas().stream()
                    .map(pc -> CaracteristicaRespItem.builder()
                            .caracteristicaId(pc.getCaracteristica().getId())
                            .nombre(pc.getCaracteristica().getNombre())
                            .nivelDeseado(pc.getNivelDeseado())
                            .build())
                    .toList();

        return Response.builder()
                .id(p.getId())
                .descripcion(p.getDescripcion())
                .salario(p.getSalario())
                .tipo(p.getTipo().name())
                .activo(p.isActivo())
                .creadoEn(p.getCreadoEn())
                .empresaNombre(p.getEmpresa().getNombre())
                .empresaId(p.getEmpresa().getId())
                .caracteristicas(items)
                .build();
    }
}
