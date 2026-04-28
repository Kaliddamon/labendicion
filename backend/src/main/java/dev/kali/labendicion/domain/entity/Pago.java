package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import dev.kali.labendicion.domain.enums.MetodoPago;
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
@Table(name = "pago")
public class Pago {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "factura_id", nullable = false, unique = true)
    private Factura factura;
    
    private Double monto;
    
    @Enumerated(EnumType.STRING)
    private MetodoPago metodoPago;
    
    private LocalDate fechaPago;
    
    private String referencia;
    
    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaRegistro;
    
    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
    }
}

