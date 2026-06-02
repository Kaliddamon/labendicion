package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmpresaRepository extends JpaRepository<Empresa, String> {
    List<Empresa> findByRazonSocial(String razonSocial);
}

