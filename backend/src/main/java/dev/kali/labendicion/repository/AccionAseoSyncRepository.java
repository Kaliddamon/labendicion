package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.AccionAseoSync;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccionAseoSyncRepository extends JpaRepository<AccionAseoSync, String> {
    List<AccionAseoSync> findAllByActivaTrueOrderByNombreAsc();
    List<AccionAseoSync> findAllByOrderByNombreAsc();
}
