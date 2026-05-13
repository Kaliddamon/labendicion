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
@Table(name = "empleado_sync")
public class EmpleadoSync {
    @Id
    private String id;

    private String nombre;
    private String cargo;
    private String documento;
    private String telefono;
    private String fechaIngreso;
    private String estado;
}