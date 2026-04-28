package dev.kali.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;

/**
 * Configuración de DataSource para Supabase PostgreSQL
 *
 * Parsea automáticamente URLs de Supabase (postgresql://...)
 * a formato JDBC (jdbc:postgresql://...)
 *
 * Proporciona debugging detallado para troubleshooting de conexión
 */
@Configuration
public class DataSourceConfig {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);

    @Bean
    public DataSource dataSource() {
        logger.info("========== SUPABASE DATASOURCE CONFIGURATION ==========");

        // Leer variables de entorno
        String databaseUrl = System.getenv("DATABASE_URL");
        String pgUser = System.getenv("PGUSER");
        String pgPassword = System.getenv("PGPASSWORD");
        String pgHost = System.getenv("PGHOST");
        String pgPort = System.getenv("PGPORT");
        String pgDatabase = System.getenv("PGDATABASE");

        // Logging para debugging
        logger.info("Environment Variables Found:");
        logger.info("  DATABASE_URL: {}", databaseUrl != null ? "✓ SET" : "✗ NOT SET");
        if (pgUser != null) {
            logger.info("  PGUSER: ✓ SET ({})", pgUser);
        } else {
            logger.info("  PGUSER: ✗ NOT SET");
        }
        if (pgPassword != null) {
            logger.info("  PGPASSWORD: ✓ SET (length: {})", pgPassword.length());
        } else {
            logger.info("  PGPASSWORD: ✗ NOT SET");
        }
        logger.info("  PGHOST: {}", pgHost != null ? pgHost : "✗ NOT SET");
        logger.info("  PGPORT: {}", pgPort != null ? pgPort : "✗ NOT SET");
        logger.info("  PGDATABASE: {}", pgDatabase != null ? pgDatabase : "✗ NOT SET");

        String url = null;

        // Intenta usar DATABASE_URL si está disponible
        if (databaseUrl != null && !databaseUrl.trim().isEmpty()) {
            logger.info("\n[Method 1] Usando DATABASE_URL...");

            // Convierte postgresql:// a jdbc:postgresql://
            if (databaseUrl.startsWith("postgresql://")) {
                url = "jdbc:" + databaseUrl;
                logger.info("  Converted: postgresql:// → jdbc:postgresql://");
            } else if (databaseUrl.startsWith("jdbc:postgresql://")) {
                url = databaseUrl;
                logger.info("  Already in JDBC format");
            } else {
                logger.warn("  ⚠️ Unknown URL format: {}", databaseUrl.substring(0, Math.min(50, databaseUrl.length())));
            }

            if (url != null) {
                logger.info("  Final URL: {}", maskSensitiveUrl(url));

                try {
                    DataSource ds = DataSourceBuilder.create()
                        .driverClassName("org.postgresql.Driver")
                        .url(url)
                        .username(pgUser != null ? pgUser : "postgres")
                        .password(pgPassword != null ? pgPassword : "")
                        .build();

                    logger.info("✓ DataSource creado exitosamente desde DATABASE_URL");
                    logger.info("======================================================\n");
                    return ds;
                } catch (Exception e) {
                    logger.error("✗ Error creando DataSource desde DATABASE_URL: {}", e.getMessage());
                }
            }
        } else {
            logger.warn("✗ DATABASE_URL no está configurada");
        }

        // Fallback: Intenta usar variables individuales
        if ((pgHost != null && !pgHost.trim().isEmpty()) &&
            (pgUser != null && !pgUser.trim().isEmpty()) &&
            (pgPassword != null && !pgPassword.trim().isEmpty())) {

            logger.info("\n[Method 2] Usando variables individuales (PGHOST, PGUSER, PGPASSWORD)...");

            String port = pgPort != null ? pgPort : "5432";
            String database = pgDatabase != null ? pgDatabase : "postgres";

            url = String.format("jdbc:postgresql://%s:%s/%s", pgHost, port, database);
            logger.info("  Constructed URL: {}", maskSensitiveUrl(url));

            try {
                DataSource ds = DataSourceBuilder.create()
                    .driverClassName("org.postgresql.Driver")
                    .url(url)
                    .username(pgUser)
                    .password(pgPassword)
                    .build();

                logger.info("✓ DataSource creado exitosamente desde variables individuales");
                logger.info("======================================================\n");
                return ds;
            } catch (Exception e) {
                logger.error("✗ Error creando DataSource: {}", e.getMessage());
            }
        } else {
            logger.warn("✗ Variables individuales incompletas");
        }

        // Último recurso: usa defaults locales
        logger.warn("\n[Method 3] Usando defaults locales (ADVERTENCIA: probablemente fallará)");
        logger.warn("  URL: jdbc:postgresql://localhost:5432/postgres");
        logger.warn("  Este método es solo para desarrollo local");

        DataSource ds = DataSourceBuilder.create()
            .driverClassName("org.postgresql.Driver")
            .url("jdbc:postgresql://localhost:5432/postgres")
            .username("postgres")
            .password("password")
            .build();

        logger.info("======================================================\n");
        return ds;
    }

    /**
     * Enmascara credenciales en URLs para logging seguro
     */
    private String maskSensitiveUrl(String url) {
        if (url == null) return "null";

        // Patrón: postgresql://user:password@host:port/db
        // Reemplaza: password@host → ***@host
        return url.replaceAll("//[^:]+:([^@]+)@", "//USER:***@");
    }
}




