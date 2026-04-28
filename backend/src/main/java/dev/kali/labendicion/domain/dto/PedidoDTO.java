package dev.kali.labendicion.domain.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

/**
 * DTO para las peticiones de creación de pedidos desde el frontend
 */
public class PedidoDTO {

    @NotNull(message = "El ID del cliente es requerido")
    private Long clienteId;

    @NotBlank(message = "La referencia es requerida")
    private String referencia;

    @NotNull(message = "La cantidad es requerida")
    @Positive(message = "La cantidad debe ser mayor a 0")
    private Integer cantidad;

    @NotNull(message = "La fecha de entrega es requerida")
    private LocalDate fechaEntrega;

    private String notas;

    // Constructores
    public PedidoDTO() {}

    public PedidoDTO(Long clienteId, String referencia, Integer cantidad, LocalDate fechaEntrega, String notas) {
        this.clienteId = clienteId;
        this.referencia = referencia;
        this.cantidad = cantidad;
        this.fechaEntrega = fechaEntrega;
        this.notas = notas;
    }

    // Getters y Setters
    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public String getReferencia() {
        return referencia;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public LocalDate getFechaEntrega() {
        return fechaEntrega;
    }

    public void setFechaEntrega(LocalDate fechaEntrega) {
        this.fechaEntrega = fechaEntrega;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }
}

