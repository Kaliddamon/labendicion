package dev.kali.labendicion.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.beans.factory.annotation.Autowired;
import dev.kali.labendicion.service.EventService;

/**
 * Controller para Server-Sent Events (SSE).
 * Los clientes se conectan a /api/events/stream y reciben eventos en tiempo real.
 */
@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventService;

    /**
     * Endpoint SSE para suscribirse a eventos en tiempo real.
     * El cliente mantiene esta conexión abierta y recibe eventos conforme se producen.
     */
    @GetMapping("/stream")
    public SseEmitter subscribe() {
        return eventService.subscribe();
    }
}

