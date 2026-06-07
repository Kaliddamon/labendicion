package dev.kali.labendicion.controller;

import dev.kali.labendicion.domain.entity.ContactoMensaje;
import dev.kali.labendicion.repository.ContactoMensajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/frontend/contacto-mensajes")
public class ContactoMensajeController {

    @Autowired
    private ContactoMensajeRepository repository;

    @PostMapping
    public ResponseEntity<ContactoMensaje> createMensaje(@RequestBody ContactoMensaje mensaje) {
        ContactoMensaje saved = repository.save(mensaje);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<ContactoMensaje>> getAllMensajes() {
        List<ContactoMensaje> mensajes = repository.findAll(Sort.by(Sort.Direction.DESC, "fecha"));
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
