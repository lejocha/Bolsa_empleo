package cr.una.bolsaempleo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "oferente")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Oferente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(nullable = false, unique = true, length = 30)
    private String identificacion;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "primer_apellido", nullable = false, length = 100)
    private String primerApellido;

    @Column(nullable = false, length = 80)
    private String nacionalidad;

    @Column(nullable = false, length = 20)
    private String telefono;

    @Column(nullable = false, length = 200)
    private String residencia;

    @Column(name = "curriculum_pdf", length = 300)
    private String curriculumPdf;

    @OneToMany(mappedBy = "oferente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OferenteCaracteristica> habilidades = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Estado estado = Estado.PENDIENTE;

    public enum Estado {
        PENDIENTE, APROBADO, RECHAZADO
    }
}
