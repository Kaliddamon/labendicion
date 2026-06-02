package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, String> {
    List<Producto> findAll();

    // Query optimizada: devuelve solo productos ordenados, sin DISTINCT costoso
    // Los pasos se cargan via EAGER fetch (config en entidad) o via query separada
    @Query("select p from Producto p order by p.nombre")
    List<Producto> findAllOrderByNombre();

    @Query("select distinct p from Producto p left join fetch p.pasos order by p.nombre")
    List<Producto> findAllWithPasosOrderByNombre();
}