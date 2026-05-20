package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.ProductoSync;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoSyncRepository extends JpaRepository<ProductoSync, String> {
    List<ProductoSync> findAll();

    // Query optimizada: devuelve solo productos ordenados, sin DISTINCT costoso
    // Los pasos se cargan via EAGER fetch (config en entidad) o via query separada
    @Query("select p from ProductoSync p order by p.nombre")
    List<ProductoSync> findAllOrderByNombre();

    @Query("select distinct p from ProductoSync p left join fetch p.pasos order by p.nombre")
    List<ProductoSync> findAllWithPasosOrderByNombre();
}