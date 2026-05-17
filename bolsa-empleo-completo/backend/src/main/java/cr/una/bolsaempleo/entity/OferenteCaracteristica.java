package cr.una.bolsaempleo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "oferente_caracteristica",
       uniqueConstraints = @UniqueConstraint(columnNames = {"oferente_id","caracteristica_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OferenteCaracteristica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "oferente_id", nullable = false)
    private Oferente oferente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caracteristica_id", nullable = false)
    private Caracteristica caracteristica;

    @Column(nullable = false)
    private int nivel = 1;   // 1–5
}
