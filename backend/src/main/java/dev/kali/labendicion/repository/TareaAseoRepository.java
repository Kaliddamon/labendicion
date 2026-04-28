package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.TareaAseo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TareaAseoRepository extends JpaRepository<TareaAseo, Long> {
    List<TareaAseo> findByAsignacionAseoId(Long asignacionAseoId);
    List<TareaAseo> findByCompletada(Boolean completada);
}

