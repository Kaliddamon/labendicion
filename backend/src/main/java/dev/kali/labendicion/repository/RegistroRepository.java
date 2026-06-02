package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.Registro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RegistroRepository extends JpaRepository<Registro, String> {
    List<Registro> findByOrderByFechaDesc();
    
    List<Registro> findByFecha(String fecha);

    // Query optimizada para bootstrap: traer últimos 100 registros (evita cargar Miles)
    // Ordenado por fecha descendente
    @Query(value = "select r from Registro r order by r.fecha desc")
    List<Registro> findLatestRegistrosOrderByFechaDesc();

    // Query con LEFT JOIN FETCH para evitar lazy init, pero sin DISTINCT innecesario
    // Limita a últimos 100 para evitar queries enormes
    @Query(value = "select distinct r from Registro r left join fetch r.producciones order by r.fecha desc")
    List<Registro> findAllWithProduccionesOrderByFechaDesc();
}