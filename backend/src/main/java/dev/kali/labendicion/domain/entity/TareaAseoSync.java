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
@Table(name = "tarea_aseo_sync")
public class TareaAseoSync {
    @Id
    private String id;

    private String accion;
    private String area;
    private String encargado;
    private boolean completada;
}