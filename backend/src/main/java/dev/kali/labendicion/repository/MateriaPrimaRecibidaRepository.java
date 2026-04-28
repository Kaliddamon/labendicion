package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.MateriaPrimaRecibida;
import dev.kali.labendicion.domain.enums.TipoMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MateriaPrimaRecibidaRepository extends JpaRepository<MateriaPrimaRecibida, Long> {
    List<MateriaPrimaRecibida> findByEmpresaClienteId(Long empresaClienteId);
    List<MateriaPrimaRecibida> findByTipoMaterial(TipoMaterial tipoMaterial);
}

