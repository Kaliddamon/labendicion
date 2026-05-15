package dev.kali.labendicion.controller;

import dev.kali.labendicion.domain.entity.Rol;
import dev.kali.labendicion.domain.entity.Usuario;
import dev.kali.labendicion.repository.UsuarioRepository;
import dev.kali.labendicion.service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "https://labendicion.vercel.app", "https://labendicion-beta.vercel.app"})
public class RolController {

    @Autowired
    private RolService rolService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Obtener todos los roles disponibles
     */
    @GetMapping
    public ResponseEntity<List<Rol>> obtenerRoles() {
        return ResponseEntity.ok(rolService.obtenerTodosLosRoles());
    }

    /**
     * Asignar un rol a un usuario por email
     * POST /api/roles/asignar
     * Body: {"email": "usuario@gmail.com", "nombreRol": "ADMINISTRADOR"}
     */
    @PostMapping("/asignar")
    public ResponseEntity<Map<String, Object>> asignarRol(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String nombreRol = payload.get("nombreRol");

            if (email == null || email.isBlank()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Email es requerido");
                return ResponseEntity.badRequest().body(error);
            }

            if (nombreRol == null || nombreRol.isBlank()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Nombre de rol es requerido");
                return ResponseEntity.badRequest().body(error);
            }

            rolService.asignarRolAUsuarioPorEmail(email, nombreRol);

            Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("mensaje", "Rol asignado correctamente");
            response.put("usuario", Map.of(
                "email", usuario.getEmail(),
                "nombre", usuario.getNombre(),
                "roles", usuario.getRoles().stream()
                    .map(Rol::getNombre)
                    .toList()
            ));

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Remover un rol de un usuario por email
     * DELETE /api/roles/remover
     * Body: {"email": "usuario@gmail.com", "nombreRol": "ADMINISTRADOR"}
     */
    @PostMapping("/remover")
    public ResponseEntity<Map<String, Object>> removerRol(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String nombreRol = payload.get("nombreRol");

            if (email == null || email.isBlank()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Email es requerido");
                return ResponseEntity.badRequest().body(error);
            }

            Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Rol rol = rolService.obtenerRolPorNombre(nombreRol)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

            usuario.removerRol(rol);
            usuarioRepository.save(usuario);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("mensaje", "Rol removido correctamente");
            response.put("usuario", Map.of(
                "email", usuario.getEmail(),
                "nombre", usuario.getNombre(),
                "roles", usuario.getRoles().stream()
                    .map(Rol::getNombre)
                    .toList()
            ));

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Obtener información de un usuario incluyendo sus roles
     * GET /api/roles/usuario?email=usuario@gmail.com
     */
    @GetMapping("/usuario")
    public ResponseEntity<Map<String, Object>> obtenerUsuario(@RequestParam String email) {
        try {
            Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Map<String, Object> response = new HashMap<>();
            response.put("id", usuario.getId());
            response.put("email", usuario.getEmail());
            response.put("nombre", usuario.getNombre());
            response.put("fotoUrl", usuario.getFotoUrl());
            response.put("activo", usuario.getActivo());
            response.put("roles", usuario.getRoles().stream()
                .map(Rol::getNombre)
                .toList());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Verificar si un usuario tiene un permiso específico
     * GET /api/roles/tiene-permiso?email=usuario@gmail.com&permiso=VER_PRODUCCION
     */
    @GetMapping("/tiene-permiso")
    public ResponseEntity<Map<String, Object>> tienePermiso(
            @RequestParam String email,
            @RequestParam String permiso) {
        try {
            Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            boolean tienePermiso = rolService.usuarioTienePermiso(usuario.getId(), permiso);

            Map<String, Object> response = new HashMap<>();
            response.put("email", email);
            response.put("permiso", permiso);
            response.put("tienePermiso", tienePermiso);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}

