package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import dev.kali.labendicion.domain.enums.TipoMantenimiento;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "mantenimiento_maquina")
public class MantenimientoMaquina {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maquina_id", nullable = false)
    private Maquina maquina;
    
    @Enumerated(EnumType.STRING)
    private TipoMantenimiento tipoMantenimiento;
    
    private String descripcion;
    
    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaMantenimiento;
    
    private String responsable;
    
    @PrePersist
    protected void onCreate() {
        fechaMantenimiento = LocalDateTime.now();
    }
}

