package dev.kali.labendicion.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "https://labendicion.vercel.app"})
public class AuthController {

    private static final String GOOGLE_CLIENT_ID = System.getenv("GOOGLE_CLIENT_ID") != null
        ? System.getenv("GOOGLE_CLIENT_ID")
        : "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

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
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("email", payload_data.getEmail());
                response.put("name", (String) payload_data.get("name"));
                response.put("picture", (String) payload_data.get("picture"));
                response.put("token", idTokenString);
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

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", true);
        return ResponseEntity.ok(response);
    }
}


