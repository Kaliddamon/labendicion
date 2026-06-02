-- Eliminar tablas legacy que tenían IDs numéricos y causan conflictos
-- Como no importan los datos actuales, esto permite un fresh start limpio
-- y que Hibernate las recree con los tipos correctos (VARCHAR)

DROP TABLE IF EXISTS paso_produccion CASCADE;
DROP TABLE IF EXISTS produccion_registro CASCADE;
DROP TABLE IF EXISTS registro_aseo_entry CASCADE;
DROP TABLE IF EXISTS tarea_aseo CASCADE;
DROP TABLE IF EXISTS registro CASCADE;
DROP TABLE IF EXISTS registro_aseo CASCADE;
DROP TABLE IF EXISTS producto CASCADE;
DROP TABLE IF EXISTS accion_aseo CASCADE;
DROP TABLE IF EXISTS accion_produccion CASCADE;
DROP TABLE IF EXISTS area_trabajo CASCADE;
DROP TABLE IF EXISTS cargo_empleado CASCADE;
DROP TABLE IF EXISTS empleado CASCADE;
DROP TABLE IF EXISTS empresa CASCADE;
