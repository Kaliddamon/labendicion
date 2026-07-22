-- Move valor_hora and tipo_pago from empleado to registro

-- 1. Add the columns to the registro table
ALTER TABLE registro ADD COLUMN IF NOT EXISTS valor_hora integer;
ALTER TABLE registro ADD COLUMN IF NOT EXISTS tipo_pago text;

-- 2. Migrate existing data from empleado to registro
UPDATE registro r
SET valor_hora = e.valor_hora,
    tipo_pago = e.tipo_pago
FROM empleado e
WHERE r.empleado_id = e.id;

-- 3. Drop the columns from the empleado table
ALTER TABLE empleado DROP COLUMN IF EXISTS valor_hora;
ALTER TABLE empleado DROP COLUMN IF EXISTS tipo_pago;
