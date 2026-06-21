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
@Table(name = "movimiento_financiero")
public class MovimientoFinanciero {

    @Id
    private String id;

    /** Mes de pertenencia en formato "YYYY-MM". */
    @Column(nullable = false)
    private String mes;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    /** Monto del movimiento (positivo siempre; el tipo indica si es gasto o ingreso). */
    @Column(nullable = false)
    private Double monto;

    /** Porcentaje representativo (opcional, lo asigna el admin). */
    private Double porcentaje;

    /** GASTO o INGRESO */
    @Column(nullable = false)
    private String tipo;

    /** NOMINA (auto-generado) o MANUAL (ingresado por admin). */
    @Column(nullable = false)
    private String origen;

    /** Id del empleado cuando el origen es NOMINA (nullable). */
    private String empleadoId;

    /** Fecha de creación del registro "YYYY-MM-DD". */
    private String fecha;

    /** URL de la evidencia en Supabase Storage (opcional). */
    private String evidenciaUrl;
}
