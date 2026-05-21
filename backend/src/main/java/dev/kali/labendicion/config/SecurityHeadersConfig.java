package dev.kali.labendicion.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Configura cabeceras de seguridad HTTP que afectan la comunicación entre ventanas/ventanas emergentes.
 *
 * Problema: algunas bibliotecas de login (p. ej. Google Identity Services) usan ventanas emergentes y
 * window.postMessage para comunicarse con la ventana padre. Si el servidor envía
 * "Cross-Origin-Opener-Policy: same-origin" se bloquea esa comunicación.
 *
 * Solución: permitir popups manteniendo la política de opener con:
 *   Cross-Origin-Opener-Policy: same-origin-allow-popups
 */
@Configuration
public class SecurityHeadersConfig {

    @Bean
    public OncePerRequestFilter securityHeadersFilter() {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
                // Permitir que ventanas emergentes (popups) de otros orígenes comuniquen vía postMessage
                response.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
                // No forzamos COEP aquí; si en el futuro necesitas Cross-Origin-Embedder-Policy, revísalo con cuidado.
                filterChain.doFilter(request, response);
            }
        };
    }
}
