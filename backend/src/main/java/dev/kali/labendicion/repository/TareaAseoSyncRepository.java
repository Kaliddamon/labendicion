package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.TareaAseoSync;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TareaAseoSyncRepository extends JpaRepository<TareaAseoSync, String> {
    List<TareaAseoSync> findByOrderByCompletada();
}