package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {
    List<DetallePedido> findByPedidoServicioId(Long pedidoServicioId);
}

