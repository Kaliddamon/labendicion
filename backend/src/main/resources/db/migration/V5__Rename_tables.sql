-- Migración V5: Renombrar tablas de _sync a su forma base
ALTER TABLE empresa_sync RENAME TO empresa;
ALTER TABLE paso_produccion_sync RENAME TO paso_produccion;
ALTER TABLE producto_sync RENAME TO producto;
ALTER TABLE accion_produccion_sync RENAME TO accion_produccion;
ALTER TABLE cargo_empleado_sync RENAME TO cargo_empleado;
ALTER TABLE area_trabajo_sync RENAME TO area_trabajo;
ALTER TABLE accion_aseo_sync RENAME TO accion_aseo;
ALTER TABLE produccion_registro_sync RENAME TO produccion_registro;
ALTER TABLE registro_sync RENAME TO registro;
ALTER TABLE registro_aseo_sync RENAME TO registro_aseo;
ALTER TABLE registro_aseo_entry_sync RENAME TO registro_aseo_entry;
ALTER TABLE tarea_aseo_sync RENAME TO tarea_aseo;
ALTER TABLE empleado_sync RENAME TO empleado;
