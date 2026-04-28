package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.EvaluacionEmpleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluacionEmpleadoRepository extends JpaRepository<EvaluacionEmpleado, Long> {
    List<EvaluacionEmpleado> findByEmpleadoId(Long empleadoId);
}

