-- Creo la tabla paso_produccion_sync para almacenar pasos/acciones de órdenes
CREATE TABLE IF NOT EXISTS paso_produccion_sync (
    id VARCHAR(64) PRIMARY KEY,
    producto_sync_id VARCHAR(64) NOT NULL,
    descripcion VARCHAR(1000),
    orden INT NOT NULL,
    completado BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_paso_producto FOREIGN KEY (producto_sync_id) REFERENCES producto_sync(id) ON DELETE CASCADE
);

-- Índice para búsqueda por producto
CREATE INDEX IF NOT EXISTS idx_paso_producto ON paso_produccion_sync(producto_sync_id);

