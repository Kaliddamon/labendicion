package dev.kali.labendicion.config;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SupabaseDataSourceConfigurationTest {

    @Test
    void toJdbcUrl_postgresqlPrefix() {
        assertThat(SupabaseDataSourceConfiguration.toJdbcUrl("postgresql://u:p@host:5432/db"))
            .isEqualTo("jdbc:postgresql://u:p@host:5432/db");
    }

    @Test
    void toJdbcUrl_postgresPrefix() {
        assertThat(SupabaseDataSourceConfiguration.toJdbcUrl("postgres://u:p@host:5432/db"))
            .isEqualTo("jdbc:postgresql://u:p@host:5432/db");
    }

    @Test
    void toJdbcUrl_alreadyJdbc() {
        assertThat(SupabaseDataSourceConfiguration.toJdbcUrl("jdbc:postgresql://host/db"))
            .isEqualTo("jdbc:postgresql://host/db");
    }

    @Test
    void toJdbcUrl_invalid() {
        assertThatThrownBy(() -> SupabaseDataSourceConfiguration.toJdbcUrl("mysql://x"))
            .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void ensureSsl_appendsForRemote() {
        assertThat(SupabaseDataSourceConfiguration.ensureSslModeForRemote("jdbc:postgresql://db.supabase.co:5432/postgres"))
            .contains("sslmode=require");
    }

    @Test
    void ensureSsl_skipsLocalhost() {
        String u = "jdbc:postgresql://localhost:5432/postgres";
        assertThat(SupabaseDataSourceConfiguration.ensureSslModeForRemote(u)).isEqualTo(u);
    }

    @Test
    void ensureSsl_idempotent() {
        String u = "jdbc:postgresql://host/db?sslmode=require";
        assertThat(SupabaseDataSourceConfiguration.ensureSslModeForRemote(u)).isEqualTo(u);
    }
}
