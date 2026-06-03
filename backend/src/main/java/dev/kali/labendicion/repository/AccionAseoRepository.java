package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.AccionAseo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccionAseoRepository extends JpaRepository<AccionAseo, String> {
    List<AccionAseo> findAllByActivaTrueOrderByNombreAsc();
    List<AccionAseo> findAllByOrderByNombreAsc();
    Optional<AccionAseo> findByNombreIgnoreCase(String nombre);
}
