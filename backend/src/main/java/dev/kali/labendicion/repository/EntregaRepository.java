package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.Entrega;
import dev.kali.labendicion.domain.enums.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntregaRepository extends JpaRepository<Entrega, Long> {
    List<Entrega> findByEstado(Estado estado);
    Entrega findByPedidoServicioId(Long pedidoServicioId);
}

