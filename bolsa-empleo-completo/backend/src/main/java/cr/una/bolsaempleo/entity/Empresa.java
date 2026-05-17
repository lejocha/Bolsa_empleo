package cr.una.bolsaempleo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "empresa")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, length = 200)
    private String localizacion;

    @Column(nullable = false, length = 20)
    private String telefono;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Estado estado = Estado.PENDIENTE;

    public enum Estado {
        PENDIENTE, APROBADA, RECHAZADA
    }
}
