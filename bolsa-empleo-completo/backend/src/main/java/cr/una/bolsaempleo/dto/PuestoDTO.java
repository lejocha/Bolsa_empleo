package cr.una.bolsaempleo.dto;

import cr.una.bolsaempleo.entity.Puesto;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PuestoDTO {

    // ── Request crear/editar puesto ───────────────────────────
    @Getter @Setter
    public static class Request {
        @NotBlank
        private String descripcion;

        @NotNull @DecimalMin("0.0")
        private BigDecimal salario;

        @NotNull
        private Puesto.Tipo tipo;           // PUBLICO | PRIVADO

        @NotNull @Size(min = 1)
        private List<CaracteristicaReqItem> caracteristicas;
    }

    @Getter @Setter @AllArgsConstructor @NoArgsConstructor
    public static class CaracteristicaReqItem {
        private Long caracteristicaId;
        private int  nivelDeseado;          // 1–5
    }

    // ── Response puesto ───────────────────────────────────────
    @Getter @Setter @Builder
    public static class Response {
        private Long   id;
        private String descripcion;
        private BigDecimal salario;
        private String tipo;
        private boolean activo;
        private LocalDateTime creadoEn;
        private String empresaNombre;
        private Long   empresaId;
        private List<CaracteristicaRespItem> caracteristicas;
    }

    @Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
    public static class CaracteristicaRespItem {
        private Long   caracteristicaId;
        private String nombre;
        private int    nivelDeseado;
    }
}
