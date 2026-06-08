-- Add security columns for abuse prevention
ALTER TABLE public.contacto_mensaje
ADD COLUMN eliminado boolean DEFAULT false,
ADD COLUMN ediciones integer DEFAULT 0;
