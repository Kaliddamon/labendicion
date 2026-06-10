CREATE TABLE IF NOT EXISTS public.tipo_documento (
    id VARCHAR PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    activa BOOLEAN DEFAULT true
);

INSERT INTO public.tipo_documento (id, nombre, activa) VALUES
('CC', 'Cédula de Ciudadanía', true),
('CE', 'Cédula de Extranjería', true),
('TI', 'Tarjeta de Identidad', true),
('PAS', 'Pasaporte', true),
('NIT', 'Número de Identificación Tributaria', true),
('PEP', 'Permiso Especial de Permanencia', true),
('PPT', 'Permiso por Protección Temporal', true)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.empleado ADD COLUMN IF NOT EXISTS tipo_documento_id VARCHAR;

-- Los empleados existentes por default tendrán 'CC'
UPDATE public.empleado SET tipo_documento_id = 'CC' WHERE tipo_documento_id IS NULL;

ALTER TABLE public.empleado ADD CONSTRAINT fk_empleado_tipo_documento FOREIGN KEY (tipo_documento_id) REFERENCES public.tipo_documento(id);
