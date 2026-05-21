package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.EmpresaSync;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmpresaSyncRepository extends JpaRepository<EmpresaSync, String> {
    List<EmpresaSync> findByRazonSocial(String razonSocial);
}

