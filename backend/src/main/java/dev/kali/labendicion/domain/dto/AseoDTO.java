package dev.kali.labendicion.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;

/**
 * DTO para las peticiones de creación de tareas de aseo desde el frontend
 */
public class AseoDTO {

    @NotBlank(message = "El área es requerida")
    private String area;

    @NotBlank(message = "La descripción de la tarea es requerida")
    private String tarea;

    @NotBlank(message = "La frecuencia es requerida")
    private String frecuencia;  // "Diario", "Lunes-Miercoles-Viernes", "Semanal", "Mensual"

    @NotNull(message = "El ID del empleado asignado es requerido")
    private Long asignadoA;

    private LocalTime horaSugerida;  // Opcional

    // Constructores
    public AseoDTO() {}

    public AseoDTO(String area, String tarea, String frecuencia, Long asignadoA, LocalTime horaSugerida) {
        this.area = area;
        this.tarea = tarea;
        this.frecuencia = frecuencia;
        this.asignadoA = asignadoA;
        this.horaSugerida = horaSugerida;
    }

    // Getters y Setters
    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getTarea() {
        return tarea;
    }

    public void setTarea(String tarea) {
        this.tarea = tarea;
    }

    public String getFrecuencia() {
        return frecuencia;
    }

    public void setFrecuencia(String frecuencia) {
        this.frecuencia = frecuencia;
    }

    public Long getAsignadoA() {
        return asignadoA;
    }

    public void setAsignadoA(Long asignadoA) {
        this.asignadoA = asignadoA;
    }

    public LocalTime getHoraSugerida() {
        return horaSugerida;
    }

    public void setHoraSugerida(LocalTime horaSugerida) {
        this.horaSugerida = horaSugerida;
    }
}

