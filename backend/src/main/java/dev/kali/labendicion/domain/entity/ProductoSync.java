package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "producto_sync")
public class ProductoSync {
    @Id
    private String id;

    private String nombre;
    private Integer cantidad;
    private String empresa;
    private Integer ganancia;
    private String fechaAsignacion;
    private String fechaTerminacion;
    private String estado;
}