package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "evaluacion_empleado")
public class EvaluacionEmpleado {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;
    
    private Double calificacion; // 1.0 a 5.0
    
    private String comentarios;
    
    private LocalDate periodoEvaluacion;
    
    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaEvaluacion;
    
    @PrePersist
    protected void onCreate() {
        fechaEvaluacion = LocalDateTime.now();
    }
}

