package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.AccionProduccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccionProduccionRepository extends JpaRepository<AccionProduccion, String> {
    List<AccionProduccion> findAllByActivaTrueOrderByOrdenAscNombreAsc();
    List<AccionProduccion> findAllByOrderByOrdenAscNombreAsc();
}
