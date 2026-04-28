package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.EntregadoPorEmpleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntregadoPorEmpleadoRepository extends JpaRepository<EntregadoPorEmpleado, Long> {
    List<EntregadoPorEmpleado> findByEntregaId(Long entregaId);
    List<EntregadoPorEmpleado> findByEmpleadoId(Long empleadoId);
}

