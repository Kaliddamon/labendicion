package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.ContactoMensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ContactoMensajeRepository extends JpaRepository<ContactoMensaje, Long> {
    Optional<ContactoMensaje> findByUsuarioEmail(String email);
    long countByFechaAfter(LocalDateTime date);
}
