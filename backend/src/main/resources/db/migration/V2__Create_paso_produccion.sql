-- Creo la tabla paso_produccion para almacenar pasos/acciones de órdenes
CREATE TABLE IF NOT EXISTS paso_produccion (
    id VARCHAR(64) PRIMARY KEY,
    producto_id VARCHAR(64) NOT NULL,
    descripcion VARCHAR(1000),
    orden INT NOT NULL,
    completado BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_paso_producto FOREIGN KEY (producto_id) REFERENCES producto(id) ON DELETE CASCADE
);

-- Índice para búsqueda por producto
CREATE INDEX IF NOT EXISTS idx_paso_producto ON paso_produccion(producto_id);
