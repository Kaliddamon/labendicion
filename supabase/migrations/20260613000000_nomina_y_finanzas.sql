-- Añade el campo valor_hora a la tabla de empleados
ALTER TABLE empleado ADD COLUMN IF NOT EXISTS valor_hora INTEGER;

-- Añade el campo valor_por_unidad a los pasos de producción
ALTER TABLE paso_produccion ADD COLUMN IF NOT EXISTS valor_por_unidad DOUBLE PRECISION;

-- Crea la tabla de movimientos financieros
CREATE TABLE IF NOT EXISTS movimiento_financiero (
    id VARCHAR(12) PRIMARY KEY,
    mes VARCHAR(7) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    monto DOUBLE PRECISION NOT NULL,
    porcentaje DOUBLE PRECISION,
    tipo VARCHAR(20) NOT NULL,
    origen VARCHAR(20) NOT NULL,
    empleado_id VARCHAR(12),
    fecha VARCHAR(10)
);

CREATE INDEX IF NOT EXISTS idx_movimiento_mes ON movimiento_financiero(mes);
CREATE INDEX IF NOT EXISTS idx_movimiento_origen ON movimiento_financiero(origen);
