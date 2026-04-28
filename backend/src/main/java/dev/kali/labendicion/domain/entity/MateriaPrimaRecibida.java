package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import dev.kali.labendicion.domain.enums.TipoMaterial;
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
@Table(name = "materia_prima_recibida")
public class MateriaPrimaRecibida {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_cliente_id")
    private EmpresaCliente empresaCliente;
    
    @Enumerated(EnumType.STRING)
    private TipoMaterial tipoMaterial;
    
    private String descripcion;
    
    private Double cantidad;
    
    private String unidad;
    
    private String lote;
    
    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaRecepcion;
    
    @PrePersist
    protected void onCreate() {
        fechaRecepcion = LocalDateTime.now();
    }
}

