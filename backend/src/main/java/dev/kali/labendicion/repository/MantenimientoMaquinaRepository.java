package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.MantenimientoMaquina;
import dev.kali.labendicion.domain.enums.TipoMantenimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MantenimientoMaquinaRepository extends JpaRepository<MantenimientoMaquina, Long> {
    List<MantenimientoMaquina> findByMaquinaId(Long maquinaId);
    List<MantenimientoMaquina> findByTipoMantenimiento(TipoMantenimiento tipoMantenimiento);
}

