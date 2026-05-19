package dev.kali.labendicion.service;

import dev.kali.labendicion.domain.entity.Permiso;
import dev.kali.labendicion.domain.entity.Rol;
import dev.kali.labendicion.domain.entity.Usuario;
import dev.kali.labendicion.repository.PermisoRepository;
import dev.kali.labendicion.repository.RolRepository;
import dev.kali.labendicion.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class RolService {
    
    @Autowired
    private RolRepository rolRepository;
    
    @Autowired
    private PermisoRepository permisoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    /**
     * Inicializa los roles y permisos predeterminados en la BD
     */
    @Transactional
    public void inicializarRolesYPermisos() {
        // Si ya existen, no hacer nada
        if (rolRepository.existsByNombre("SUPERADMINISTRADOR")) {
            return;
        }
        
        // Crear permisos
        Permiso[] permisos = {
            // Producción
            Permiso.builder().nombre("VER_PRODUCCION").descripcion("Ver módulo de producción").categoria("PRODUCCION").build(),
            Permiso.builder().nombre("CREAR_PRODUCCION").descripcion("Crear órdenes de producción").categoria("PRODUCCION").build(),
            Permiso.builder().nombre("EDITAR_PRODUCCION").descripcion("Editar órdenes de producción").categoria("PRODUCCION").build(),
            Permiso.builder().nombre("ELIMINAR_PRODUCCION").descripcion("Eliminar órdenes de producción").categoria("PRODUCCION").build(),
            
            // Empleados
            Permiso.builder().nombre("VER_EMPLEADOS").descripcion("Ver módulo de empleados").categoria("EMPLEADOS").build(),
            Permiso.builder().nombre("CREAR_EMPLEADOS").descripcion("Crear empleados").categoria("EMPLEADOS").build(),
            Permiso.builder().nombre("EDITAR_EMPLEADOS").descripcion("Editar empleados").categoria("EMPLEADOS").build(),
            Permiso.builder().nombre("ELIMINAR_EMPLEADOS").descripcion("Eliminar empleados").categoria("EMPLEADOS").build(),
            
            // Aseo
            Permiso.builder().nombre("VER_ASEO").descripcion("Ver tareas de aseo").categoria("ASEO").build(),
            Permiso.builder().nombre("CREAR_ASEO").descripcion("Crear tareas de aseo").categoria("ASEO").build(),
            Permiso.builder().nombre("EDITAR_ASEO").descripcion("Editar tareas de aseo").categoria("ASEO").build(),
            Permiso.builder().nombre("ELIMINAR_ASEO").descripcion("Eliminar tareas de aseo").categoria("ASEO").build(),
            Permiso.builder().nombre("COMPLETAR_ASEO").descripcion("Marcar tareas de aseo como completadas").categoria("ASEO").build(),
            
            // Reportes/Rendimiento
            Permiso.builder().nombre("VER_RENDIMIENTO").descripcion("Ver reportes de rendimiento").categoria("REPORTES").build(),
            Permiso.builder().nombre("VER_HISTORIAL").descripcion("Ver historial de empleado").categoria("REPORTES").build(),
            
            // Dashboard
            Permiso.builder().nombre("VER_DASHBOARD").descripcion("Ver dashboard principal").categoria("DASHBOARD").build(),
            
            // Roles y Permisos
            Permiso.builder().nombre("GESTIONAR_ROLES").descripcion("Gestionar roles y permisos").categoria("ROLES").build(),
            Permiso.builder().nombre("ASIGNAR_ADMINISTRADOR").descripcion("Asignar rol de administrador").categoria("ROLES").build(),
            Permiso.builder().nombre("ASIGNAR_TRABAJADOR").descripcion("Asignar rol de trabajador").categoria("ROLES").build(),
        };
        
        for (Permiso p : permisos) {
            if (!permisoRepository.existsByNombre(p.getNombre())) {
                permisoRepository.save(p);
            }
        }
        
        // Obtener permisos guardados
        Set<Permiso> permisosTotal = Set.copyOf(permisoRepository.findAll());
        
        // Crear roles con sus permisos
        crearRolSuperAdministrador(permisosTotal);
        crearRolAdministrador(permisosTotal);
        crearRolTrabajador(permisosTotal);
        crearRolUsuario(permisosTotal);
    }
    
    private void crearRolSuperAdministrador(Set<Permiso> todosPermisos) {
        Rol superAdmin = Rol.builder()
            .nombre("SUPERADMINISTRADOR")
            .descripcion("Acceso total al sistema. Puede asignar administradores.")
            .permisos(new java.util.HashSet<>(todosPermisos))
            .build();
        rolRepository.save(superAdmin);
    }
    
    private void crearRolAdministrador(Set<Permiso> todosPermisos) {
        Rol admin = Rol.builder()
            .nombre("ADMINISTRADOR")
            .descripcion("Acceso casi total. Puede asignar trabajadores pero no administradores.")
            .permisos(new java.util.HashSet<>(todosPermisos))
            .build();
        
        // Remover permiso de asignar administrador para que solo superadmin lo tenga
        admin.getPermisos().removeIf(p -> p.getNombre().equals("ASIGNAR_ADMINISTRADOR"));
        
        rolRepository.save(admin);
    }
    
    private void crearRolTrabajador(Set<Permiso> todosPermisos) {
        Rol trabajador = Rol.builder()
            .nombre("TRABAJADOR")
            .descripcion("Puede ver tareas de aseo, historial de rendimiento y dashboard.")
            .permisos(new java.util.HashSet<>())
            .build();
        
        // Agregar solo permisos específicos
        todosPermisos.stream()
            .filter(p -> p.getNombre().equals("VER_ASEO") ||
                         p.getNombre().equals("COMPLETAR_ASEO") ||
                         p.getNombre().equals("VER_RENDIMIENTO") ||
                         p.getNombre().equals("VER_HISTORIAL") ||
                         p.getNombre().equals("VER_DASHBOARD"))
            .forEach(trabajador::agregarPermiso);
        
        rolRepository.save(trabajador);
    }
    
    private void crearRolUsuario(Set<Permiso> todosPermisos) {
        Rol usuario = Rol.builder()
            .nombre("USUARIO")
            .descripcion("Usuario básico sin permisos iniciales.")
            .permisos(new java.util.HashSet<>())
            .build();
        
        rolRepository.save(usuario);
    }
    
    /**
     * Obtener un rol por nombre
     */
    public Optional<Rol> obtenerRolPorNombre(String nombre) {
        return rolRepository.findByNombre(nombre);
    }
    
    /**
     * Asignar un rol a un usuario
     */
    @Transactional
    public void asignarRolAUsuario(Long usuarioId, Long rolId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        Rol rol = rolRepository.findById(rolId)
            .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        
        usuario.agregarRol(rol);
        usuarioRepository.save(usuario);
    }
    
    /**
     * Asignar un rol a un usuario por email
     */
    @Transactional
    public void asignarRolAUsuarioPorEmail(String email, String nombreRol) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
        
        Rol rol = rolRepository.findByNombre(nombreRol)
            .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + nombreRol));
        
        usuario.agregarRol(rol);
        usuarioRepository.save(usuario);
    }
    
    /**
     * Remover un rol de un usuario
     */
    @Transactional
    public void removerRolDeUsuario(Long usuarioId, Long rolId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        Rol rol = rolRepository.findById(rolId)
            .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        
        usuario.removerRol(rol);
        usuarioRepository.save(usuario);
    }
    
    /**
     * Verificar si un usuario tiene un rol
     */
    public boolean usuarioTieneRol(Long usuarioId, String nombreRol) {
        return usuarioRepository.findById(usuarioId)
            .map(usuario -> usuario.tieneRol(nombreRol))
            .orElse(false);
    }
    
    /**
     * Verificar si un usuario tiene un permiso
     */
    public boolean usuarioTienePermiso(Long usuarioId, String nombrePermiso) {
        return usuarioRepository.findById(usuarioId)
            .map(usuario -> usuario.getRoles().stream()
                .anyMatch(rol -> rol.tienePermiso(nombrePermiso)))
            .orElse(false);
    }
    
    /**
     * Obtener todos los roles
     */
    public List<Rol> obtenerTodosLosRoles() {
        return rolRepository.findAll();
    }
    
    /**
     * Obtener un usuario por email
     */
    public Optional<Usuario> obtenerUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
}
