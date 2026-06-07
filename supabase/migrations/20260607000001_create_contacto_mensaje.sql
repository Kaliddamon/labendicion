CREATE TABLE public.contacto_mensaje (
    id SERIAL PRIMARY KEY,
    usuario_email character varying(255) NOT NULL,
    usuario_nombre character varying(255) NOT NULL,
    mensaje text NOT NULL,
    fecha timestamp without time zone DEFAULT now(),
    leido boolean DEFAULT false
);
