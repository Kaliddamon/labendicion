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
@Table(name = "area_trabajo")
public class AreaTrabajo {
    @Id
    private String id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Builder.Default
    private Boolean activa = true;
}
