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
@Table(name = "produccion_registro_sync")
public class ProduccionRegistroSync {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productoId;

    /** Paso/acción de la orden de producción asociada a este aporte. */
    private String pasoId;

    private Integer unidadesTotales;
    private Integer unidadesBuenas;
}