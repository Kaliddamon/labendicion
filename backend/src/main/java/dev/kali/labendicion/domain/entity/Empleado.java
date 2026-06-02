package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "empleado")
public class Empleado {
    @Id
    private String id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    
    private String cargo;
    
    @NotBlank(message = "El documento es obligatorio")
    private String documento;
    
    private String telefono;
    private String fechaIngreso;
    
    @Pattern(regexp = "^(Activo|Inactivo)$", message = "El estado debe ser Activo o Inactivo")
    private String estado;
}