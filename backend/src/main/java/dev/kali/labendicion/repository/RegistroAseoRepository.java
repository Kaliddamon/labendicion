package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.RegistroAseo;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistroAseoRepository extends JpaRepository<RegistroAseo, String> {
    List<RegistroAseo> findAllByOrderByFechaDesc();

    @Query("SELECT DISTINCT r FROM RegistroAseo r LEFT JOIN FETCH r.entries ORDER BY r.fecha DESC")
    List<RegistroAseo> findAllWithEntriesOrderByFechaDesc();

    @EntityGraph(attributePaths = "entries")
    Optional<RegistroAseo> findByFecha(String fecha);

    @EntityGraph(attributePaths = "entries")
    Optional<RegistroAseo> findFirstByOrderByFechaDesc();

    @EntityGraph(attributePaths = "entries")
    Optional<RegistroAseo> findWithEntriesById(String id);
}

