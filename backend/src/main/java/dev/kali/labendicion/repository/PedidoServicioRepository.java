package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.PedidoServicio;
import dev.kali.labendicion.domain.enums.Estado;
import dev.kali.labendicion.domain.enums.Prioridad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoServicioRepository extends JpaRepository<PedidoServicio, Long> {
    List<PedidoServicio> findByEstado(Estado estado);
    List<PedidoServicio> findByPrioridad(Prioridad prioridad);
    List<PedidoServicio> findByEmpresaClienteId(Long empresaClienteId);
    List<PedidoServicio> findByEstadoAndEmpresaClienteId(Estado estado, Long empresaClienteId);
}

