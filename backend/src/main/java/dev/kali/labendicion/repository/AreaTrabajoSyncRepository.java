package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.AreaTrabajoSync;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AreaTrabajoSyncRepository extends JpaRepository<AreaTrabajoSync, String> {
    List<AreaTrabajoSync> findAllByActivaTrueOrderByNombreAsc();
    List<AreaTrabajoSync> findAllByOrderByNombreAsc();
}
