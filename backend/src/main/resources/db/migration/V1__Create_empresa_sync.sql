-- Creo la tabla empresa_sync para almacenar empresas/clientes
CREATE TABLE IF NOT EXISTS empresa_sync (
    id VARCHAR(64) PRIMARY KEY,
    razon_social VARCHAR(255) NOT NULL,
    telefono VARCHAR(100),
    correo VARCHAR(255),
    direccion VARCHAR(512),
    estado VARCHAR(50) NOT NULL DEFAULT 'Sin ordenes'
);

-- Índice para búsqueda frecuente por razon_social
CREATE INDEX IF NOT EXISTS idx_empresa_razon_social ON empresa_sync(razon_social);
