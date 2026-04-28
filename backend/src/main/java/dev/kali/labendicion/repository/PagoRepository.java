package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    Pago findByFacturaId(Long facturaId);
}

