package dev.kali.labendicion.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para las peticiones de creación/actualización de empleados desde el frontend
 */
public class EmpleadoDTO {

    @NotBlank(message = "El nombre completo es requerido")
    private String nombreCompleto;

    @NotBlank(message = "El documento de identidad es requerido")
    private String documento;

    @NotBlank(message = "El cargo es requerido")
    private String cargo;

    @NotNull(message = "El salario es requerido")
    @Positive(message = "El salario debe ser positivo")
    private BigDecimal salario;

    @NotNull(message = "La fecha de ingreso es requerida")
    private LocalDate fechaIngreso;

    // Constructores
    public EmpleadoDTO() {}

    public EmpleadoDTO(String nombreCompleto, String documento, String cargo, BigDecimal salario, LocalDate fechaIngreso) {
        this.nombreCompleto = nombreCompleto;
        this.documento = documento;
        this.cargo = cargo;
        this.salario = salario;
        this.fechaIngreso = fechaIngreso;
    }

    // Getters y Setters
    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String documento) {
        this.documento = documento;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public BigDecimal getSalario() {
        return salario;
    }

    public void setSalario(BigDecimal salario) {
        this.salario = salario;
    }

    public LocalDate getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDate fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }
}

