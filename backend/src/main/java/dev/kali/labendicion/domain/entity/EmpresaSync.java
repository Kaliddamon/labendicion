package dev.kali.labendicion.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "empresa_sync")
public class EmpresaSync {
    @Id
    private String id;

    private String razonSocial;
    private String telefono;
    private String correo;
    private String direccion;
    /** Estado: Sin ordenes, Ordenes pendientes, Inactiva */
    private String estado;
}

