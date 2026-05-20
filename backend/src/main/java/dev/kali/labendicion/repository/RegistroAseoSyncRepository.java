package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.RegistroAseoSync;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RegistroAseoSyncRepository extends JpaRepository<RegistroAseoSync, String> {
    List<RegistroAseoSync> findAllByOrderByFechaDesc();
    RegistroAseoSync findFirstByOrderByFechaDesc();
}

