package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import dev.kali.labendicion.domain.enums.Estado;
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
@Table(name = "entrega")
public class Entrega {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_servicio_id", nullable = false, unique = true)
    private PedidoServicio pedidoServicio;
    
    private LocalDate fechaEntrega;
    
    @Enumerated(EnumType.STRING)
    private Estado estado;
    
    private String direccionEntrega;
    
    private String observaciones;
    
    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaRegistro;
    
    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
        if (estado == null) {
            estado = Estado.PENDIENTE;
        }
    }
}

