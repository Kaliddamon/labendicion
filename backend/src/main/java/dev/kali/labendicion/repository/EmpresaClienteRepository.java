package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.EmpresaCliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpresaClienteRepository extends JpaRepository<EmpresaCliente, Long> {
    Optional<EmpresaCliente> findByNit(String nit);
    Optional<EmpresaCliente> findByEmail(String email);
}

