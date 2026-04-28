package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.Empleado;
import dev.kali.labendicion.domain.enums.Cargo;
import dev.kali.labendicion.domain.enums.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
    Optional<Empleado> findByNumeroIdentificacion(String numeroIdentificacion);
    Optional<Empleado> findByEmail(String email);
    List<Empleado> findByCargo(Cargo cargo);
    List<Empleado> findByTurno(Turno turno);
    List<Empleado> findByActivo(Boolean activo);
}

