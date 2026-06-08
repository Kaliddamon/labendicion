package dev.kali.labendicion.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "contacto_mensaje")
public class ContactoMensaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_email", nullable = false)
    private String usuarioEmail;

    @Column(name = "usuario_nombre", nullable = false)
    private String usuarioNombre;

    @Column(nullable = false)
    private String asunto;

    @Column(nullable = false, length = 200)
    private String mensaje;

    private LocalDateTime fecha;

    private Boolean leido;

    private Boolean eliminado;

    private Integer ediciones;

    @PrePersist
    protected void onCreate() {
        if (fecha == null) {
            fecha = LocalDateTime.now();
        }
        if (leido == null) {
            leido = false;
        }
        if (eliminado == null) {
            eliminado = false;
        }
        if (ediciones == null) {
            ediciones = 0;
        }
    }
}
