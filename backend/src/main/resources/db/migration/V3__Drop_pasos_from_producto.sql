-- Elimina la columna pasos de producto si existe (se usará relación 1-N con paso_produccion)
-- Esta migración es compatible con H2, PostgreSQL y MySQL

-- Para H2 y PostgreSQL (soportan DROP COLUMN IF EXISTS):
ALTER TABLE producto DROP COLUMN IF EXISTS pasos;
