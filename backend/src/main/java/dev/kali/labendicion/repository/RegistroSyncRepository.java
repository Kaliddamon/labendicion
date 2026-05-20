package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.RegistroSync;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RegistroSyncRepository extends JpaRepository<RegistroSync, String> {
    List<RegistroSync> findByOrderByFechaDesc();

    // Query optimizada para bootstrap: traer últimos 100 registros (evita cargar Miles)
    // Ordenado por fecha descendente
    @Query(value = "select r from RegistroSync r order by r.fecha desc")
    List<RegistroSync> findLatestRegistrosOrderByFechaDesc();

    // Query con LEFT JOIN FETCH para evitar lazy init, pero sin DISTINCT innecesario
    // Limita a últimos 100 para evitar queries enormes
    @Query(value = "select distinct r from RegistroSync r left join fetch r.producciones order by r.fecha desc")
    List<RegistroSync> findAllWithProduccionesOrderByFechaDesc();
}