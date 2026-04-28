package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "detalle_pedido")
public class DetallePedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_servicio_id", nullable = false)
    private PedidoServicio pedidoServicio;
    
    private String descripcion;
    
    private Integer cantidad;
    
    private String talla;
    
    private Double precioUnitario;
}

