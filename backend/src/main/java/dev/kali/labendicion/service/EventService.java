package dev.kali.labendicion.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.*;

/**
 * Servicio para administrar eventos SSE (Server-Sent Events) en tiempo real.
 * Gestiona la suscripción de clientes y el broadcasting de cambios en la BD.
 */
@Service
public class EventService {
    private final Set<SseEmitter> emitters = ConcurrentHashMap.newKeySet();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final int EMITTER_TIMEOUT = 60000; // 60 segundos

    /**
     * Crea y registra un nuevo cliente SSE.
     */
    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter((long) EMITTER_TIMEOUT);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((throwable) -> emitters.remove(emitter));
        emitters.add(emitter);
        return emitter;
    }

    /**
     * Emite un evento a todos los clientes conectados.
     * @param tipo tipo de evento (ej: PRODUCTO_CREADO, EMPLEADO_ELIMINADO)
     * @param dato objeto con los datos del evento
     */
    public void emit(String tipo, Object dato) {
        Map<String, Object> event = new LinkedHashMap<>();
        event.put("tipo", tipo);
        event.put("dato", dato);
        event.put("timestamp", System.currentTimeMillis());

        List<SseEmitter> deadEmitters = new ArrayList<>();
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                    .id(UUID.randomUUID().toString())
                    .name(tipo)
                    .data(objectMapper.writeValueAsString(event))
                    .build());
            } catch (IOException e) {
                deadEmitters.add(emitter);
            }
        }
        // Limpiar emitters cerrados
        emitters.removeAll(deadEmitters);
    }

    /**
     * Emite un evento de forma asíncrona (sin bloquear la request del CRUD).
     */
    public void emitAsync(String tipo, Object dato) {
        CompletableFuture.runAsync(() -> emit(tipo, dato));
    }
}

