package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import dev.kali.labendicion.domain.enums.Turno;
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
@Table(name = "asignacion_aseo")
public class AsignacionAseo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_trabajo_id", nullable = false)
    private AreaTrabajo areaTrabajo;
    
    @Enumerated(EnumType.STRING)
    private Turno turno;
    
    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaAsignacion;
    
    private Boolean completada;
    
    @PrePersist
    protected void onCreate() {
        fechaAsignacion = LocalDateTime.now();
        if (completada == null) {
            completada = false;
        }
    }

    public void setEmpleado(Empleado empleado) { this.empleado = empleado; }
    public void setAreaTrabajo(AreaTrabajo areaTrabajo) { this.areaTrabajo = areaTrabajo; }
    public void setTurno(Turno turno) { this.turno = turno; }
    public void setFechaAsignacion(LocalDateTime fechaAsignacion) { this.fechaAsignacion = fechaAsignacion; }
    public void setCompletada(Boolean completada) { this.completada = completada; }
}

