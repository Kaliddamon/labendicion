package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.CargoEmpleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CargoEmpleadoRepository extends JpaRepository<CargoEmpleado, String> {
    List<CargoEmpleado> findAllByActivaTrueOrderByNombreAsc();
    List<CargoEmpleado> findAllByOrderByNombreAsc();
}
