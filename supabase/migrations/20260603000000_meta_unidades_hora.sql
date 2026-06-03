ALTER TABLE paso_produccion 
ADD COLUMN meta_unidades_hora integer;

ALTER TABLE paso_produccion 
DROP COLUMN IF EXISTS orden;
