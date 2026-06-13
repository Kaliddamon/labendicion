-- Añade el campo tipo_pago a la tabla de empleados
ALTER TABLE empleado ADD COLUMN IF NOT EXISTS tipo_pago VARCHAR(20);
