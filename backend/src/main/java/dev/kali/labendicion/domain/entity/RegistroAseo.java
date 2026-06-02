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
@Table(name = "registro_aseo")
public class RegistroAseo {
    @Id
    private String id;

    // Fecha en formato ISO (yyyy-MM-dd)
    private String fecha;

    @OneToMany(mappedBy = "registroAseo", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<RegistroAseoEntry> entries = new ArrayList<>();
}

