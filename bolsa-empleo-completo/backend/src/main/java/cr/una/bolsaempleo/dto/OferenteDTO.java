package cr.una.bolsaempleo.dto;

import lombok.*;
import java.util.List;

// ── Oferente ──────────────────────────────────────────────────
public class OferenteDTO {

    @Getter @Setter @Builder
    public static class Response {
        private Long   id;
        private String identificacion;
        private String nombre;
        private String primerApellido;
        private String nacionalidad;
        private String telefono;
        private String residencia;
        private String correo;
        private String estado;
        private String curriculumPdf;       // URL para descargar
        private List<HabilidadItem> habilidades;
    }

    @Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
    public static class HabilidadItem {
        private Long   caracteristicaId;
        private String nombre;
        private int    nivel;
    }

    // Lista de habilidades para actualizar
    @Getter @Setter
    public static class HabilidadesRequest {
        private List<HabilidadItem> habilidades;
    }

    // ── Empresa ───────────────────────────────────────────────
    @Getter @Setter @Builder
    public static class EmpresaResponse {
        private Long   id;
        private String nombre;
        private String localizacion;
        private String telefono;
        private String descripcion;
        private String correo;
        private String estado;
    }
}
