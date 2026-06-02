-- Optimización de Índices para Mejorar Performance en Bootstrap

-- Índice en producto para queries de nombre
CREATE INDEX IF NOT EXISTS idx_producto_nombre ON producto(nombre);

-- Índice en producto para queries de estado
CREATE INDEX IF NOT EXISTS idx_producto_estado ON producto(estado);

-- Índice en paso_produccion para queries por producto
CREATE INDEX IF NOT EXISTS idx_paso_produccion_producto_id ON paso_produccion(producto_id);

-- Índice en registro para ordenamiento por fecha (crucial para bootstrap)
CREATE INDEX IF NOT EXISTS idx_registro_fecha ON registro(fecha DESC);

-- Índice compuesto: empleado_id + fecha (útil si haces filtros de empleado por fecha)
CREATE INDEX IF NOT EXISTS idx_registro_empleado_fecha ON registro(empleado_id, fecha DESC);

-- Índice en empresa para búsqueda por razon_social (evita table scan)
CREATE INDEX IF NOT EXISTS idx_empresa_razon_social ON empresa(razon_social);

-- Índice en empresa para estado (útil si filtras por estado)
CREATE INDEX IF NOT EXISTS idx_empresa_estado ON empresa(estado);

-- Índice en tarea_aseo para búsqueda por completada (útil si cargas solo pendientes)
CREATE INDEX IF NOT EXISTS idx_tarea_aseo_completada ON tarea_aseo(completada);

-- Índice en empleado por estado
CREATE INDEX IF NOT EXISTS idx_empleado_estado ON empleado(estado);

-- Índice en produccion_registro para búsquedas por producto_id desde registro
CREATE INDEX IF NOT EXISTS idx_produccion_registro_producto_id ON produccion_registro(producto_id);

-- Índice en produccion_registro para búsquedas por registro_id (necesario para FK)
CREATE INDEX IF NOT EXISTS idx_produccion_registro_registro_id ON produccion_registro(registro_id);
