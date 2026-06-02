-- V6__DropBaseAndRenameSync.sql
-- This migration removes the original tables that were duplicated with *_sync suffixes.
-- The *_sync tables have already been renamed to their canonical names in V5__Rename_tables.sql.
-- We drop the now‑redundant base tables (if they exist) and cascade to remove any dependent constraints.

BEGIN;

-- Drop old base tables (if they still exist)
DROP TABLE IF EXISTS empresa          CASCADE;
DROP TABLE IF EXISTS accion_produccion          CASCADE;
DROP TABLE IF EXISTS cargo_empleado          CASCADE;
DROP TABLE IF EXISTS area_trabajo          CASCADE;
DROP TABLE IF EXISTS accion_aseo          CASCADE;
DROP TABLE IF EXISTS paso_produccion          CASCADE;
DROP TABLE IF EXISTS produccion_registro          CASCADE;
DROP TABLE IF EXISTS registro          CASCADE;
DROP TABLE IF EXISTS registro_aseo          CASCADE;
DROP TABLE IF EXISTS registro_aseo_entry          CASCADE;
DROP TABLE IF EXISTS tarea_aseo          CASCADE;
DROP TABLE IF EXISTS empleado          CASCADE;
DROP TABLE IF EXISTS producto          CASCADE;
DROP TABLE IF EXISTS paso_produccion_sync; -- in case any leftover
DROP TABLE IF EXISTS produccion_registro_sync;
DROP TABLE IF EXISTS registro_sync;
DROP TABLE IF EXISTS registro_aseo_sync;
DROP TABLE IF EXISTS registro_aseo_entry_sync;
DROP TABLE IF EXISTS tarea_aseo_sync;
DROP TABLE IF EXISTS empleado_sync;
DROP TABLE IF EXISTS producto_sync;

COMMIT;
