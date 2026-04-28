package dev.kali.labendicion.domain.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para las peticiones de creación de facturas desde el frontend
 */
public class FacturaDTO {

    @NotNull(message = "El ID del cliente es requerido")
    private Long clienteId;

    @NotNull(message = "El ID del pedido es requerido")
    private Long pedidoId;

    @NotNull(message = "El monto total es requerido")
    @Positive(message = "El monto debe ser positivo")
    private BigDecimal montoTotal;

    @NotNull(message = "La fecha de emisión es requerida")
    private LocalDate fechaEmision;

    private String estado;  // "Pendiente", "Pagada", "Anulada"

    // Constructores
    public FacturaDTO() {}

    public FacturaDTO(Long clienteId, Long pedidoId, BigDecimal montoTotal, LocalDate fechaEmision, String estado) {
        this.clienteId = clienteId;
        this.pedidoId = pedidoId;
        this.montoTotal = montoTotal;
        this.fechaEmision = fechaEmision;
        this.estado = estado;
    }

    // Getters y Setters
    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getPedidoId() {
        return pedidoId;
    }

    public void setPedidoId(Long pedidoId) {
        this.pedidoId = pedidoId;
    }

    public BigDecimal getMontoTotal() {
        return montoTotal;
    }

    public void setMontoTotal(BigDecimal montoTotal) {
        this.montoTotal = montoTotal;
    }

    public LocalDate getFechaEmision() {
        return fechaEmision;
    }

    public void setFechaEmision(LocalDate fechaEmision) {
        this.fechaEmision = fechaEmision;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}

