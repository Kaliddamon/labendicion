package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.ContactoMensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import java.util.List;

@Repository
public interface ContactoMensajeRepository extends JpaRepository<ContactoMensaje, Long> {
    Optional<ContactoMensaje> findByUsuarioEmailAndEliminadoFalse(String email);
    long countByFechaAfter(LocalDateTime date);
    List<ContactoMensaje> findByEliminadoFalse(Sort sort);
}
