package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.RegistroSync;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RegistroSyncRepository extends JpaRepository<RegistroSync, String> {
    List<RegistroSync> findByOrderByFechaDesc();

    @org.springframework.data.jpa.repository.Query("select distinct r from RegistroSync r left join fetch r.producciones order by r.fecha desc")
    List<RegistroSync> findAllWithProduccionesOrderByFechaDesc();
}