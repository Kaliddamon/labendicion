package dev.kali.labendicion.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import dev.kali.labendicion.domain.entity.Usuario;
import dev.kali.labendicion.repository.UsuarioRepository;
import dev.kali.labendicion.service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.security.GeneralSecurityException;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${app.superadmin.email:cristian.san.garcia@gmail.com}")
    private String superadminEmail;

    private static final String GOOGLE_CLIENT_ID = System.getenv("GOOGLE_CLIENT_ID") != null
        ? System.getenv("GOOGLE_CLIENT_ID")
        : "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolService rolService;

    @PostMapping("/verify-google")
    public ResponseEntity<Map<String, Object>> verifyGoogleToken(@RequestBody Map<String, String> payload) {
        String idTokenString = payload.get("token");
        if (idTokenString == null || idTokenString.isBlank()) {
            return ResponseEntity.badRequest()
                .body(Collections.singletonMap("error", "Token no proporcionado"));
        }

        try {
            JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), jsonFactory)
                .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                .build();

            var idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                var payload_data = idToken.getPayload();
                String email = payload_data.getEmail();
                String nombre = (String) payload_data.get("name");
                String fotoUrl = (String) payload_data.get("picture");
                String googleId = payload_data.getSubject();

                // Crear o actualizar usuario en BD
                Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseGet(() -> {
                        Usuario nuevoUsuario = Usuario.builder()
                            .email(email)
                            .nombre(nombre)
                            .fotoUrl(fotoUrl)
                            .googleId(googleId)
                            .activo(true)
                            .build();

                        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

                        // Asignar rol por defecto según el email
                        try {
                            if (superadminEmail.equals(email)) {
                                rolService.asignarRolAUsuarioPorEmail(email, "SUPERADMINISTRADOR");
                            } else {
                                rolService.asignarRolAUsuarioPorEmail(email, "USUARIO");
                            }
                        } catch (Exception e) {
                            System.err.println("Error asignando rol inicial: " + e.getMessage());
                        }

                        return usuarioGuardado;
                    });

                // Verificar y asignar rol SUPERADMINISTRADOR si es el email específico
                if (superadminEmail.equals(email)) {
                    boolean tieneSuperAdmin = usuario.getRoles().stream()
                        .anyMatch(rol -> "SUPERADMINISTRADOR".equals(rol.getNombre()));

                    if (!tieneSuperAdmin) {
                        try {
                            rolService.asignarRolAUsuarioPorEmail(email, "SUPERADMINISTRADOR");
                            // Recargar usuario con el nuevo rol
                            usuario = usuarioRepository.findById(usuario.getId()).orElse(usuario);
                        } catch (Exception e) {
                            System.err.println("Error asignando rol SUPERADMINISTRADOR: " + e.getMessage());
                        }
                    }
                }

                // Actualizar último acceso
                usuario.setNombre(nombre);
                usuario.setFotoUrl(fotoUrl);
                usuarioRepository.save(usuario);

                // Preparar respuesta
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("email", email);
                response.put("name", nombre);
                response.put("picture", fotoUrl);
                response.put("token", idTokenString);
                response.put("id", usuario.getId());
                response.put("roles", usuario.getRoles().stream()
                    .map(rol -> rol.getNombre())
                    .collect(Collectors.toList()));

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401)
                    .body(Collections.singletonMap("error", "Token inválido"));
            }
        } catch (GeneralSecurityException | IOException e) {
            return ResponseEntity.status(401)
                .body(Collections.singletonMap("error", "Error validando token: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Sesión cerrada correctamente");
        return ResponseEntity.ok(response);
    }

}