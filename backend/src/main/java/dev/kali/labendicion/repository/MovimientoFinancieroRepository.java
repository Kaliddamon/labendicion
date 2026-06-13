package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.MovimientoFinanciero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimientoFinancieroRepository extends JpaRepository<MovimientoFinanciero, String> {

    List<MovimientoFinanciero> findByMesOrderByFechaDesc(String mes);

    List<MovimientoFinanciero> findAllByOrderByMesDescFechaDesc();

    boolean existsByMesAndEmpleadoId(String mes, String empleadoId);

    void deleteByMesAndOrigen(String mes, String origen);
}
