package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.ContactoMensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactoMensajeRepository extends JpaRepository<ContactoMensaje, Long> {
}
