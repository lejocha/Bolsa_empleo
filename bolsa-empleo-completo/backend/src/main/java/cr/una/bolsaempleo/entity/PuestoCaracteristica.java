package cr.una.bolsaempleo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "puesto_caracteristica",
       uniqueConstraints = @UniqueConstraint(columnNames = {"puesto_id","caracteristica_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PuestoCaracteristica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "puesto_id", nullable = false)
    private Puesto puesto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caracteristica_id", nullable = false)
    private Caracteristica caracteristica;

    @Column(name = "nivel_deseado", nullable = false)
    private int nivelDeseado = 1;   // 1–5
}
