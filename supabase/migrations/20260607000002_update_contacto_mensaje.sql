-- Add asunto column to contacto_mensaje
ALTER TABLE public.contacto_mensaje
ADD COLUMN asunto character varying(255) NOT NULL DEFAULT 'Sin Asunto';

-- Add max length constraint to mensaje
ALTER TABLE public.contacto_mensaje
ADD CONSTRAINT max_length_mensaje CHECK (char_length(mensaje) <= 200);
