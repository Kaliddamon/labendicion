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
@Table(name = "accion_produccion_sync")
public class AccionProduccionSync {
    @Id
    private String id;

    @Column(nullable = false)
    private String nombre;

    private Integer orden;

    @Builder.Default
    private Boolean activa = true;
}
