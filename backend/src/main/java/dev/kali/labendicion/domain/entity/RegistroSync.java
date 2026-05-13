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
@Table(name = "registro_sync")
public class RegistroSync {
    @Id
    private String id;

    private String empleadoId;
    private String fecha;
    private String horaEntrada;
    private String horaSalida;
    private Integer unidadesTotales;
    private Integer unidadesBuenas;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "registro_sync_id")
    private List<ProduccionRegistroSync> producciones = new ArrayList<>();
}