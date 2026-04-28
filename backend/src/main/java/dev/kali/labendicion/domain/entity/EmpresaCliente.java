package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

@Entity
@Table(name = "empresa_cliente")
public class EmpresaCliente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El nombre de la empresa es obligatorio")
    private String nombre;
    
    @Email(message = "Email debe ser válido")
    private String email;
    
    private String telefono;
    private String direccion;
    
    @Column(unique = true)
    private String nit;
    
    private String contactoPersona;
    
    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private java.time.LocalDateTime fechaRegistro;
    
    @PrePersist
    protected void onCreate() {
        fechaRegistro = java.time.LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getNit() { return nit; }
    public void setNit(String nit) { this.nit = nit; }
    public String getContactoPersona() { return contactoPersona; }
    public void setContactoPersona(String contactoPersona) { this.contactoPersona = contactoPersona; }
    public java.time.LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(java.time.LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
}




