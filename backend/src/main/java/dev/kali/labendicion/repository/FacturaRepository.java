package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.Factura;
import dev.kali.labendicion.domain.enums.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {
    List<Factura> findByEstado(Estado estado);
    List<Factura> findByEmpresaClienteId(Long empresaClienteId);
    Factura findByPedidoServicioId(Long pedidoServicioId);
    List<Factura> findByEstadoAndEmpresaClienteId(Estado estado, Long empresaClienteId);
}

