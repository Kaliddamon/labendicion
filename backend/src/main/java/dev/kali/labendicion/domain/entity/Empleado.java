package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import dev.kali.labendicion.domain.enums.Cargo;
import dev.kali.labendicion.domain.enums.Turno;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "empleado")
public class Empleado {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Nombre es obligatorio")
    private String nombre;
    
    @NotBlank(message = "Apellido es obligatorio")
    private String apellido;
    
    @Column(unique = true)
    @NotBlank(message = "Número de identificación es obligatorio")
    private String numeroIdentificacion;
    
    @Email(message = "Email debe ser válido")
    private String email;
    
    private String telefono;
    
    @Enumerated(EnumType.STRING)
    private Cargo cargo;
    
    @Enumerated(EnumType.STRING)
    private Turno turno;
    
    private Double salario;
    
    private Boolean activo;
    
    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private java.time.LocalDateTime fechaIngreso;
    
    @PrePersist
    protected void onCreate() {
        fechaIngreso = java.time.LocalDateTime.now();
        if (activo == null) {
            activo = true;
        }
    }

    // Setters explícitos para evitar dependencia de generación en tiempo de compilación.
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public void setNumeroIdentificacion(String numeroIdentificacion) { this.numeroIdentificacion = numeroIdentificacion; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public void setCargo(Cargo cargo) { this.cargo = cargo; }
    public void setTurno(Turno turno) { this.turno = turno; }
    public void setSalario(Double salario) { this.salario = salario; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    public void setFechaIngreso(java.time.LocalDateTime fechaIngreso) { this.fechaIngreso = fechaIngreso; }
}

