-- ============================================================
-- Migración: Habilitar Row Level Security (RLS) en todas las tablas públicas
--
-- CONTEXTO:
--   - El backend (Spring Boot / Hibernate) se conecta via 'postgres' o 'service_role',
--     los cuales BYPASEAN RLS por diseño -> no se rompe nada en el backend.
--   - El frontend solo accede a Supabase Storage (bucket 'evidencias'); NO hace
--     queries directas a tablas -> no necesita policies de lectura/escritura por ahora.
--   - Al activar RLS sin policies, los roles 'anon' y 'authenticated' quedan
--     completamente bloqueados para cada tabla protegida.
--
-- NOTA: Se usa un bloque DO $$ para verificar si cada tabla existe antes de
-- aplicar RLS, así la migración es idempotente y no falla si alguna tabla
-- todavía no fue creada por Hibernate.
-- ============================================================

DO $$
DECLARE
  tablas text[] := ARRAY[
    -- Catálogos y configuración
    'accion_aseo',
    'accion_produccion',
    'area_trabajo',
    'cargo_empleado',
    'tipo_documento',
    'permiso',
    'rol',
    -- Usuarios y acceso
    'usuario',
    'usuario_rol',
    'rol_permiso',
    -- Empresa y clientes
    'empresa',
    'empresa_cliente',
    -- Empleados y RRHH
    'empleado',
    'evaluacion_empleado',
    'asignacion_aseo',
    'tarea_aseo',
    -- Producción y registros
    'producto',
    'paso_produccion',
    'orden_produccion',
    'produccion_registro',
    'registro',
    'registro_aseo',
    'registro_aseo_entry',
    'maquina',
    'mantenimiento_maquina',
    'materia_prima_recibida',
    -- Pedidos, entregas y facturación
    'pedido_servicio',
    'detalle_pedido',
    'entrega',
    'entregado_por_empleado',
    'factura',
    'pago',
    -- Finanzas
    'movimiento_financiero',
    -- Contacto
    'contacto_mensaje'
  ];
  t text;
BEGIN
  FOREACH t IN ARRAY tablas LOOP
    IF EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = t
        AND table_type = 'BASE TABLE'
    ) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      RAISE NOTICE 'RLS habilitado en: public.%', t;
    ELSE
      RAISE NOTICE 'Tabla no encontrada (omitida): public.%', t;
    END IF;
  END LOOP;
END $$;

-- ─────────────────────────────────────────────────────────────
-- Policy especial para contacto_mensaje:
-- El formulario de contacto público puede insertar mensajes,
-- pero nadie externo puede leer, actualizar ni eliminar registros.
-- ─────────────────────────────────────────────────────────────

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'contacto_mensaje'
      AND table_type = 'BASE TABLE'
  ) THEN
    -- Crear la policy solo si no existe ya
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename  = 'contacto_mensaje'
        AND policyname = 'Insercion publica de mensajes de contacto'
    ) THEN
      CREATE POLICY "Insercion publica de mensajes de contacto"
        ON public.contacto_mensaje
        FOR INSERT
        TO anon
        WITH CHECK (
          eliminado = false
          AND ediciones = 0
        );
      RAISE NOTICE 'Policy de contacto creada.';
    ELSE
      RAISE NOTICE 'Policy de contacto ya existe (omitida).';
    END IF;
  ELSE
    RAISE NOTICE 'Tabla contacto_mensaje no encontrada; policy omitida.';
  END IF;
END $$;
