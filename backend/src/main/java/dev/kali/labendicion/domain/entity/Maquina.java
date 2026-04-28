package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import dev.kali.labendicion.domain.enums.TipoMaquina;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "maquina")
public class Maquina {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    private TipoMaquina tipoMaquina;
    
    private String numeroserie;
    
    private String modelo;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_trabajo_id")
    private AreaTrabajo areaTrabajo;
    
    private Boolean operativa;
    
    private String observaciones;
    
    @PrePersist
    protected void onCreate() {
        if (operativa == null) {
            operativa = true;
        }
    }
}

