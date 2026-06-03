package dev.kali.labendicion.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "empresa")
public class Empresa {
    @Id
    private String id;

    private String razonSocial;
    
    @Pattern(regexp = "^([0-9+\\- ]{7,15})?$", message = "El teléfono tiene un formato inválido. Usa entre 7 y 15 números, espacios, + o -.")
    private String telefono;
    
    @Pattern(regexp = "^([^\\s@]+@[^\\s@]+\\.[^\\s@]+)?$", message = "El correo electrónico no tiene un formato válido.")
    private String correo;
    
    private String direccion;
    /** Estado: Sin ordenes, Ordenes pendientes, Inactiva */
    private String estado;
}
