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
@Table(name = "tipo_documento")
public class TipoDocumento {
    @Id
    private String id;

    @Column(nullable = false)
    private String nombre;

    @Builder.Default
    private Boolean activa = true;
}
