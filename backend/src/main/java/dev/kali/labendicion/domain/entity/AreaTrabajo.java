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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;
    
    private String descripcion;
    
    private Boolean activa;
    
    @PrePersist
    protected void onCreate() {
        if (activa == null) {
            activa = true;
        }
    }

    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public void setActiva(Boolean activa) { this.activa = activa; }
}

