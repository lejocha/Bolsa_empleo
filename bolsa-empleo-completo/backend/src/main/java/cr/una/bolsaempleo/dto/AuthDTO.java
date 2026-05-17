package cr.una.bolsaempleo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

// ── Request login ─────────────────────────────────────────────
public class AuthDTO {

    @Getter @Setter
    public static class LoginRequest {
        @NotBlank @Email
        private String correo;
        @NotBlank
        private String clave;
    }

    // ── Respuesta con token ───────────────────────────────────
    @Getter @Setter @AllArgsConstructor
    public static class LoginResponse {
        private String token;
        private String rol;
        private String correo;
        private Long   perfilId;   // id de empresa, oferente o admin según rol
    }

    // ── Registro empresa ──────────────────────────────────────
    @Getter @Setter
    public static class RegistroEmpresaRequest {
        @NotBlank @Email
        private String correo;
        @NotBlank
        private String clave;
        @NotBlank
        private String nombre;
        @NotBlank
        private String localizacion;
        @NotBlank
        private String telefono;
        private String descripcion;
    }

    // ── Registro oferente ─────────────────────────────────────
    @Getter @Setter
    public static class RegistroOferenteRequest {
        @NotBlank @Email
        private String correo;
        @NotBlank
        private String clave;
        @NotBlank
        private String identificacion;
        @NotBlank
        private String nombre;
        @NotBlank
        private String primerApellido;
        @NotBlank
        private String nacionalidad;
        @NotBlank
        private String telefono;
        @NotBlank
        private String residencia;
    }
}
