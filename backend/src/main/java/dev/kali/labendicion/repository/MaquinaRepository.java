package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.Maquina;
import dev.kali.labendicion.domain.enums.TipoMaquina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaquinaRepository extends JpaRepository<Maquina, Long> {
    List<Maquina> findByAreaTrabajoId(Long areaTrabajoId);
    List<Maquina> findByTipoMaquina(TipoMaquina tipoMaquina);
    List<Maquina> findByOperativa(Boolean operativa);
}

