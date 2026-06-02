package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.PasoProduccion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PasoProduccionRepository extends JpaRepository<PasoProduccion, String> {
    List<PasoProduccion> findByProductoId(String productoId);
}
