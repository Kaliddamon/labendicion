package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.EmpleadoSync;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpleadoSyncRepository extends JpaRepository<EmpleadoSync, String> {
}