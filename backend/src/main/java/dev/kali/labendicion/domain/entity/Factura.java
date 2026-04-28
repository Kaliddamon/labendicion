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
@Table(name = "factura")
public class Factura {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_cliente_id", nullable = false)
    private EmpresaCliente empresaCliente;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_servicio_id", nullable = false, unique = true)
    private PedidoServicio pedidoServicio;
    
    private String numeroFactura;
    
    private Double monto;
    
    private Double montoPagado;
    
    @Enumerated(EnumType.STRING)
    private Estado estado;
    
    private LocalDate fechaEmision;
    
    private LocalDate fechaVencimiento;
    
    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaRegistro;
    
    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
        if (estado == null) {
            estado = Estado.PENDIENTE;
        }
        if (montoPagado == null) {
            montoPagado = 0.0;
        }
    }
}

