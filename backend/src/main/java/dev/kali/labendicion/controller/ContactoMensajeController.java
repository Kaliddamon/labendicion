package dev.kali.labendicion.controller;

import dev.kali.labendicion.domain.entity.ContactoMensaje;
import dev.kali.labendicion.repository.ContactoMensajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/frontend/contacto-mensajes")
public class ContactoMensajeController {

    @Autowired
    private ContactoMensajeRepository repository;

    @GetMapping("/mi-mensaje")
    public ResponseEntity<ContactoMensaje> getMiMensaje(@RequestParam String email) {
        return repository.findByUsuarioEmailAndEliminadoFalse(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping
    public ResponseEntity<?> createMensaje(@RequestBody ContactoMensaje mensaje) {
        // Validation: Length <= 200
        if (mensaje.getMensaje() == null || mensaje.getMensaje().length() > 200) {
            return ResponseEntity.badRequest().body("El mensaje no puede exceder los 200 caracteres.");
        }

        // Validation: 5 messages per day system-wide
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        long messagesToday = repository.countByFechaAfter(startOfDay);
        if (messagesToday >= 5) {
            return ResponseEntity.status(429).body("Se ha alcanzado el límite diario de mensajes recibidos por el sistema. Por favor, intenta mañana.");
        }

        // Validation: One message per user (ignoring soft-deleted)
        Optional<ContactoMensaje> existing = repository.findByUsuarioEmailAndEliminadoFalse(mensaje.getUsuarioEmail());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("Ya tienes un mensaje enviado activo.");
        }

        ContactoMensaje saved = repository.save(mensaje);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMensaje(@PathVariable Long id, @RequestBody ContactoMensaje updated) {
        if (updated.getMensaje() == null || updated.getMensaje().length() > 200) {
            return ResponseEntity.badRequest().body("El mensaje no puede exceder los 200 caracteres.");
        }
        return repository.findById(id).map(mensaje -> {
            // Ownership validation
            if (!mensaje.getUsuarioEmail().equals(updated.getUsuarioEmail())) {
                return ResponseEntity.status(403).body("No tienes permisos para editar este mensaje.");
            }
            // Freeze if read
            if (Boolean.TRUE.equals(mensaje.getLeido())) {
                return ResponseEntity.status(403).body("No puedes editar un mensaje que ya ha sido leído por un administrador.");
            }
            // Rate limit edits
            if (mensaje.getEdiciones() >= 3) {
                return ResponseEntity.status(429).body("Has alcanzado el límite máximo de ediciones para este mensaje.");
            }

            mensaje.setAsunto(updated.getAsunto());
            mensaje.setMensaje(updated.getMensaje());
            mensaje.setEdiciones(mensaje.getEdiciones() + 1);
            return ResponseEntity.ok(repository.save(mensaje));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMensaje(@PathVariable Long id, @RequestParam String email) {
        return repository.findById(id).map(mensaje -> {
            // Ownership validation
            if (!mensaje.getUsuarioEmail().equals(email)) {
                return ResponseEntity.status(403).body("No tienes permisos para eliminar este mensaje.");
            }
            // Freeze if read
            if (Boolean.TRUE.equals(mensaje.getLeido())) {
                return ResponseEntity.status(403).body("No puedes eliminar un mensaje que ya ha sido leído por un administrador.");
            }
            
            mensaje.setEliminado(true);
            repository.save(mensaje);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ContactoMensaje>> getAllMensajes() {
        List<ContactoMensaje> mensajes = repository.findByEliminadoFalse(Sort.by(Sort.Direction.DESC, "fecha"));
        return ResponseEntity.ok(mensajes);
    }

    @PatchMapping("/{id}/leido")
    public ResponseEntity<ContactoMensaje> marcarLeido(@PathVariable Long id, @RequestBody java.util.Map<String, Boolean> payload) {
        return repository.findById(id).map(mensaje -> {
            Boolean leido = payload.get("leido");
            if (leido != null) {
                mensaje.setLeido(leido);
            }
            return ResponseEntity.ok(repository.save(mensaje));
        }).orElse(ResponseEntity.notFound().build());
    }
}
