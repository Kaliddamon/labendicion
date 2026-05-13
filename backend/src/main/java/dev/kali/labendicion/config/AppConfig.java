package dev.kali.labendicion.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class AppConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000}")
    private String allowedOrigins;

    /** Si está definido (p. ej. http://localhost:*), tiene prioridad sobre allowed-origins. */
    @Value("${app.cors.allowed-origin-patterns:}")
    private String allowedOriginPatterns;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        var reg = registry.addMapping("/api/**")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
            .allowedHeaders("*")
            // Sin cookies en fetch desde el frontend; false evita choque con "*" en prod.
            .allowCredentials(false)
            .maxAge(3600);

        if (StringUtils.hasText(allowedOriginPatterns)) {
            String[] patterns = Arrays.stream(allowedOriginPatterns.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toArray(String[]::new);
            reg.allowedOriginPatterns(patterns);
            return;
        }

        String[] origins = Arrays.stream(allowedOrigins.split(","))
            .map(String::trim)
            .filter(StringUtils::hasText)
            .toArray(String[]::new);
        if (origins.length > 0) {
            reg.allowedOrigins(origins);
        }
    }
}

