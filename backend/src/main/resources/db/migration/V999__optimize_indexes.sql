-- Optimización de Índices para Mejorar Performance en Bootstrap
-- Ejecutar en Supabase SQL Editor

-- Índice en producto_sync para queries de nombre
CREATE INDEX IF NOT EXISTS idx_producto_sync_nombre ON producto_sync(nombre);

-- Índice en producto_sync para queries de estado
CREATE INDEX IF NOT EXISTS idx_producto_sync_estado ON producto_sync(estado);

-- Índice en paso_produccion_sync para queries por producto
CREATE INDEX IF NOT EXISTS idx_paso_produccion_sync_producto_id ON paso_produccion_sync(producto_sync_id);

-- Índice en registro_sync para ordenamiento por fecha (crucial para bootstrap)
CREATE INDEX IF NOT EXISTS idx_registro_sync_fecha ON registro_sync(fecha DESC);

-- Índice compuesto: empleado_id + fecha (útil si haces filtros de empleado por fecha)
CREATE INDEX IF NOT EXISTS idx_registro_sync_empleado_fecha ON registro_sync(empleado_id, fecha DESC);

-- Índice en empresa_sync para búsqueda por razon_social (evita table scan)
CREATE INDEX IF NOT EXISTS idx_empresa_sync_razon_social ON empresa_sync(razon_social);

-- Índice en empresa_sync para estado (útil si filtras por estado)
CREATE INDEX IF NOT EXISTS idx_empresa_sync_estado ON empresa_sync(estado);

-- Índice en tarea_aseo_sync para búsqueda por completada (útil si cargas solo pendientes)
CREATE INDEX IF NOT EXISTS idx_tarea_aseo_sync_completada ON tarea_aseo_sync(completada);

-- Índice en empleado_sync por estado (si es importante)
CREATE INDEX IF NOT EXISTS idx_empleado_sync_estado ON empleado_sync(estado);

-- Índice en produccion_registro_sync para búsquedas por producto_id desde registro
CREATE INDEX IF NOT EXISTS idx_produccion_registro_sync_producto_id ON produccion_registro_sync(producto_id);

-- Índice en produccion_registro_sync para búsquedas por registro_sync_id (necesario para FK)
CREATE INDEX IF NOT EXISTS idx_produccion_registro_sync_registro_id ON produccion_registro_sync(registro_sync_id);

-- NOTA: Si la tabla producto_sync tiene muchas filas, considera añadir:
-- CREATE INDEX IF NOT EXISTS idx_producto_sync_empresa ON producto_sync(empresa);
-- Esto ayuda a buscar productos por empresa rápidamente.

