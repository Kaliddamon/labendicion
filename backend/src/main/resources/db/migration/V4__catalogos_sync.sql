-- Catálogos para el frontend sync (Hibernate ddl-auto=update también crea estas tablas)
CREATE TABLE IF NOT EXISTS accion_produccion_sync (
    id VARCHAR(32) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    orden INTEGER,
    activa BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS cargo_empleado_sync (
    id VARCHAR(32) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    activa BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS area_trabajo_sync (
    id VARCHAR(32) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(500),
    activa BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS accion_aseo_sync (
    id VARCHAR(32) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    activa BOOLEAN DEFAULT TRUE
);

ALTER TABLE paso_produccion_sync ADD COLUMN IF NOT EXISTS accion_produccion_id VARCHAR(32);
ALTER TABLE produccion_registro_sync ADD COLUMN IF NOT EXISTS paso_id VARCHAR(32);
