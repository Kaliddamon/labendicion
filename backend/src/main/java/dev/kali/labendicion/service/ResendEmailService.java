package dev.kali.labendicion.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para enviar correos electrónicos mediante la API de Resend.
 * Usa java.net.http.HttpClient (Java 17+) para hacer peticiones HTTP.
 */
@Slf4j
@Service
public class ResendEmailService {

    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    private final HttpClient httpClient;

    public ResendEmailService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    /**
     * Envía un correo HTML a múltiples destinatarios vía Resend API.
     *
     * @param destinatarios Lista de emails de los destinatarios
     * @param subject       Asunto del correo
     * @param htmlContent   Contenido HTML del correo
     * @return true si el envío fue exitoso, false en caso de error
     */
    public boolean enviarCorreoHtml(List<String> destinatarios, String subject, String htmlContent) {
        if (destinatarios == null || destinatarios.isEmpty()) {
            log.warn("No hay destinatarios para enviar el correo.");
            return false;
        }

        try {
            String toArray = destinatarios.stream()
                    .map(email -> "\"" + escapeJson(email) + "\"")
                    .collect(Collectors.joining(","));

            String jsonBody = "{"
                    + "\"from\":\"" + escapeJson(fromEmail) + "\","
                    + "\"to\":[" + toArray + "],"
                    + "\"subject\":\"" + escapeJson(subject) + "\","
                    + "\"html\":\"" + escapeJson(htmlContent) + "\""
                    + "}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(RESEND_API_URL))
                    .timeout(Duration.ofSeconds(15))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200 || response.statusCode() == 201) {
                log.info("Correo enviado exitosamente vía Resend a {} destinatario(s): {}",
                        destinatarios.size(), destinatarios);
                return true;
            } else {
                log.error("Error al enviar correo vía Resend. Status: {}, Body: {}",
                        response.statusCode(), response.body());
                return false;
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Envío de correo interrumpido", e);
            return false;
        } catch (Exception e) {
            log.error("Error inesperado al enviar correo vía Resend", e);
            return false;
        }
    }

    /**
     * Escapa caracteres especiales para JSON (comillas, backslash, newlines, etc.)
     */
    private String escapeJson(String value) {
        if (value == null) return "";
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
