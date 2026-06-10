package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.TipoDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoDocumentoRepository extends JpaRepository<TipoDocumento, String> {
    List<TipoDocumento> findAllByOrderByNombreAsc();
}
