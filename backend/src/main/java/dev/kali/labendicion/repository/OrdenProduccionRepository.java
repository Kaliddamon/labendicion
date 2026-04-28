package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.OrdenProduccion;
import dev.kali.labendicion.domain.enums.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdenProduccionRepository extends JpaRepository<OrdenProduccion, Long> {
    List<OrdenProduccion> findByEstado(Estado estado);
    List<OrdenProduccion> findByPedidoServicioId(Long pedidoServicioId);
    List<OrdenProduccion> findByAreaTrabajoId(Long areaTrabajoId);
}

