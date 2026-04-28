package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.AsignacionAseo;
import dev.kali.labendicion.domain.enums.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsignacionAseoRepository extends JpaRepository<AsignacionAseo, Long> {
    List<AsignacionAseo> findByEmpleadoId(Long empleadoId);
    List<AsignacionAseo> findByAreaTrabajoId(Long areaTrabajoId);
    List<AsignacionAseo> findByTurno(Turno turno);
    List<AsignacionAseo> findByCompletada(Boolean completada);
}

