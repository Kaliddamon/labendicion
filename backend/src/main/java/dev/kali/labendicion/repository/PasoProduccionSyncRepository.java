package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.PasoProduccionSync;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PasoProduccionSyncRepository extends JpaRepository<PasoProduccionSync, String> {
    List<PasoProduccionSync> findByProductoSyncId(String productoSyncId);
}

