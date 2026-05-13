package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.ProductoSync;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoSyncRepository extends JpaRepository<ProductoSync, String> {
    List<ProductoSync> findAll();
}