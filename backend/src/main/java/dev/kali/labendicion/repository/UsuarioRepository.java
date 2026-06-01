package dev.kali.labendicion.repository;

import dev.kali.labendicion.domain.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByGoogleId(String googleId);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM Usuario u JOIN u.roles r WHERE r.nombre IN :roles AND u.activo = true")
    List<Usuario> findActiveByRolNombreIn(@Param("roles") List<String> roles);
}
