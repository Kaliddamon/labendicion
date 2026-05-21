package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "paso_produccion_sync")
public class PasoProduccionSync {
    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_sync_id", nullable = false)
    @JsonBackReference
    private ProductoSync productoSync;

    private String descripcion;
    private Integer orden;
    private Boolean completado;
}

