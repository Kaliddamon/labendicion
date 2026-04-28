package dev.kali.labendicion.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> manejarRuntimeException(RuntimeException ex, WebRequest request) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("estado", HttpStatus.INTERNAL_SERVER_ERROR.value());
        respuesta.put("error", "Error interno del servidor");
        respuesta.put("mensaje", ex.getMessage());
        respuesta.put("ruta", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(respuesta, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> manejarValidacionException(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("estado", HttpStatus.BAD_REQUEST.value());
        respuesta.put("error", "Error de validación");
        
        Map<String, String> errores = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errores.put(error.getField(), error.getDefaultMessage())
        );
        
        respuesta.put("errores", errores);
        respuesta.put("ruta", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(respuesta, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> manejarExceptionGeneral(Exception ex, WebRequest request) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("estado", HttpStatus.INTERNAL_SERVER_ERROR.value());
        respuesta.put("error", "Excepción no manejada");
        respuesta.put("mensaje", ex.getMessage());
        respuesta.put("ruta", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(respuesta, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

