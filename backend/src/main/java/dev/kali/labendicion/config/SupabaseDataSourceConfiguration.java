package dev.kali.labendicion.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

/**
 * Perfil {@code supabase}: parsea {@code DATABASE_URL} (URI estándar) y construye
 * {@code jdbc:postgresql://host:port/db} con usuario/contraseña fuera del URL —
 * así se evitan URLs rotas cuando falta {@code @} o hay caracteres especiales en la clave.
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

        ParsedPostgres pg = ParsedPostgres.parse(databaseUrl.trim());
        String jdbcUrl = pg.jdbcUrlWithoutUser();
        jdbcUrl = ensureSslModeForRemote(jdbcUrl);

        log.info("Supabase Postgres host={}:{}, db={}, user={}, ssl en URL=yes",
            pg.host(),
            pg.port(),
            sanitizeDbName(pg.database()),
            pg.username() != null ? pg.username() : "?");

        HikariDataSource ds = new HikariDataSource();
        ds.setDriverClassName("org.postgresql.Driver");
        ds.setJdbcUrl(jdbcUrl);
        if (pg.username() != null) {
            ds.setUsername(pg.username());
        }
        if (pg.password() != null) {
            ds.setPassword(pg.password());
        }
        ds.setMaximumPoolSize(5);
        ds.setMinimumIdle(1);
        ds.setMaxLifetime(600_000);
        ds.setIdleTimeout(30_000);
        ds.setAutoCommit(true);
        return ds;
    }

    /** TLS fuera de localhost (Supabase, etc.). */
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

    private static String sanitizeDbName(String path) {
        if (path == null || path.isEmpty()) return "postgres";
        return path.startsWith("/") ? path.substring(1) : path;
    }

    record ParsedPostgres(String host, int port, String database, String username, String password) {

        String jdbcUrlWithoutUser() {
            int p = port > 0 ? port : 5432;
            String db = dbName();
            return "jdbc:postgresql://" + host + ":" + p + "/" + db;
        }

        private String dbName() {
            if (database == null || database.isEmpty() || "/".equals(database)) {
                return "postgres";
            }
            return database.startsWith("/") ? database.substring(1) : database;
        }

        static ParsedPostgres parse(String raw) throws IllegalStateException {
            String normalized = normalizeScheme(raw.trim());
            if (normalized.startsWith("jdbc:postgresql://")) {
                normalized = normalized.substring("jdbc:".length());
            }

            URI uri = URI.create(normalized);
            if (uri.getHost() == null || uri.getHost().isBlank()) {
                throw new IllegalStateException(
                    "DATABASE_URL debe incluir host (p. ej. db.xxxxx.supabase.co). "
                        + "Revisa que la URI sea la completa y tenga formato postgresql://user:pass@host:5432/db"
                );
            }

            int port = uri.getPort() > 0 ? uri.getPort() : 5432;
            String path = uri.getRawPath();
            if (path == null || path.isEmpty() || "/".equals(path)) {
                path = "/postgres";
            }

            String ui = uri.getRawUserInfo();
            if (ui == null || ui.isBlank()) {
                throw new IllegalStateException(
                    "DATABASE_URL debe tener forma postgresql://USUARIO:CONTRASEÑA@HOST:5432/postgres "
                        + "(no puede faltar el @ entre la contraseña y el host). "
                        + "Copia la URI desde Supabase: Settings → Database → Connection string → URI."
                );
            }

            String user;
            String pass = null;
            int firstColon = ui.indexOf(':');
            if (firstColon < 0) {
                user = decode(ui);
            } else {
                user = decode(ui.substring(0, firstColon));
                pass = decode(ui.substring(firstColon + 1));
            }

            return new ParsedPostgres(uri.getHost(), port, path, user, pass);
        }

        private static String decode(String s) {
            if (s == null) return null;
            return URLDecoder.decode(s, StandardCharsets.UTF_8);
        }

        /** Acepta postgresql://, postgres://; opcional JDBC ya formado sin credenciales (no típico). */
        static String normalizeScheme(String u) {
            if (u.startsWith("jdbc:postgresql://")) {
                return u;
            }
            if (u.startsWith("postgresql://")) {
                return u;
            }
            if (u.startsWith("postgres://")) {
                return "postgresql://" + u.substring("postgres://".length());
            }
            throw new IllegalStateException(
                "DATABASE_URL debe empezar por postgresql://, postgres:// o jdbc:postgresql://. "
                    + "Prefijo actual: \"" + u.substring(0, Math.min(28, u.length())) + "...\""
            );
        }
    }
}
