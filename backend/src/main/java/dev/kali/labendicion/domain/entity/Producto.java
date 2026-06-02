package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.ArrayList;
import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "producto")
public class Producto {
    @Id
    private String id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    
    @Min(value = 1, message = "La cantidad debe ser mayor a cero")
    private Integer cantidad;
    
    @NotBlank(message = "La empresa es obligatoria")
    private String empresa;
    
    @Min(value = 0, message = "La ganancia no puede ser negativa")
    private Integer ganancia;
    private String fechaAsignacion;
    private String fechaTerminacion;
    private String fechaEntregaReal;
    private String estado;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    @Builder.Default
    private List<PasoProduccion> pasos = new ArrayList<>();
}