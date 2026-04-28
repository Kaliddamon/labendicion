package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import dev.kali.labendicion.domain.enums.Estado;
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
@Table(name = "orden_produccion")
public class OrdenProduccion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_servicio_id", nullable = false)
    private PedidoServicio pedidoServicio;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_trabajo_id")
    private AreaTrabajo areaTrabajo;
    
    @Enumerated(EnumType.STRING)
    private Estado estado;
    
    private Integer progreso; // Porcentaje completado (0-100)
    
    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaCreacion;
    
    private LocalDateTime fechaCompletacion;
    
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        estado = Estado.PENDIENTE;
        progreso = 0;
    }
}

