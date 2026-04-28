package dev.kali.labendicion.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

/**
 * DTO para las peticiones de creación/actualización de clientes desde el frontend
 * Mapea los campos del formulario del frontend a la entidad EmpresaCliente
 */
public class ClienteDTO {

    @NotBlank(message = "El nombre de la empresa es requerido")
    private String nombre;

    @Email(message = "El email debe ser válido")
    private String email;

    private String telefono;
    private String direccion;

    @NotBlank(message = "El documento (NIT) es requerido")
    private String documento;  // El frontend lo llama "documento", el backend "nit"

    // Constructores
    public ClienteDTO() {}

    public ClienteDTO(String nombre, String email, String telefono, String direccion, String documento) {
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.direccion = direccion;
        this.documento = documento;
    }

    // Getters y Setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String documento) {
        this.documento = documento;
    }
}

