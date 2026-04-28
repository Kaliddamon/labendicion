package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
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
@Table(name = "entregado_por_empleado")
public class EntregadoPorEmpleado {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entrega_id", nullable = false)
    private Entrega entrega;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;
    
    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaRegistro;
    
    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
    }
}

