-- ============================================================
-- Migración: Eliminar TODAS las tablas duplicadas (_sync y base)
-- Las tablas serán recreadas automáticamente por Hibernate (ddl-auto=update)
-- con los nombres correctos (SIN sufijo _sync).
-- ============================================================

BEGIN;

-- 1. Eliminar tablas que tienen FK hacia otras (hijas primero)
DROP TABLE IF EXISTS paso_produccion_sync CASCADE;
DROP TABLE IF EXISTS paso_produccion CASCADE;

DROP TABLE IF EXISTS produccion_registro_sync CASCADE;
DROP TABLE IF EXISTS produccion_registro CASCADE;

DROP TABLE IF EXISTS registro_aseo_entry_sync CASCADE;
DROP TABLE IF EXISTS registro_aseo_entry CASCADE;

DROP TABLE IF EXISTS tarea_aseo_sync CASCADE;
DROP TABLE IF EXISTS tarea_aseo CASCADE;

-- 2. Eliminar tablas padres de las anteriores
DROP TABLE IF EXISTS registro_sync CASCADE;
DROP TABLE IF EXISTS registro CASCADE;

DROP TABLE IF EXISTS registro_aseo_sync CASCADE;
DROP TABLE IF EXISTS registro_aseo CASCADE;

DROP TABLE IF EXISTS producto_sync CASCADE;
DROP TABLE IF EXISTS producto CASCADE;

-- 3. Eliminar tablas de catálogos
DROP TABLE IF EXISTS accion_aseo_sync CASCADE;
DROP TABLE IF EXISTS accion_aseo CASCADE;

DROP TABLE IF EXISTS accion_produccion_sync CASCADE;
DROP TABLE IF EXISTS accion_produccion CASCADE;

DROP TABLE IF EXISTS area_trabajo_sync CASCADE;
DROP TABLE IF EXISTS area_trabajo CASCADE;

DROP TABLE IF EXISTS cargo_empleado_sync CASCADE;
DROP TABLE IF EXISTS cargo_empleado CASCADE;

DROP TABLE IF EXISTS empleado_sync CASCADE;
DROP TABLE IF EXISTS empleado CASCADE;

DROP TABLE IF EXISTS empresa_sync CASCADE;
DROP TABLE IF EXISTS empresa CASCADE;

-- 4. Eliminar secuencias huérfanas de tablas _sync
DROP SEQUENCE IF EXISTS produccion_registro_sync_id_seq;

-- 5. Limpiar historial de Flyway para un fresh start
DELETE FROM flyway_schema_history;

COMMIT;
