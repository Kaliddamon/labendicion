package dev.kali.labendicion.config;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SupabaseDataSourceConfigurationTest {

    @Test
    void parse_standardUri() {
        var pg = SupabaseDataSourceConfiguration.ParsedPostgres.parse(
            "postgresql://myuser:mypass@aws.example.com:5432/postgres"
        );
        assertThat(pg.jdbcUrlWithoutUser()).isEqualTo("jdbc:postgresql://aws.example.com:5432/postgres");
        assertThat(pg.username()).isEqualTo("myuser");
        assertThat(pg.password()).isEqualTo("mypass");
    }

    @Test
    void parse_percentEncodedPassword() {
        var pg = SupabaseDataSourceConfiguration.ParsedPostgres.parse(
            "postgresql://postgres:%40secret%21@host.supabase.co:5432/postgres"
        );
        assertThat(pg.username()).isEqualTo("postgres");
        assertThat(pg.password()).isEqualTo("@secret!");
    }

    @Test
    void parse_supabase_projectUser() {
        var pg = SupabaseDataSourceConfiguration.ParsedPostgres.parse(
            "postgresql://postgres.abcproj:pwd@db.abc.supabase.co:6543/postgres"
        );
        assertThat(pg.username()).isEqualTo("postgres.abcproj");
        assertThat(pg.password()).isEqualTo("pwd");
        assertThat(pg.jdbcUrlWithoutUser()).isEqualTo("jdbc:postgresql://db.abc.supabase.co:6543/postgres");
    }

    @Test
    void parse_defaultsPortAndDb() {
        var pg = SupabaseDataSourceConfiguration.ParsedPostgres.parse(
            "postgresql://u:p@onlyhost"
        );
        assertThat(pg.port()).isEqualTo(5432);
        assertThat(pg.jdbcUrlWithoutUser()).contains("/postgres");
    }

    @Test
    void parse_invalidPrefix() {
        assertThatThrownBy(() -> SupabaseDataSourceConfiguration.ParsedPostgres.parse("mysql://h"))
            .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void ensureSsl_appendsForRemote() {
        assertThat(SupabaseDataSourceConfiguration.ensureSslModeForRemote(
            "jdbc:postgresql://db.supabase.co:5432/postgres"
        )).contains("sslmode=require");
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
