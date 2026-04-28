package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import dev.kali.labendicion.domain.enums.Estado;
import dev.kali.labendicion.domain.enums.Prioridad;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "pedido_servicio")
public class PedidoServicio {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_cliente_id", nullable = false)
    private EmpresaCliente empresaCliente;
    
    @Enumerated(EnumType.STRING)
    private Prioridad prioridad;
    
    @Enumerated(EnumType.STRING)
    private Estado estado;
    
    private LocalDate fechaEntrega;
    
    private String descripcion;
    
    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaRegistro;
    
    private LocalDateTime fechaActualizacion;
    
    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
        estado = Estado.PENDIENTE;
        if (prioridad == null) {
            prioridad = Prioridad.MEDIA;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}

