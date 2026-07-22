package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotNull;

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
    
    @NotNull(message = "El cargo es obligatorio")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cargo_id")
    private CargoEmpleado cargo;
    
    @NotNull(message = "El tipo de documento es obligatorio")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tipo_documento_id")
    private TipoDocumento tipoDocumento;
    
    @NotBlank(message = "El documento es obligatorio")
    @Pattern(regexp = "^[0-9]+$", message = "El documento debe contener únicamente números")
    @Column(unique = true)
    private String documento;
    
    @Pattern(regexp = "^([0-9+\\- ]{7,15})?$", message = "El formato del teléfono es inválido")
    private String telefono;
    private String fechaIngreso;
    
    private String email;
    
    @Pattern(regexp = "^(Activo|Inactivo)$", message = "El estado debe ser Activo o Inactivo")
    private String estado;


}