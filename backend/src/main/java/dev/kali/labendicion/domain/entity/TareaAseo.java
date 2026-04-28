package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
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
@Table(name = "tarea_aseo")
public class TareaAseo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asignacion_aseo_id", nullable = false)
    private AsignacionAseo asignacionAseo;
    
    private String descripcion;
    
    private Boolean completada;
    
    private LocalDateTime horaCompletacion;
    
    @PrePersist
    protected void onCreate() {
        if (completada == null) {
            completada = false;
        }
    }

    public void setAsignacionAseo(AsignacionAseo asignacionAseo) { this.asignacionAseo = asignacionAseo; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public void setCompletada(Boolean completada) { this.completada = completada; }
    public void setHoraCompletacion(LocalDateTime horaCompletacion) { this.horaCompletacion = horaCompletacion; }
}

