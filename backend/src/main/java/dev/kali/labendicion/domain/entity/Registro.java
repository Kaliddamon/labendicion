package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "registro")
public class Registro {
    @Id
    private String id;

    private String empleadoId;
    private String fecha;
    private String horaEntrada;
    private String horaSalida;
    private Integer unidadesTotales;
    private Integer unidadesBuenas;
    
    private Integer valorHora;
    private String tipoPago;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "registro_id")
    private List<ProduccionRegistro> producciones = new ArrayList<>();
}