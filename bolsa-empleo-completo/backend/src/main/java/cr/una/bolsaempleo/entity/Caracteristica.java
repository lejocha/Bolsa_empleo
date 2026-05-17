package cr.una.bolsaempleo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "caracteristica")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Caracteristica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Referencia al padre (null = categoría raíz)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "padre_id")
    private Caracteristica padre;

    // Hijos de esta categoría
    @OneToMany(mappedBy = "padre", fetch = FetchType.LAZY)
    private List<Caracteristica> hijos;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false)
    private boolean activo = true;
}
