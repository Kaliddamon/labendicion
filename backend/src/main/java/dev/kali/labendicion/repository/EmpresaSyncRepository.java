package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.EmpresaSync;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EmpresaSyncRepository extends JpaRepository<EmpresaSync, String> {
    Optional<EmpresaSync> findByRazonSocial(String razonSocial);
}

