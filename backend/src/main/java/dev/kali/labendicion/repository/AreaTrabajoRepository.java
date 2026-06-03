package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.AreaTrabajo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AreaTrabajoRepository extends JpaRepository<AreaTrabajo, String> {
    List<AreaTrabajo> findAllByActivaTrueOrderByNombreAsc();
    List<AreaTrabajo> findAllByOrderByNombreAsc();
    Optional<AreaTrabajo> findByNombreIgnoreCase(String nombre);
}
