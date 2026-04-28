package dev.kali.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.jdbc.DataSourceBuilder;

import javax.sql.DataSource;

/**
 * Configuración de DataSource para Supabase PostgreSQL
 * Parsea automáticamente URLs de Supabase (postgresql://...) a formato JDBC
 */
@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");

        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            // Convierte postgresql:// a jdbc:postgresql://
            if (databaseUrl.startsWith("postgresql://")) {
                databaseUrl = "jdbc:" + databaseUrl;
            }

            // Si ya tiene jdbc:postgresql://, déjalo como está
            if (databaseUrl.startsWith("jdbc:postgresql://")) {
                return DataSourceBuilder.create()
                    .driverClassName("org.postgresql.Driver")
                    .url(databaseUrl)
                    .username(System.getenv("PGUSER"))
                    .password(System.getenv("PGPASSWORD"))
                    .build();
            }
        }

        // Fallback a propiedades de Spring
        return DataSourceBuilder.create()
            .driverClassName("org.postgresql.Driver")
            .build();
    }
}

