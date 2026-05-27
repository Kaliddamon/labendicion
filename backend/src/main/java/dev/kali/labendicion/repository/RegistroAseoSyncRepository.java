package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.RegistroAseoSync;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistroAseoSyncRepository extends JpaRepository<RegistroAseoSync, String> {
    List<RegistroAseoSync> findAllByOrderByFechaDesc();

    @Query("SELECT DISTINCT r FROM RegistroAseoSync r LEFT JOIN FETCH r.entries ORDER BY r.fecha DESC")
    List<RegistroAseoSync> findAllWithEntriesOrderByFechaDesc();

    @EntityGraph(attributePaths = "entries")
    Optional<RegistroAseoSync> findByFecha(String fecha);

    @EntityGraph(attributePaths = "entries")
    Optional<RegistroAseoSync> findFirstByOrderByFechaDesc();

    @EntityGraph(attributePaths = "entries")
    Optional<RegistroAseoSync> findWithEntriesById(String id);
}

