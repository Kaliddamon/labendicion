-- Elimina la columna pasos de producto_sync si existe (se usará relación 1-N con paso_produccion_sync)
-- Esta migración es compatible con H2, PostgreSQL y MySQL

-- Nota: Algunos RDBMS requieren sintaxis específica. Flyway ejecuta la migración completa,
-- así que si una línea falla, puedes comentarla manualmente según tu RDBMS.

-- Para H2 y PostgreSQL (soportan DROP COLUMN IF EXISTS):
ALTER TABLE producto_sync DROP COLUMN IF EXISTS pasos;

-- Para MySQL (comentá si usas MySQL y reemplaza con sintaxis apropiada):
-- ALTER TABLE producto_sync DROP COLUMN IF EXISTS pasos;


