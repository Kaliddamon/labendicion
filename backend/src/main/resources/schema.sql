DO $$ 
BEGIN
    -- Verificar si la columna 'id' de la tabla 'empleado' es de tipo numérico (bigint o integer)
    -- Esto indica que son las tablas base antiguas heredadas antes de usar UUIDs (varchars)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'empleado' AND column_name = 'id' AND data_type IN ('bigint', 'integer')) THEN
        -- Como detectamos que las tablas tienen el schema viejo y causan errores 500,
        -- las dropeamos para que Hibernate las vuelva a crear con el tipo correcto (VARCHAR).
        DROP TABLE IF EXISTS paso_produccion CASCADE;
        DROP TABLE IF EXISTS produccion_registro CASCADE;
        DROP TABLE IF EXISTS registro_aseo_entry CASCADE;
        DROP TABLE IF EXISTS tarea_aseo CASCADE;
        DROP TABLE IF EXISTS registro CASCADE;
        DROP TABLE IF EXISTS registro_aseo CASCADE;
        DROP TABLE IF EXISTS producto CASCADE;
        DROP TABLE IF EXISTS accion_aseo CASCADE;
        DROP TABLE IF EXISTS accion_produccion CASCADE;
        DROP TABLE IF EXISTS area_trabajo CASCADE;
        DROP TABLE IF EXISTS cargo_empleado CASCADE;
        DROP TABLE IF EXISTS empleado CASCADE;
        DROP TABLE IF EXISTS empresa CASCADE;
    END IF;
END $$;

-- Limpieza definitiva de tablas fantasma / legacy (huérfanas del diseño inicial)
-- Se ejecutan de forma segura (IF EXISTS) sin afectar el rendimiento
DROP TABLE IF EXISTS detalle_pedido CASCADE;
DROP TABLE IF EXISTS entrega_empleado CASCADE;
DROP TABLE IF EXISTS evaluacion_empleado CASCADE;
DROP TABLE IF EXISTS factura CASCADE;
DROP TABLE IF EXISTS mantenimiento_maquina CASCADE;
DROP TABLE IF EXISTS maquina CASCADE;
DROP TABLE IF EXISTS materia_prima_recibida CASCADE;
DROP TABLE IF EXISTS pago CASCADE;
DROP TABLE IF EXISTS pedido_servicio CASCADE;
DROP TABLE IF EXISTS empresa_cliente CASCADE;
DROP TABLE IF EXISTS orden_produccion CASCADE;

