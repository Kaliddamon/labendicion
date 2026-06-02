-- Catálogos para el frontend (sin sufijo _sync)
CREATE TABLE IF NOT EXISTS accion_produccion (
    id VARCHAR(32) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    orden INTEGER,
    activa BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS cargo_empleado (
    id VARCHAR(32) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    activa BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS area_trabajo (
    id VARCHAR(32) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(500),
    activa BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS accion_aseo (
    id VARCHAR(32) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    activa BOOLEAN DEFAULT TRUE
);

ALTER TABLE paso_produccion ADD COLUMN IF NOT EXISTS accion_produccion_id VARCHAR(32);
ALTER TABLE produccion_registro ADD COLUMN IF NOT EXISTS paso_id VARCHAR(32);
