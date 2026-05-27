package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.CargoEmpleadoSync;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CargoEmpleadoSyncRepository extends JpaRepository<CargoEmpleadoSync, String> {
    List<CargoEmpleadoSync> findAllByActivaTrueOrderByNombreAsc();
    List<CargoEmpleadoSync> findAllByOrderByNombreAsc();
}
