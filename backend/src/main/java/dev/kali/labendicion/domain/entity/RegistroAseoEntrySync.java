package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "registro_aseo_entry_sync")
public class RegistroAseoEntrySync {
    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registro_aseo_id")
    @JsonIgnore // Evitar serializar la referencia hacia el padre para prevenir recursión infinita al convertir a JSON
    private RegistroAseoSync registroAseo;

    private String empleadoId;
    private String empleadoNombre;

    // Guardamos acciones y areas como CSV simples; el frontend las puede convertir a arrays.
    private String accionesCsv;
    private String areasCsv;

    private boolean completada;
}


