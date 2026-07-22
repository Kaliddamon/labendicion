-- Migración para añadir Modalidad de Pago y Valor Hora a la tabla de Registros
-- Esto permite que los pagos varíen diariamente y no dependan únicamente del valor fijo en el perfil del empleado

ALTER TABLE registro 
ADD COLUMN IF NOT EXISTS valor_hora integer;

ALTER TABLE registro 
ADD COLUMN IF NOT EXISTS tipo_pago text;
