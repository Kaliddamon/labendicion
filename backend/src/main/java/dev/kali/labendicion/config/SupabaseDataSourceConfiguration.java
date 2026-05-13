package dev.kali.labendicion.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

/**
 * Perfil {@code supabase}: construye el JDBC URL desde {@code DATABASE_URL} de Supabase/Render
 * (esquema {@code postgresql://} o {@code postgres://}) y fuerza SSL cuando falta.
 */
@Configuration
@Profile("supabase")
public class SupabaseDataSourceConfiguration {

    private static final Logger log = LoggerFactory.getLogger(SupabaseDataSourceConfiguration.class);

    @Bean
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isBlank()) {
            throw new IllegalStateException(
                "Perfil 'supabase': define la variable de entorno DATABASE_URL "
                    + "(cadena de conexión de Supabase: Project Settings → Database → URI)."
            );
        }

        String jdbcUrl = toJdbcUrl(databaseUrl.trim());
        jdbcUrl = ensureSslModeForRemote(jdbcUrl);

        log.info("Supabase JDBC URL (enmascarada): {}", maskPassword(jdbcUrl));

        HikariDataSource ds = new HikariDataSource();
        ds.setDriverClassName("org.postgresql.Driver");
        ds.setJdbcUrl(jdbcUrl);
        ds.setMaximumPoolSize(5);
        ds.setMinimumIdle(1);
        ds.setMaxLifetime(600_000);
        ds.setAutoCommit(true);
        return ds;
    }

    static String toJdbcUrl(String databaseUrl) {
        if (databaseUrl.startsWith("jdbc:postgresql://")) {
            return databaseUrl;
        }
        if (databaseUrl.startsWith("postgresql://")) {
            return "jdbc:" + databaseUrl;
        }
        if (databaseUrl.startsWith("postgres://")) {
            return "jdbc:postgresql://" + databaseUrl.substring("postgres://".length());
        }
        throw new IllegalStateException(
            "DATABASE_URL debe empezar por postgresql://, postgres:// o jdbc:postgresql://. Valor recibido: "
                + databaseUrl.substring(0, Math.min(24, databaseUrl.length())) + "..."
        );
    }

    /** TLS casi siempre obligatorio fuera de localhost (Supabase, Render Postgres, etc.). */
    static String ensureSslModeForRemote(String jdbcUrl) {
        if (jdbcUrl.contains("sslmode=")) {
            return jdbcUrl;
        }
        String lower = jdbcUrl.toLowerCase();
        if (lower.contains("//localhost") || lower.contains("//127.0.0.1")) {
            return jdbcUrl;
        }
        String sep = jdbcUrl.contains("?") ? "&" : "?";
        return jdbcUrl + sep + "sslmode=require";
    }

    private static String maskPassword(String url) {
        return url.replaceAll("([^:/?#]+):([^@/?#]+)@", "$1:***@");
    }
}
