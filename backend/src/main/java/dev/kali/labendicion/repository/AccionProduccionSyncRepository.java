package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.AccionProduccionSync;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccionProduccionSyncRepository extends JpaRepository<AccionProduccionSync, String> {
    List<AccionProduccionSync> findAllByActivaTrueOrderByOrdenAscNombreAsc();
    List<AccionProduccionSync> findAllByOrderByOrdenAscNombreAsc();
}
