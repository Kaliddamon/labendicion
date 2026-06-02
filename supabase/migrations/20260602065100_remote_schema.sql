drop extension if exists "pg_net";

create sequence "public"."area_trabajo_id_seq";

create sequence "public"."asignacion_aseo_id_seq";

create sequence "public"."detalle_pedido_id_seq";

create sequence "public"."empleado_id_seq";

create sequence "public"."empresa_cliente_id_seq";

create sequence "public"."entrega_id_seq";

create sequence "public"."entregado_por_empleado_id_seq";

create sequence "public"."evaluacion_empleado_id_seq";

create sequence "public"."factura_id_seq";

create sequence "public"."mantenimiento_maquina_id_seq";

create sequence "public"."maquina_id_seq";

create sequence "public"."materia_prima_recibida_id_seq";

create sequence "public"."orden_produccion_id_seq";

create sequence "public"."pago_id_seq";

create sequence "public"."pedido_servicio_id_seq";

create sequence "public"."permiso_id_seq";

create sequence "public"."produccion_registro_id_seq";

create sequence "public"."produccion_registro_sync_id_seq";

create sequence "public"."rol_id_seq";

create sequence "public"."tarea_aseo_id_seq";

create sequence "public"."usuario_id_seq";


  create table "public"."accion_aseo" (
    "id" character varying(255) not null,
    "activa" boolean,
    "nombre" character varying(255) not null
      );



  create table "public"."accion_aseo_sync" (
    "id" character varying(255) not null,
    "activa" boolean,
    "nombre" character varying(255) not null
      );



  create table "public"."accion_produccion" (
    "id" character varying(255) not null,
    "activa" boolean,
    "nombre" character varying(255) not null,
    "orden" integer
      );



  create table "public"."accion_produccion_sync" (
    "id" character varying(255) not null,
    "activa" boolean,
    "nombre" character varying(255) not null,
    "orden" integer
      );



  create table "public"."area_trabajo" (
    "activa" boolean,
    "id" bigint not null default nextval('public.area_trabajo_id_seq'::regclass),
    "descripcion" character varying(255),
    "nombre" character varying(255)
      );



  create table "public"."area_trabajo_sync" (
    "id" character varying(255) not null,
    "activa" boolean,
    "descripcion" character varying(255),
    "nombre" character varying(255) not null
      );



  create table "public"."asignacion_aseo" (
    "completada" boolean,
    "area_trabajo_id" bigint not null,
    "empleado_id" bigint not null,
    "fecha_asignacion" timestamp without time zone not null default CURRENT_TIMESTAMP,
    "id" bigint not null default nextval('public.asignacion_aseo_id_seq'::regclass),
    "turno" character varying(255)
      );



  create table "public"."cargo_empleado" (
    "id" character varying(255) not null,
    "activa" boolean,
    "nombre" character varying(255) not null
      );



  create table "public"."cargo_empleado_sync" (
    "id" character varying(255) not null,
    "activa" boolean,
    "nombre" character varying(255) not null
      );



  create table "public"."detalle_pedido" (
    "cantidad" integer,
    "precio_unitario" double precision,
    "id" bigint not null default nextval('public.detalle_pedido_id_seq'::regclass),
    "pedido_servicio_id" bigint not null,
    "descripcion" character varying(255),
    "talla" character varying(255)
      );



  create table "public"."empleado" (
    "activo" boolean,
    "salario" double precision,
    "fecha_ingreso" character varying(255) not null default CURRENT_TIMESTAMP,
    "id" bigint not null default nextval('public.empleado_id_seq'::regclass),
    "apellido" character varying(255),
    "cargo" character varying(255),
    "email" character varying(255),
    "nombre" character varying(255),
    "numero_identificacion" character varying(255),
    "telefono" character varying(255),
    "turno" character varying(255),
    "documento" character varying(255),
    "estado" character varying(255)
      );



  create table "public"."empleado_sync" (
    "cargo" character varying(255),
    "documento" character varying(255),
    "estado" character varying(255),
    "fecha_ingreso" character varying(255),
    "id" character varying(255) not null,
    "nombre" character varying(255),
    "telefono" character varying(255)
      );



  create table "public"."empresa" (
    "id" character varying(255) not null,
    "correo" character varying(255),
    "direccion" character varying(255),
    "estado" character varying(255),
    "razon_social" character varying(255),
    "telefono" character varying(255)
      );



  create table "public"."empresa_cliente" (
    "fecha_registro" timestamp without time zone not null default CURRENT_TIMESTAMP,
    "id" bigint not null default nextval('public.empresa_cliente_id_seq'::regclass),
    "contacto_persona" character varying(255),
    "direccion" character varying(255),
    "email" character varying(255),
    "nit" character varying(255),
    "nombre" character varying(255),
    "telefono" character varying(255)
      );



  create table "public"."empresa_sync" (
    "id" character varying(255) not null,
    "correo" character varying(255),
    "direccion" character varying(255),
    "estado" character varying(255),
    "razon_social" character varying(255),
    "telefono" character varying(255)
      );



  create table "public"."entrega" (
    "fecha_entrega" date,
    "fecha_registro" timestamp without time zone not null default CURRENT_TIMESTAMP,
    "id" bigint not null default nextval('public.entrega_id_seq'::regclass),
    "pedido_servicio_id" bigint not null,
    "direccion_entrega" character varying(255),
    "estado" character varying(255),
    "observaciones" character varying(255)
      );



  create table "public"."entregado_por_empleado" (
    "empleado_id" bigint not null,
    "entrega_id" bigint not null,
    "fecha_registro" timestamp without time zone not null default CURRENT_TIMESTAMP,
    "id" bigint not null default nextval('public.entregado_por_empleado_id_seq'::regclass)
      );



  create table "public"."evaluacion_empleado" (
    "calificacion" double precision,
    "periodo_evaluacion" date,
    "empleado_id" bigint not null,
    "fecha_evaluacion" timestamp without time zone not null default CURRENT_TIMESTAMP,
    "id" bigint not null default nextval('public.evaluacion_empleado_id_seq'::regclass),
    "comentarios" character varying(255)
      );



  create table "public"."factura" (
    "fecha_emision" date,
    "fecha_vencimiento" date,
    "monto" double precision,
    "monto_pagado" double precision,
    "empresa_cliente_id" bigint not null,
    "fecha_registro" timestamp without time zone not null default CURRENT_TIMESTAMP,
    "id" bigint not null default nextval('public.factura_id_seq'::regclass),
    "pedido_servicio_id" bigint not null,
    "estado" character varying(255),
    "numero_factura" character varying(255)
      );



  create table "public"."mantenimiento_maquina" (
    "fecha_mantenimiento" timestamp without time zone not null default CURRENT_TIMESTAMP,
    "id" bigint not null default nextval('public.mantenimiento_maquina_id_seq'::regclass),
    "maquina_id" bigint not null,
    "descripcion" character varying(255),
    "responsable" character varying(255),
    "tipo_mantenimiento" character varying(255)
      );



  create table "public"."maquina" (
    "operativa" boolean,
    "area_trabajo_id" bigint,
    "id" bigint not null default nextval('public.maquina_id_seq'::regclass),
    "modelo" character varying(255),
    "numeroserie" character varying(255),
    "observaciones" character varying(255),
    "tipo_maquina" character varying(255)
      );



  create table "public"."materia_prima_recibida" (
    "cantidad" double precision,
    "empresa_cliente_id" bigint,
    "fecha_recepcion" timestamp without time zone not null default CURRENT_TIMESTAMP,
    "id" bigint not null default nextval('public.materia_prima_recibida_id_seq'::regclass),
    "descripcion" character varying(255),
    "lote" character varying(255),
    "tipo_material" character varying(255),
    "unidad" character varying(255)
      );



  create table "public"."orden_produccion" (
    "progreso" integer,
    "area_trabajo_id" bigint,
    "fecha_completacion" timestamp(6) without time zone,
    "fecha_creacion" timestamp without time zone not null default CURRENT_TIMESTAMP,
    "id" bigint not null default nextval('public.orden_produccion_id_seq'::regclass),
    "pedido_servicio_id" bigint not null,
    "estado" character varying(255)
      );



  create table "public"."pago" (
    "fecha_pago" date,
    "monto" double precision,
    "factura_id" bigint not null,
    "fecha_registro" timestamp without time zone not null default CURRENT_TIMESTAMP,
    "id" bigint not null default nextval('public.pago_id_seq'::regclass),
    "metodo_pago" character varying(255),
    "referencia" character varying(255)
      );



  create table "public"."paso_produccion" (
    "id" character varying(255) not null,
    "accion_produccion_id" character varying(255),
    "completado" boolean,
    "descripcion" character varying(255),
    "orden" integer,
    "producto_id" character varying(255) not null
      );



  create table "public"."paso_produccion_sync" (
    "id" character varying(255) not null,
    "completado" boolean,
    "descripcion" character varying(255),
    "orden" integer,
    "producto_sync_id" character varying(255) not null,
    "accion_produccion_id" character varying(255)
      );



  create table "public"."pedido_servicio" (
    "fecha_entrega" date,
    "empresa_cliente_id" bigint not null,
    "fecha_actualizacion" timestamp(6) without time zone,
    "fecha_registro" timestamp without time zone not null default CURRENT_TIMESTAMP,
    "id" bigint not null default nextval('public.pedido_servicio_id_seq'::regclass),
    "descripcion" character varying(255),
    "estado" character varying(255),
    "prioridad" character varying(255)
      );



  create table "public"."permiso" (
    "id" bigint not null default nextval('public.permiso_id_seq'::regclass),
    "categoria" character varying(255) not null,
    "descripcion" character varying(255),
    "nombre" character varying(255) not null
      );



  create table "public"."produccion_registro" (
    "id" bigint not null default nextval('public.produccion_registro_id_seq'::regclass),
    "paso_id" character varying(255),
    "producto_id" character varying(255),
    "unidades_buenas" integer,
    "unidades_totales" integer,
    "registro_id" character varying(255)
      );



  create table "public"."produccion_registro_sync" (
    "unidades_buenas" integer,
    "unidades_totales" integer,
    "id" bigint not null default nextval('public.produccion_registro_sync_id_seq'::regclass),
    "producto_id" character varying(255),
    "registro_sync_id" character varying(255),
    "paso_id" character varying(255)
      );



  create table "public"."producto" (
    "id" character varying(255) not null,
    "cantidad" integer,
    "empresa" character varying(255),
    "estado" character varying(255),
    "fecha_asignacion" character varying(255),
    "fecha_entrega_real" character varying(255),
    "fecha_terminacion" character varying(255),
    "ganancia" integer,
    "nombre" character varying(255)
      );



  create table "public"."producto_sync" (
    "cantidad" integer,
    "ganancia" integer,
    "empresa" character varying(255),
    "estado" character varying(255),
    "fecha_asignacion" character varying(255),
    "fecha_terminacion" character varying(255),
    "id" character varying(255) not null,
    "nombre" character varying(255),
    "fecha_entrega_real" character varying(255)
      );



  create table "public"."registro" (
    "id" character varying(255) not null,
    "empleado_id" character varying(255),
    "fecha" character varying(255),
    "hora_entrada" character varying(255),
    "hora_salida" character varying(255),
    "unidades_buenas" integer,
    "unidades_totales" integer
      );



  create table "public"."registro_aseo" (
    "id" character varying(255) not null,
    "fecha" character varying(255)
      );



  create table "public"."registro_aseo_entry" (
    "id" character varying(255) not null,
    "acciones_csv" character varying(255),
    "areas_csv" character varying(255),
    "completada" boolean not null,
    "empleado_id" character varying(255),
    "empleado_nombre" character varying(255),
    "registro_aseo_id" character varying(255)
      );



  create table "public"."registro_aseo_entry_sync" (
    "id" character varying(255) not null,
    "acciones_csv" character varying(255),
    "areas_csv" character varying(255),
    "completada" boolean not null,
    "empleado_id" character varying(255),
    "empleado_nombre" character varying(255),
    "registro_aseo_id" character varying(255)
      );



  create table "public"."registro_aseo_sync" (
    "id" character varying(255) not null,
    "fecha" character varying(255)
      );



  create table "public"."registro_sync" (
    "unidades_buenas" integer,
    "unidades_totales" integer,
    "empleado_id" character varying(255),
    "fecha" character varying(255),
    "hora_entrada" character varying(255),
    "hora_salida" character varying(255),
    "id" character varying(255) not null
      );



  create table "public"."rol" (
    "id" bigint not null default nextval('public.rol_id_seq'::regclass),
    "descripcion" character varying(255),
    "nombre" character varying(255) not null
      );



  create table "public"."rol_permiso" (
    "rol_id" bigint not null,
    "permiso_id" bigint not null
      );



  create table "public"."tarea_aseo" (
    "completada" boolean,
    "asignacion_aseo_id" bigint not null,
    "hora_completacion" timestamp(6) without time zone,
    "id" character varying(255) not null default nextval('public.tarea_aseo_id_seq'::regclass),
    "descripcion" character varying(255),
    "accion" character varying(255),
    "area" character varying(255),
    "encargado" character varying(255)
      );



  create table "public"."tarea_aseo_sync" (
    "completada" boolean not null,
    "accion" character varying(255),
    "area" character varying(255),
    "encargado" character varying(255),
    "id" character varying(255) not null
      );



  create table "public"."usuario" (
    "id" bigint not null default nextval('public.usuario_id_seq'::regclass),
    "activo" boolean,
    "email" character varying(255) not null,
    "fecha_registro" timestamp without time zone not null default CURRENT_TIMESTAMP,
    "foto_url" character varying(255),
    "google_id" character varying(255),
    "nombre" character varying(255),
    "ultimo_acceso" timestamp(6) without time zone
      );



  create table "public"."usuario_rol" (
    "usuario_id" bigint not null,
    "rol_id" bigint not null
      );


alter sequence "public"."area_trabajo_id_seq" owned by "public"."area_trabajo"."id";

alter sequence "public"."asignacion_aseo_id_seq" owned by "public"."asignacion_aseo"."id";

alter sequence "public"."detalle_pedido_id_seq" owned by "public"."detalle_pedido"."id";

alter sequence "public"."empleado_id_seq" owned by "public"."empleado"."id";

alter sequence "public"."empresa_cliente_id_seq" owned by "public"."empresa_cliente"."id";

alter sequence "public"."entrega_id_seq" owned by "public"."entrega"."id";

alter sequence "public"."entregado_por_empleado_id_seq" owned by "public"."entregado_por_empleado"."id";

alter sequence "public"."evaluacion_empleado_id_seq" owned by "public"."evaluacion_empleado"."id";

alter sequence "public"."factura_id_seq" owned by "public"."factura"."id";

alter sequence "public"."mantenimiento_maquina_id_seq" owned by "public"."mantenimiento_maquina"."id";

alter sequence "public"."maquina_id_seq" owned by "public"."maquina"."id";

alter sequence "public"."materia_prima_recibida_id_seq" owned by "public"."materia_prima_recibida"."id";

alter sequence "public"."orden_produccion_id_seq" owned by "public"."orden_produccion"."id";

alter sequence "public"."pago_id_seq" owned by "public"."pago"."id";

alter sequence "public"."pedido_servicio_id_seq" owned by "public"."pedido_servicio"."id";

alter sequence "public"."permiso_id_seq" owned by "public"."permiso"."id";

alter sequence "public"."produccion_registro_id_seq" owned by "public"."produccion_registro"."id";

alter sequence "public"."produccion_registro_sync_id_seq" owned by "public"."produccion_registro_sync"."id";

alter sequence "public"."rol_id_seq" owned by "public"."rol"."id";

alter sequence "public"."tarea_aseo_id_seq" owned by "public"."tarea_aseo"."id";

alter sequence "public"."usuario_id_seq" owned by "public"."usuario"."id";

CREATE UNIQUE INDEX accion_aseo_pkey ON public.accion_aseo USING btree (id);

CREATE UNIQUE INDEX accion_aseo_sync_pkey ON public.accion_aseo_sync USING btree (id);

CREATE UNIQUE INDEX accion_produccion_pkey ON public.accion_produccion USING btree (id);

CREATE UNIQUE INDEX accion_produccion_sync_pkey ON public.accion_produccion_sync USING btree (id);

CREATE UNIQUE INDEX area_trabajo_pkey ON public.area_trabajo USING btree (id);

CREATE UNIQUE INDEX area_trabajo_sync_pkey ON public.area_trabajo_sync USING btree (id);

CREATE UNIQUE INDEX asignacion_aseo_pkey ON public.asignacion_aseo USING btree (id);

CREATE UNIQUE INDEX cargo_empleado_pkey ON public.cargo_empleado USING btree (id);

CREATE UNIQUE INDEX cargo_empleado_sync_pkey ON public.cargo_empleado_sync USING btree (id);

CREATE UNIQUE INDEX detalle_pedido_pkey ON public.detalle_pedido USING btree (id);

CREATE UNIQUE INDEX empleado_numero_identificacion_key ON public.empleado USING btree (numero_identificacion);

CREATE UNIQUE INDEX empleado_pkey ON public.empleado USING btree (id);

CREATE UNIQUE INDEX empleado_sync_pkey ON public.empleado_sync USING btree (id);

CREATE UNIQUE INDEX empresa_cliente_nit_key ON public.empresa_cliente USING btree (nit);

CREATE UNIQUE INDEX empresa_cliente_pkey ON public.empresa_cliente USING btree (id);

CREATE UNIQUE INDEX empresa_pkey ON public.empresa USING btree (id);

CREATE UNIQUE INDEX empresa_sync_pkey ON public.empresa_sync USING btree (id);

CREATE UNIQUE INDEX entrega_pedido_servicio_id_key ON public.entrega USING btree (pedido_servicio_id);

CREATE UNIQUE INDEX entrega_pkey ON public.entrega USING btree (id);

CREATE UNIQUE INDEX entregado_por_empleado_pkey ON public.entregado_por_empleado USING btree (id);

CREATE UNIQUE INDEX evaluacion_empleado_pkey ON public.evaluacion_empleado USING btree (id);

CREATE UNIQUE INDEX factura_pedido_servicio_id_key ON public.factura USING btree (pedido_servicio_id);

CREATE UNIQUE INDEX factura_pkey ON public.factura USING btree (id);

CREATE UNIQUE INDEX mantenimiento_maquina_pkey ON public.mantenimiento_maquina USING btree (id);

CREATE UNIQUE INDEX maquina_pkey ON public.maquina USING btree (id);

CREATE UNIQUE INDEX materia_prima_recibida_pkey ON public.materia_prima_recibida USING btree (id);

CREATE UNIQUE INDEX orden_produccion_pkey ON public.orden_produccion USING btree (id);

CREATE UNIQUE INDEX pago_factura_id_key ON public.pago USING btree (factura_id);

CREATE UNIQUE INDEX pago_pkey ON public.pago USING btree (id);

CREATE UNIQUE INDEX paso_produccion_pkey ON public.paso_produccion USING btree (id);

CREATE UNIQUE INDEX paso_produccion_sync_pkey ON public.paso_produccion_sync USING btree (id);

CREATE UNIQUE INDEX pedido_servicio_pkey ON public.pedido_servicio USING btree (id);

CREATE UNIQUE INDEX permiso_pkey ON public.permiso USING btree (id);

CREATE UNIQUE INDEX produccion_registro_pkey ON public.produccion_registro USING btree (id);

CREATE UNIQUE INDEX produccion_registro_sync_pkey ON public.produccion_registro_sync USING btree (id);

CREATE UNIQUE INDEX producto_pkey ON public.producto USING btree (id);

CREATE UNIQUE INDEX producto_sync_pkey ON public.producto_sync USING btree (id);

CREATE UNIQUE INDEX registro_aseo_entry_pkey ON public.registro_aseo_entry USING btree (id);

CREATE UNIQUE INDEX registro_aseo_entry_sync_pkey ON public.registro_aseo_entry_sync USING btree (id);

CREATE UNIQUE INDEX registro_aseo_pkey ON public.registro_aseo USING btree (id);

CREATE UNIQUE INDEX registro_aseo_sync_pkey ON public.registro_aseo_sync USING btree (id);

CREATE UNIQUE INDEX registro_pkey ON public.registro USING btree (id);

CREATE UNIQUE INDEX registro_sync_pkey ON public.registro_sync USING btree (id);

CREATE UNIQUE INDEX rol_permiso_pkey ON public.rol_permiso USING btree (rol_id, permiso_id);

CREATE UNIQUE INDEX rol_pkey ON public.rol USING btree (id);

CREATE UNIQUE INDEX tarea_aseo_pkey ON public.tarea_aseo USING btree (id);

CREATE UNIQUE INDEX tarea_aseo_sync_pkey ON public.tarea_aseo_sync USING btree (id);

CREATE UNIQUE INDEX uk_43kr6s7bts1wqfv43f7jd87kp ON public.rol USING btree (nombre);

CREATE UNIQUE INDEX uk_4rx3aiovso2tb58qkp0ru9ohd ON public.usuario USING btree (google_id);

CREATE UNIQUE INDEX uk_5171l57faosmj8myawaucatdw ON public.usuario USING btree (email);

CREATE UNIQUE INDEX uk_nwe6lkk7x7sbw94xcmbwgvycu ON public.permiso USING btree (nombre);

CREATE UNIQUE INDEX usuario_pkey ON public.usuario USING btree (id);

CREATE UNIQUE INDEX usuario_rol_pkey ON public.usuario_rol USING btree (usuario_id, rol_id);

alter table "public"."accion_aseo" add constraint "accion_aseo_pkey" PRIMARY KEY using index "accion_aseo_pkey";

alter table "public"."accion_aseo_sync" add constraint "accion_aseo_sync_pkey" PRIMARY KEY using index "accion_aseo_sync_pkey";

alter table "public"."accion_produccion" add constraint "accion_produccion_pkey" PRIMARY KEY using index "accion_produccion_pkey";

alter table "public"."accion_produccion_sync" add constraint "accion_produccion_sync_pkey" PRIMARY KEY using index "accion_produccion_sync_pkey";

alter table "public"."area_trabajo" add constraint "area_trabajo_pkey" PRIMARY KEY using index "area_trabajo_pkey";

alter table "public"."area_trabajo_sync" add constraint "area_trabajo_sync_pkey" PRIMARY KEY using index "area_trabajo_sync_pkey";

alter table "public"."asignacion_aseo" add constraint "asignacion_aseo_pkey" PRIMARY KEY using index "asignacion_aseo_pkey";

alter table "public"."cargo_empleado" add constraint "cargo_empleado_pkey" PRIMARY KEY using index "cargo_empleado_pkey";

alter table "public"."cargo_empleado_sync" add constraint "cargo_empleado_sync_pkey" PRIMARY KEY using index "cargo_empleado_sync_pkey";

alter table "public"."detalle_pedido" add constraint "detalle_pedido_pkey" PRIMARY KEY using index "detalle_pedido_pkey";

alter table "public"."empleado" add constraint "empleado_pkey" PRIMARY KEY using index "empleado_pkey";

alter table "public"."empleado_sync" add constraint "empleado_sync_pkey" PRIMARY KEY using index "empleado_sync_pkey";

alter table "public"."empresa" add constraint "empresa_pkey" PRIMARY KEY using index "empresa_pkey";

alter table "public"."empresa_cliente" add constraint "empresa_cliente_pkey" PRIMARY KEY using index "empresa_cliente_pkey";

alter table "public"."empresa_sync" add constraint "empresa_sync_pkey" PRIMARY KEY using index "empresa_sync_pkey";

alter table "public"."entrega" add constraint "entrega_pkey" PRIMARY KEY using index "entrega_pkey";

alter table "public"."entregado_por_empleado" add constraint "entregado_por_empleado_pkey" PRIMARY KEY using index "entregado_por_empleado_pkey";

alter table "public"."evaluacion_empleado" add constraint "evaluacion_empleado_pkey" PRIMARY KEY using index "evaluacion_empleado_pkey";

alter table "public"."factura" add constraint "factura_pkey" PRIMARY KEY using index "factura_pkey";

alter table "public"."mantenimiento_maquina" add constraint "mantenimiento_maquina_pkey" PRIMARY KEY using index "mantenimiento_maquina_pkey";

alter table "public"."maquina" add constraint "maquina_pkey" PRIMARY KEY using index "maquina_pkey";

alter table "public"."materia_prima_recibida" add constraint "materia_prima_recibida_pkey" PRIMARY KEY using index "materia_prima_recibida_pkey";

alter table "public"."orden_produccion" add constraint "orden_produccion_pkey" PRIMARY KEY using index "orden_produccion_pkey";

alter table "public"."pago" add constraint "pago_pkey" PRIMARY KEY using index "pago_pkey";

alter table "public"."paso_produccion" add constraint "paso_produccion_pkey" PRIMARY KEY using index "paso_produccion_pkey";

alter table "public"."paso_produccion_sync" add constraint "paso_produccion_sync_pkey" PRIMARY KEY using index "paso_produccion_sync_pkey";

alter table "public"."pedido_servicio" add constraint "pedido_servicio_pkey" PRIMARY KEY using index "pedido_servicio_pkey";

alter table "public"."permiso" add constraint "permiso_pkey" PRIMARY KEY using index "permiso_pkey";

alter table "public"."produccion_registro" add constraint "produccion_registro_pkey" PRIMARY KEY using index "produccion_registro_pkey";

alter table "public"."produccion_registro_sync" add constraint "produccion_registro_sync_pkey" PRIMARY KEY using index "produccion_registro_sync_pkey";

alter table "public"."producto" add constraint "producto_pkey" PRIMARY KEY using index "producto_pkey";

alter table "public"."producto_sync" add constraint "producto_sync_pkey" PRIMARY KEY using index "producto_sync_pkey";

alter table "public"."registro" add constraint "registro_pkey" PRIMARY KEY using index "registro_pkey";

alter table "public"."registro_aseo" add constraint "registro_aseo_pkey" PRIMARY KEY using index "registro_aseo_pkey";

alter table "public"."registro_aseo_entry" add constraint "registro_aseo_entry_pkey" PRIMARY KEY using index "registro_aseo_entry_pkey";

alter table "public"."registro_aseo_entry_sync" add constraint "registro_aseo_entry_sync_pkey" PRIMARY KEY using index "registro_aseo_entry_sync_pkey";

alter table "public"."registro_aseo_sync" add constraint "registro_aseo_sync_pkey" PRIMARY KEY using index "registro_aseo_sync_pkey";

alter table "public"."registro_sync" add constraint "registro_sync_pkey" PRIMARY KEY using index "registro_sync_pkey";

alter table "public"."rol" add constraint "rol_pkey" PRIMARY KEY using index "rol_pkey";

alter table "public"."rol_permiso" add constraint "rol_permiso_pkey" PRIMARY KEY using index "rol_permiso_pkey";

alter table "public"."tarea_aseo" add constraint "tarea_aseo_pkey" PRIMARY KEY using index "tarea_aseo_pkey";

alter table "public"."tarea_aseo_sync" add constraint "tarea_aseo_sync_pkey" PRIMARY KEY using index "tarea_aseo_sync_pkey";

alter table "public"."usuario" add constraint "usuario_pkey" PRIMARY KEY using index "usuario_pkey";

alter table "public"."usuario_rol" add constraint "usuario_rol_pkey" PRIMARY KEY using index "usuario_rol_pkey";

alter table "public"."asignacion_aseo" add constraint "asignacion_aseo_turno_check" CHECK (((turno)::text = ANY ((ARRAY['MAÑANA'::character varying, 'TARDE'::character varying, 'NOCHE'::character varying])::text[]))) not valid;

alter table "public"."asignacion_aseo" validate constraint "asignacion_aseo_turno_check";

alter table "public"."asignacion_aseo" add constraint "fkscot03p324sfh3f5huliqrsv6" FOREIGN KEY (empleado_id) REFERENCES public.empleado(id) not valid;

alter table "public"."asignacion_aseo" validate constraint "fkscot03p324sfh3f5huliqrsv6";

alter table "public"."asignacion_aseo" add constraint "fksmk8ngv0rwhjyqyrcegjffj3m" FOREIGN KEY (area_trabajo_id) REFERENCES public.area_trabajo(id) not valid;

alter table "public"."asignacion_aseo" validate constraint "fksmk8ngv0rwhjyqyrcegjffj3m";

alter table "public"."detalle_pedido" add constraint "fk5a0p6hxvsfw6pq71o2f624b9a" FOREIGN KEY (pedido_servicio_id) REFERENCES public.pedido_servicio(id) not valid;

alter table "public"."detalle_pedido" validate constraint "fk5a0p6hxvsfw6pq71o2f624b9a";

alter table "public"."empleado" add constraint "empleado_cargo_check" CHECK (((cargo)::text = ANY ((ARRAY['CONFECCIONISTA'::character varying, 'CORTADOR'::character varying, 'SUPERVISOR'::character varying, 'JEFE_PRODUCCION'::character varying, 'JEFE_ALMACEN'::character varying, 'ASISTENTE'::character varying, 'ADMINISTRADOR'::character varying])::text[]))) not valid;

alter table "public"."empleado" validate constraint "empleado_cargo_check";

alter table "public"."empleado" add constraint "empleado_numero_identificacion_key" UNIQUE using index "empleado_numero_identificacion_key";

alter table "public"."empleado" add constraint "empleado_turno_check" CHECK (((turno)::text = ANY ((ARRAY['MAÑANA'::character varying, 'TARDE'::character varying, 'NOCHE'::character varying])::text[]))) not valid;

alter table "public"."empleado" validate constraint "empleado_turno_check";

alter table "public"."empresa_cliente" add constraint "empresa_cliente_nit_key" UNIQUE using index "empresa_cliente_nit_key";

alter table "public"."entrega" add constraint "entrega_estado_check" CHECK (((estado)::text = ANY ((ARRAY['PENDIENTE'::character varying, 'EN_PROCESO'::character varying, 'COMPLETADO'::character varying, 'CANCELADO'::character varying, 'ENTREGADO'::character varying])::text[]))) not valid;

alter table "public"."entrega" validate constraint "entrega_estado_check";

alter table "public"."entrega" add constraint "entrega_pedido_servicio_id_key" UNIQUE using index "entrega_pedido_servicio_id_key";

alter table "public"."entrega" add constraint "fknvfe5nkrkj10ix4raqpr7bmdy" FOREIGN KEY (pedido_servicio_id) REFERENCES public.pedido_servicio(id) not valid;

alter table "public"."entrega" validate constraint "fknvfe5nkrkj10ix4raqpr7bmdy";

alter table "public"."entregado_por_empleado" add constraint "fk1rrl2l8x69opr4tvc2bvfow6v" FOREIGN KEY (entrega_id) REFERENCES public.entrega(id) not valid;

alter table "public"."entregado_por_empleado" validate constraint "fk1rrl2l8x69opr4tvc2bvfow6v";

alter table "public"."entregado_por_empleado" add constraint "fklwym9ak475tha0gt0jxftu6o2" FOREIGN KEY (empleado_id) REFERENCES public.empleado(id) not valid;

alter table "public"."entregado_por_empleado" validate constraint "fklwym9ak475tha0gt0jxftu6o2";

alter table "public"."evaluacion_empleado" add constraint "fk7is3n9h1r7etoanxwxwyjhns" FOREIGN KEY (empleado_id) REFERENCES public.empleado(id) not valid;

alter table "public"."evaluacion_empleado" validate constraint "fk7is3n9h1r7etoanxwxwyjhns";

alter table "public"."factura" add constraint "factura_estado_check" CHECK (((estado)::text = ANY ((ARRAY['PENDIENTE'::character varying, 'EN_PROCESO'::character varying, 'COMPLETADO'::character varying, 'CANCELADO'::character varying, 'ENTREGADO'::character varying])::text[]))) not valid;

alter table "public"."factura" validate constraint "factura_estado_check";

alter table "public"."factura" add constraint "factura_pedido_servicio_id_key" UNIQUE using index "factura_pedido_servicio_id_key";

alter table "public"."factura" add constraint "fk11u4vmxr1143nhb7u1flo92qc" FOREIGN KEY (empresa_cliente_id) REFERENCES public.empresa_cliente(id) not valid;

alter table "public"."factura" validate constraint "fk11u4vmxr1143nhb7u1flo92qc";

alter table "public"."factura" add constraint "fkpejamwvpyd66m8415m22yc1r9" FOREIGN KEY (pedido_servicio_id) REFERENCES public.pedido_servicio(id) not valid;

alter table "public"."factura" validate constraint "fkpejamwvpyd66m8415m22yc1r9";

alter table "public"."mantenimiento_maquina" add constraint "fka9gdcdvprunv2ot5jsx7vhb80" FOREIGN KEY (maquina_id) REFERENCES public.maquina(id) not valid;

alter table "public"."mantenimiento_maquina" validate constraint "fka9gdcdvprunv2ot5jsx7vhb80";

alter table "public"."mantenimiento_maquina" add constraint "mantenimiento_maquina_tipo_mantenimiento_check" CHECK (((tipo_mantenimiento)::text = ANY ((ARRAY['PREVENTIVO'::character varying, 'CORRECTIVO'::character varying])::text[]))) not valid;

alter table "public"."mantenimiento_maquina" validate constraint "mantenimiento_maquina_tipo_mantenimiento_check";

alter table "public"."maquina" add constraint "fkdd5t0jd4k0ks06brtlhdc4hjd" FOREIGN KEY (area_trabajo_id) REFERENCES public.area_trabajo(id) not valid;

alter table "public"."maquina" validate constraint "fkdd5t0jd4k0ks06brtlhdc4hjd";

alter table "public"."maquina" add constraint "maquina_tipo_maquina_check" CHECK (((tipo_maquina)::text = ANY ((ARRAY['OVERLOCK'::character varying, 'RECTA'::character varying, 'COLLARETERA'::character varying, 'REMALLADORA'::character varying, 'BORDADORA'::character varying, 'OTRA'::character varying])::text[]))) not valid;

alter table "public"."maquina" validate constraint "maquina_tipo_maquina_check";

alter table "public"."materia_prima_recibida" add constraint "fkofv21a0q7r34yxkrh672vpkr1" FOREIGN KEY (empresa_cliente_id) REFERENCES public.empresa_cliente(id) not valid;

alter table "public"."materia_prima_recibida" validate constraint "fkofv21a0q7r34yxkrh672vpkr1";

alter table "public"."materia_prima_recibida" add constraint "materia_prima_recibida_tipo_material_check" CHECK (((tipo_material)::text = ANY ((ARRAY['TELA'::character varying, 'HILO'::character varying, 'BOTONES'::character varying, 'CIERRES'::character varying, 'ETIQUETAS'::character varying, 'RELLENO'::character varying, 'OTROS'::character varying])::text[]))) not valid;

alter table "public"."materia_prima_recibida" validate constraint "materia_prima_recibida_tipo_material_check";

alter table "public"."orden_produccion" add constraint "fk24lfym699p7vm9ku9ux10f7q9" FOREIGN KEY (pedido_servicio_id) REFERENCES public.pedido_servicio(id) not valid;

alter table "public"."orden_produccion" validate constraint "fk24lfym699p7vm9ku9ux10f7q9";

alter table "public"."orden_produccion" add constraint "fkrhkw3q1hc6skpga8yxvwrowwq" FOREIGN KEY (area_trabajo_id) REFERENCES public.area_trabajo(id) not valid;

alter table "public"."orden_produccion" validate constraint "fkrhkw3q1hc6skpga8yxvwrowwq";

alter table "public"."orden_produccion" add constraint "orden_produccion_estado_check" CHECK (((estado)::text = ANY ((ARRAY['PENDIENTE'::character varying, 'EN_PROCESO'::character varying, 'COMPLETADO'::character varying, 'CANCELADO'::character varying, 'ENTREGADO'::character varying])::text[]))) not valid;

alter table "public"."orden_produccion" validate constraint "orden_produccion_estado_check";

alter table "public"."pago" add constraint "fkrtu0je6xnvrvwuflslyslq2eo" FOREIGN KEY (factura_id) REFERENCES public.factura(id) not valid;

alter table "public"."pago" validate constraint "fkrtu0je6xnvrvwuflslyslq2eo";

alter table "public"."pago" add constraint "pago_factura_id_key" UNIQUE using index "pago_factura_id_key";

alter table "public"."pago" add constraint "pago_metodo_pago_check" CHECK (((metodo_pago)::text = ANY ((ARRAY['EFECTIVO'::character varying, 'TRANSFERENCIA'::character varying, 'CHEQUE'::character varying, 'TARJETA'::character varying])::text[]))) not valid;

alter table "public"."pago" validate constraint "pago_metodo_pago_check";

alter table "public"."paso_produccion" add constraint "fknqsijx9lpwe4lihtf6t9d43ad" FOREIGN KEY (producto_id) REFERENCES public.producto(id) not valid;

alter table "public"."paso_produccion" validate constraint "fknqsijx9lpwe4lihtf6t9d43ad";

alter table "public"."paso_produccion_sync" add constraint "fkb7adccmf5pan9blp53pichkq0" FOREIGN KEY (producto_sync_id) REFERENCES public.producto_sync(id) not valid;

alter table "public"."paso_produccion_sync" validate constraint "fkb7adccmf5pan9blp53pichkq0";

alter table "public"."pedido_servicio" add constraint "fk27o0yf6lmawnu5aak1ensr02r" FOREIGN KEY (empresa_cliente_id) REFERENCES public.empresa_cliente(id) not valid;

alter table "public"."pedido_servicio" validate constraint "fk27o0yf6lmawnu5aak1ensr02r";

alter table "public"."pedido_servicio" add constraint "pedido_servicio_estado_check" CHECK (((estado)::text = ANY ((ARRAY['PENDIENTE'::character varying, 'EN_PROCESO'::character varying, 'COMPLETADO'::character varying, 'CANCELADO'::character varying, 'ENTREGADO'::character varying])::text[]))) not valid;

alter table "public"."pedido_servicio" validate constraint "pedido_servicio_estado_check";

alter table "public"."pedido_servicio" add constraint "pedido_servicio_prioridad_check" CHECK (((prioridad)::text = ANY ((ARRAY['BAJA'::character varying, 'MEDIA'::character varying, 'ALTA'::character varying, 'URGENTE'::character varying])::text[]))) not valid;

alter table "public"."pedido_servicio" validate constraint "pedido_servicio_prioridad_check";

alter table "public"."permiso" add constraint "uk_nwe6lkk7x7sbw94xcmbwgvycu" UNIQUE using index "uk_nwe6lkk7x7sbw94xcmbwgvycu";

alter table "public"."produccion_registro" add constraint "fkfcuuw3p33rl69cw00skqnt67t" FOREIGN KEY (registro_id) REFERENCES public.registro(id) not valid;

alter table "public"."produccion_registro" validate constraint "fkfcuuw3p33rl69cw00skqnt67t";

alter table "public"."produccion_registro_sync" add constraint "fk60mwbgqv2xooblrovqbrocy4d" FOREIGN KEY (registro_sync_id) REFERENCES public.registro_sync(id) not valid;

alter table "public"."produccion_registro_sync" validate constraint "fk60mwbgqv2xooblrovqbrocy4d";

alter table "public"."producto" add constraint "producto_cantidad_check" CHECK ((cantidad >= 1)) not valid;

alter table "public"."producto" validate constraint "producto_cantidad_check";

alter table "public"."producto" add constraint "producto_ganancia_check" CHECK ((ganancia >= 0)) not valid;

alter table "public"."producto" validate constraint "producto_ganancia_check";

alter table "public"."registro_aseo_entry" add constraint "fkiqc0brsqeju6ctj2yjkrbye3d" FOREIGN KEY (registro_aseo_id) REFERENCES public.registro_aseo(id) not valid;

alter table "public"."registro_aseo_entry" validate constraint "fkiqc0brsqeju6ctj2yjkrbye3d";

alter table "public"."registro_aseo_entry_sync" add constraint "fkmgqtyjje6ahhn0cku1j97y74w" FOREIGN KEY (registro_aseo_id) REFERENCES public.registro_aseo_sync(id) not valid;

alter table "public"."registro_aseo_entry_sync" validate constraint "fkmgqtyjje6ahhn0cku1j97y74w";

alter table "public"."rol" add constraint "uk_43kr6s7bts1wqfv43f7jd87kp" UNIQUE using index "uk_43kr6s7bts1wqfv43f7jd87kp";

alter table "public"."rol_permiso" add constraint "fk6o522368i97la9m9cqn0gul2e" FOREIGN KEY (rol_id) REFERENCES public.rol(id) not valid;

alter table "public"."rol_permiso" validate constraint "fk6o522368i97la9m9cqn0gul2e";

alter table "public"."rol_permiso" add constraint "fkfyao8wd0o5tsyem1w55s3141k" FOREIGN KEY (permiso_id) REFERENCES public.permiso(id) not valid;

alter table "public"."rol_permiso" validate constraint "fkfyao8wd0o5tsyem1w55s3141k";

alter table "public"."tarea_aseo" add constraint "fkkncgwxilih371a6xfshss874j" FOREIGN KEY (asignacion_aseo_id) REFERENCES public.asignacion_aseo(id) not valid;

alter table "public"."tarea_aseo" validate constraint "fkkncgwxilih371a6xfshss874j";

alter table "public"."usuario" add constraint "uk_4rx3aiovso2tb58qkp0ru9ohd" UNIQUE using index "uk_4rx3aiovso2tb58qkp0ru9ohd";

alter table "public"."usuario" add constraint "uk_5171l57faosmj8myawaucatdw" UNIQUE using index "uk_5171l57faosmj8myawaucatdw";

alter table "public"."usuario_rol" add constraint "fk610kvhkwcqk2pxeewur4l7bd1" FOREIGN KEY (rol_id) REFERENCES public.rol(id) not valid;

alter table "public"."usuario_rol" validate constraint "fk610kvhkwcqk2pxeewur4l7bd1";

alter table "public"."usuario_rol" add constraint "fkbyfgloj439r9wr9smrms9u33r" FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) not valid;

alter table "public"."usuario_rol" validate constraint "fkbyfgloj439r9wr9smrms9u33r";

grant delete on table "public"."accion_aseo" to "anon";

grant insert on table "public"."accion_aseo" to "anon";

grant references on table "public"."accion_aseo" to "anon";

grant select on table "public"."accion_aseo" to "anon";

grant trigger on table "public"."accion_aseo" to "anon";

grant truncate on table "public"."accion_aseo" to "anon";

grant update on table "public"."accion_aseo" to "anon";

grant delete on table "public"."accion_aseo" to "authenticated";

grant insert on table "public"."accion_aseo" to "authenticated";

grant references on table "public"."accion_aseo" to "authenticated";

grant select on table "public"."accion_aseo" to "authenticated";

grant trigger on table "public"."accion_aseo" to "authenticated";

grant truncate on table "public"."accion_aseo" to "authenticated";

grant update on table "public"."accion_aseo" to "authenticated";

grant delete on table "public"."accion_aseo" to "service_role";

grant insert on table "public"."accion_aseo" to "service_role";

grant references on table "public"."accion_aseo" to "service_role";

grant select on table "public"."accion_aseo" to "service_role";

grant trigger on table "public"."accion_aseo" to "service_role";

grant truncate on table "public"."accion_aseo" to "service_role";

grant update on table "public"."accion_aseo" to "service_role";

grant delete on table "public"."accion_aseo_sync" to "anon";

grant insert on table "public"."accion_aseo_sync" to "anon";

grant references on table "public"."accion_aseo_sync" to "anon";

grant select on table "public"."accion_aseo_sync" to "anon";

grant trigger on table "public"."accion_aseo_sync" to "anon";

grant truncate on table "public"."accion_aseo_sync" to "anon";

grant update on table "public"."accion_aseo_sync" to "anon";

grant delete on table "public"."accion_aseo_sync" to "authenticated";

grant insert on table "public"."accion_aseo_sync" to "authenticated";

grant references on table "public"."accion_aseo_sync" to "authenticated";

grant select on table "public"."accion_aseo_sync" to "authenticated";

grant trigger on table "public"."accion_aseo_sync" to "authenticated";

grant truncate on table "public"."accion_aseo_sync" to "authenticated";

grant update on table "public"."accion_aseo_sync" to "authenticated";

grant delete on table "public"."accion_aseo_sync" to "service_role";

grant insert on table "public"."accion_aseo_sync" to "service_role";

grant references on table "public"."accion_aseo_sync" to "service_role";

grant select on table "public"."accion_aseo_sync" to "service_role";

grant trigger on table "public"."accion_aseo_sync" to "service_role";

grant truncate on table "public"."accion_aseo_sync" to "service_role";

grant update on table "public"."accion_aseo_sync" to "service_role";

grant delete on table "public"."accion_produccion" to "anon";

grant insert on table "public"."accion_produccion" to "anon";

grant references on table "public"."accion_produccion" to "anon";

grant select on table "public"."accion_produccion" to "anon";

grant trigger on table "public"."accion_produccion" to "anon";

grant truncate on table "public"."accion_produccion" to "anon";

grant update on table "public"."accion_produccion" to "anon";

grant delete on table "public"."accion_produccion" to "authenticated";

grant insert on table "public"."accion_produccion" to "authenticated";

grant references on table "public"."accion_produccion" to "authenticated";

grant select on table "public"."accion_produccion" to "authenticated";

grant trigger on table "public"."accion_produccion" to "authenticated";

grant truncate on table "public"."accion_produccion" to "authenticated";

grant update on table "public"."accion_produccion" to "authenticated";

grant delete on table "public"."accion_produccion" to "service_role";

grant insert on table "public"."accion_produccion" to "service_role";

grant references on table "public"."accion_produccion" to "service_role";

grant select on table "public"."accion_produccion" to "service_role";

grant trigger on table "public"."accion_produccion" to "service_role";

grant truncate on table "public"."accion_produccion" to "service_role";

grant update on table "public"."accion_produccion" to "service_role";

grant delete on table "public"."accion_produccion_sync" to "anon";

grant insert on table "public"."accion_produccion_sync" to "anon";

grant references on table "public"."accion_produccion_sync" to "anon";

grant select on table "public"."accion_produccion_sync" to "anon";

grant trigger on table "public"."accion_produccion_sync" to "anon";

grant truncate on table "public"."accion_produccion_sync" to "anon";

grant update on table "public"."accion_produccion_sync" to "anon";

grant delete on table "public"."accion_produccion_sync" to "authenticated";

grant insert on table "public"."accion_produccion_sync" to "authenticated";

grant references on table "public"."accion_produccion_sync" to "authenticated";

grant select on table "public"."accion_produccion_sync" to "authenticated";

grant trigger on table "public"."accion_produccion_sync" to "authenticated";

grant truncate on table "public"."accion_produccion_sync" to "authenticated";

grant update on table "public"."accion_produccion_sync" to "authenticated";

grant delete on table "public"."accion_produccion_sync" to "service_role";

grant insert on table "public"."accion_produccion_sync" to "service_role";

grant references on table "public"."accion_produccion_sync" to "service_role";

grant select on table "public"."accion_produccion_sync" to "service_role";

grant trigger on table "public"."accion_produccion_sync" to "service_role";

grant truncate on table "public"."accion_produccion_sync" to "service_role";

grant update on table "public"."accion_produccion_sync" to "service_role";

grant delete on table "public"."area_trabajo" to "anon";

grant insert on table "public"."area_trabajo" to "anon";

grant references on table "public"."area_trabajo" to "anon";

grant select on table "public"."area_trabajo" to "anon";

grant trigger on table "public"."area_trabajo" to "anon";

grant truncate on table "public"."area_trabajo" to "anon";

grant update on table "public"."area_trabajo" to "anon";

grant delete on table "public"."area_trabajo" to "authenticated";

grant insert on table "public"."area_trabajo" to "authenticated";

grant references on table "public"."area_trabajo" to "authenticated";

grant select on table "public"."area_trabajo" to "authenticated";

grant trigger on table "public"."area_trabajo" to "authenticated";

grant truncate on table "public"."area_trabajo" to "authenticated";

grant update on table "public"."area_trabajo" to "authenticated";

grant delete on table "public"."area_trabajo" to "service_role";

grant insert on table "public"."area_trabajo" to "service_role";

grant references on table "public"."area_trabajo" to "service_role";

grant select on table "public"."area_trabajo" to "service_role";

grant trigger on table "public"."area_trabajo" to "service_role";

grant truncate on table "public"."area_trabajo" to "service_role";

grant update on table "public"."area_trabajo" to "service_role";

grant delete on table "public"."area_trabajo_sync" to "anon";

grant insert on table "public"."area_trabajo_sync" to "anon";

grant references on table "public"."area_trabajo_sync" to "anon";

grant select on table "public"."area_trabajo_sync" to "anon";

grant trigger on table "public"."area_trabajo_sync" to "anon";

grant truncate on table "public"."area_trabajo_sync" to "anon";

grant update on table "public"."area_trabajo_sync" to "anon";

grant delete on table "public"."area_trabajo_sync" to "authenticated";

grant insert on table "public"."area_trabajo_sync" to "authenticated";

grant references on table "public"."area_trabajo_sync" to "authenticated";

grant select on table "public"."area_trabajo_sync" to "authenticated";

grant trigger on table "public"."area_trabajo_sync" to "authenticated";

grant truncate on table "public"."area_trabajo_sync" to "authenticated";

grant update on table "public"."area_trabajo_sync" to "authenticated";

grant delete on table "public"."area_trabajo_sync" to "service_role";

grant insert on table "public"."area_trabajo_sync" to "service_role";

grant references on table "public"."area_trabajo_sync" to "service_role";

grant select on table "public"."area_trabajo_sync" to "service_role";

grant trigger on table "public"."area_trabajo_sync" to "service_role";

grant truncate on table "public"."area_trabajo_sync" to "service_role";

grant update on table "public"."area_trabajo_sync" to "service_role";

grant delete on table "public"."asignacion_aseo" to "anon";

grant insert on table "public"."asignacion_aseo" to "anon";

grant references on table "public"."asignacion_aseo" to "anon";

grant select on table "public"."asignacion_aseo" to "anon";

grant trigger on table "public"."asignacion_aseo" to "anon";

grant truncate on table "public"."asignacion_aseo" to "anon";

grant update on table "public"."asignacion_aseo" to "anon";

grant delete on table "public"."asignacion_aseo" to "authenticated";

grant insert on table "public"."asignacion_aseo" to "authenticated";

grant references on table "public"."asignacion_aseo" to "authenticated";

grant select on table "public"."asignacion_aseo" to "authenticated";

grant trigger on table "public"."asignacion_aseo" to "authenticated";

grant truncate on table "public"."asignacion_aseo" to "authenticated";

grant update on table "public"."asignacion_aseo" to "authenticated";

grant delete on table "public"."asignacion_aseo" to "service_role";

grant insert on table "public"."asignacion_aseo" to "service_role";

grant references on table "public"."asignacion_aseo" to "service_role";

grant select on table "public"."asignacion_aseo" to "service_role";

grant trigger on table "public"."asignacion_aseo" to "service_role";

grant truncate on table "public"."asignacion_aseo" to "service_role";

grant update on table "public"."asignacion_aseo" to "service_role";

grant delete on table "public"."cargo_empleado" to "anon";

grant insert on table "public"."cargo_empleado" to "anon";

grant references on table "public"."cargo_empleado" to "anon";

grant select on table "public"."cargo_empleado" to "anon";

grant trigger on table "public"."cargo_empleado" to "anon";

grant truncate on table "public"."cargo_empleado" to "anon";

grant update on table "public"."cargo_empleado" to "anon";

grant delete on table "public"."cargo_empleado" to "authenticated";

grant insert on table "public"."cargo_empleado" to "authenticated";

grant references on table "public"."cargo_empleado" to "authenticated";

grant select on table "public"."cargo_empleado" to "authenticated";

grant trigger on table "public"."cargo_empleado" to "authenticated";

grant truncate on table "public"."cargo_empleado" to "authenticated";

grant update on table "public"."cargo_empleado" to "authenticated";

grant delete on table "public"."cargo_empleado" to "service_role";

grant insert on table "public"."cargo_empleado" to "service_role";

grant references on table "public"."cargo_empleado" to "service_role";

grant select on table "public"."cargo_empleado" to "service_role";

grant trigger on table "public"."cargo_empleado" to "service_role";

grant truncate on table "public"."cargo_empleado" to "service_role";

grant update on table "public"."cargo_empleado" to "service_role";

grant delete on table "public"."cargo_empleado_sync" to "anon";

grant insert on table "public"."cargo_empleado_sync" to "anon";

grant references on table "public"."cargo_empleado_sync" to "anon";

grant select on table "public"."cargo_empleado_sync" to "anon";

grant trigger on table "public"."cargo_empleado_sync" to "anon";

grant truncate on table "public"."cargo_empleado_sync" to "anon";

grant update on table "public"."cargo_empleado_sync" to "anon";

grant delete on table "public"."cargo_empleado_sync" to "authenticated";

grant insert on table "public"."cargo_empleado_sync" to "authenticated";

grant references on table "public"."cargo_empleado_sync" to "authenticated";

grant select on table "public"."cargo_empleado_sync" to "authenticated";

grant trigger on table "public"."cargo_empleado_sync" to "authenticated";

grant truncate on table "public"."cargo_empleado_sync" to "authenticated";

grant update on table "public"."cargo_empleado_sync" to "authenticated";

grant delete on table "public"."cargo_empleado_sync" to "service_role";

grant insert on table "public"."cargo_empleado_sync" to "service_role";

grant references on table "public"."cargo_empleado_sync" to "service_role";

grant select on table "public"."cargo_empleado_sync" to "service_role";

grant trigger on table "public"."cargo_empleado_sync" to "service_role";

grant truncate on table "public"."cargo_empleado_sync" to "service_role";

grant update on table "public"."cargo_empleado_sync" to "service_role";

grant delete on table "public"."detalle_pedido" to "anon";

grant insert on table "public"."detalle_pedido" to "anon";

grant references on table "public"."detalle_pedido" to "anon";

grant select on table "public"."detalle_pedido" to "anon";

grant trigger on table "public"."detalle_pedido" to "anon";

grant truncate on table "public"."detalle_pedido" to "anon";

grant update on table "public"."detalle_pedido" to "anon";

grant delete on table "public"."detalle_pedido" to "authenticated";

grant insert on table "public"."detalle_pedido" to "authenticated";

grant references on table "public"."detalle_pedido" to "authenticated";

grant select on table "public"."detalle_pedido" to "authenticated";

grant trigger on table "public"."detalle_pedido" to "authenticated";

grant truncate on table "public"."detalle_pedido" to "authenticated";

grant update on table "public"."detalle_pedido" to "authenticated";

grant delete on table "public"."detalle_pedido" to "service_role";

grant insert on table "public"."detalle_pedido" to "service_role";

grant references on table "public"."detalle_pedido" to "service_role";

grant select on table "public"."detalle_pedido" to "service_role";

grant trigger on table "public"."detalle_pedido" to "service_role";

grant truncate on table "public"."detalle_pedido" to "service_role";

grant update on table "public"."detalle_pedido" to "service_role";

grant delete on table "public"."empleado" to "anon";

grant insert on table "public"."empleado" to "anon";

grant references on table "public"."empleado" to "anon";

grant select on table "public"."empleado" to "anon";

grant trigger on table "public"."empleado" to "anon";

grant truncate on table "public"."empleado" to "anon";

grant update on table "public"."empleado" to "anon";

grant delete on table "public"."empleado" to "authenticated";

grant insert on table "public"."empleado" to "authenticated";

grant references on table "public"."empleado" to "authenticated";

grant select on table "public"."empleado" to "authenticated";

grant trigger on table "public"."empleado" to "authenticated";

grant truncate on table "public"."empleado" to "authenticated";

grant update on table "public"."empleado" to "authenticated";

grant delete on table "public"."empleado" to "service_role";

grant insert on table "public"."empleado" to "service_role";

grant references on table "public"."empleado" to "service_role";

grant select on table "public"."empleado" to "service_role";

grant trigger on table "public"."empleado" to "service_role";

grant truncate on table "public"."empleado" to "service_role";

grant update on table "public"."empleado" to "service_role";

grant delete on table "public"."empleado_sync" to "anon";

grant insert on table "public"."empleado_sync" to "anon";

grant references on table "public"."empleado_sync" to "anon";

grant select on table "public"."empleado_sync" to "anon";

grant trigger on table "public"."empleado_sync" to "anon";

grant truncate on table "public"."empleado_sync" to "anon";

grant update on table "public"."empleado_sync" to "anon";

grant delete on table "public"."empleado_sync" to "authenticated";

grant insert on table "public"."empleado_sync" to "authenticated";

grant references on table "public"."empleado_sync" to "authenticated";

grant select on table "public"."empleado_sync" to "authenticated";

grant trigger on table "public"."empleado_sync" to "authenticated";

grant truncate on table "public"."empleado_sync" to "authenticated";

grant update on table "public"."empleado_sync" to "authenticated";

grant delete on table "public"."empleado_sync" to "service_role";

grant insert on table "public"."empleado_sync" to "service_role";

grant references on table "public"."empleado_sync" to "service_role";

grant select on table "public"."empleado_sync" to "service_role";

grant trigger on table "public"."empleado_sync" to "service_role";

grant truncate on table "public"."empleado_sync" to "service_role";

grant update on table "public"."empleado_sync" to "service_role";

grant delete on table "public"."empresa" to "anon";

grant insert on table "public"."empresa" to "anon";

grant references on table "public"."empresa" to "anon";

grant select on table "public"."empresa" to "anon";

grant trigger on table "public"."empresa" to "anon";

grant truncate on table "public"."empresa" to "anon";

grant update on table "public"."empresa" to "anon";

grant delete on table "public"."empresa" to "authenticated";

grant insert on table "public"."empresa" to "authenticated";

grant references on table "public"."empresa" to "authenticated";

grant select on table "public"."empresa" to "authenticated";

grant trigger on table "public"."empresa" to "authenticated";

grant truncate on table "public"."empresa" to "authenticated";

grant update on table "public"."empresa" to "authenticated";

grant delete on table "public"."empresa" to "service_role";

grant insert on table "public"."empresa" to "service_role";

grant references on table "public"."empresa" to "service_role";

grant select on table "public"."empresa" to "service_role";

grant trigger on table "public"."empresa" to "service_role";

grant truncate on table "public"."empresa" to "service_role";

grant update on table "public"."empresa" to "service_role";

grant delete on table "public"."empresa_cliente" to "anon";

grant insert on table "public"."empresa_cliente" to "anon";

grant references on table "public"."empresa_cliente" to "anon";

grant select on table "public"."empresa_cliente" to "anon";

grant trigger on table "public"."empresa_cliente" to "anon";

grant truncate on table "public"."empresa_cliente" to "anon";

grant update on table "public"."empresa_cliente" to "anon";

grant delete on table "public"."empresa_cliente" to "authenticated";

grant insert on table "public"."empresa_cliente" to "authenticated";

grant references on table "public"."empresa_cliente" to "authenticated";

grant select on table "public"."empresa_cliente" to "authenticated";

grant trigger on table "public"."empresa_cliente" to "authenticated";

grant truncate on table "public"."empresa_cliente" to "authenticated";

grant update on table "public"."empresa_cliente" to "authenticated";

grant delete on table "public"."empresa_cliente" to "service_role";

grant insert on table "public"."empresa_cliente" to "service_role";

grant references on table "public"."empresa_cliente" to "service_role";

grant select on table "public"."empresa_cliente" to "service_role";

grant trigger on table "public"."empresa_cliente" to "service_role";

grant truncate on table "public"."empresa_cliente" to "service_role";

grant update on table "public"."empresa_cliente" to "service_role";

grant delete on table "public"."empresa_sync" to "anon";

grant insert on table "public"."empresa_sync" to "anon";

grant references on table "public"."empresa_sync" to "anon";

grant select on table "public"."empresa_sync" to "anon";

grant trigger on table "public"."empresa_sync" to "anon";

grant truncate on table "public"."empresa_sync" to "anon";

grant update on table "public"."empresa_sync" to "anon";

grant delete on table "public"."empresa_sync" to "authenticated";

grant insert on table "public"."empresa_sync" to "authenticated";

grant references on table "public"."empresa_sync" to "authenticated";

grant select on table "public"."empresa_sync" to "authenticated";

grant trigger on table "public"."empresa_sync" to "authenticated";

grant truncate on table "public"."empresa_sync" to "authenticated";

grant update on table "public"."empresa_sync" to "authenticated";

grant delete on table "public"."empresa_sync" to "service_role";

grant insert on table "public"."empresa_sync" to "service_role";

grant references on table "public"."empresa_sync" to "service_role";

grant select on table "public"."empresa_sync" to "service_role";

grant trigger on table "public"."empresa_sync" to "service_role";

grant truncate on table "public"."empresa_sync" to "service_role";

grant update on table "public"."empresa_sync" to "service_role";

grant delete on table "public"."entrega" to "anon";

grant insert on table "public"."entrega" to "anon";

grant references on table "public"."entrega" to "anon";

grant select on table "public"."entrega" to "anon";

grant trigger on table "public"."entrega" to "anon";

grant truncate on table "public"."entrega" to "anon";

grant update on table "public"."entrega" to "anon";

grant delete on table "public"."entrega" to "authenticated";

grant insert on table "public"."entrega" to "authenticated";

grant references on table "public"."entrega" to "authenticated";

grant select on table "public"."entrega" to "authenticated";

grant trigger on table "public"."entrega" to "authenticated";

grant truncate on table "public"."entrega" to "authenticated";

grant update on table "public"."entrega" to "authenticated";

grant delete on table "public"."entrega" to "service_role";

grant insert on table "public"."entrega" to "service_role";

grant references on table "public"."entrega" to "service_role";

grant select on table "public"."entrega" to "service_role";

grant trigger on table "public"."entrega" to "service_role";

grant truncate on table "public"."entrega" to "service_role";

grant update on table "public"."entrega" to "service_role";

grant delete on table "public"."entregado_por_empleado" to "anon";

grant insert on table "public"."entregado_por_empleado" to "anon";

grant references on table "public"."entregado_por_empleado" to "anon";

grant select on table "public"."entregado_por_empleado" to "anon";

grant trigger on table "public"."entregado_por_empleado" to "anon";

grant truncate on table "public"."entregado_por_empleado" to "anon";

grant update on table "public"."entregado_por_empleado" to "anon";

grant delete on table "public"."entregado_por_empleado" to "authenticated";

grant insert on table "public"."entregado_por_empleado" to "authenticated";

grant references on table "public"."entregado_por_empleado" to "authenticated";

grant select on table "public"."entregado_por_empleado" to "authenticated";

grant trigger on table "public"."entregado_por_empleado" to "authenticated";

grant truncate on table "public"."entregado_por_empleado" to "authenticated";

grant update on table "public"."entregado_por_empleado" to "authenticated";

grant delete on table "public"."entregado_por_empleado" to "service_role";

grant insert on table "public"."entregado_por_empleado" to "service_role";

grant references on table "public"."entregado_por_empleado" to "service_role";

grant select on table "public"."entregado_por_empleado" to "service_role";

grant trigger on table "public"."entregado_por_empleado" to "service_role";

grant truncate on table "public"."entregado_por_empleado" to "service_role";

grant update on table "public"."entregado_por_empleado" to "service_role";

grant delete on table "public"."evaluacion_empleado" to "anon";

grant insert on table "public"."evaluacion_empleado" to "anon";

grant references on table "public"."evaluacion_empleado" to "anon";

grant select on table "public"."evaluacion_empleado" to "anon";

grant trigger on table "public"."evaluacion_empleado" to "anon";

grant truncate on table "public"."evaluacion_empleado" to "anon";

grant update on table "public"."evaluacion_empleado" to "anon";

grant delete on table "public"."evaluacion_empleado" to "authenticated";

grant insert on table "public"."evaluacion_empleado" to "authenticated";

grant references on table "public"."evaluacion_empleado" to "authenticated";

grant select on table "public"."evaluacion_empleado" to "authenticated";

grant trigger on table "public"."evaluacion_empleado" to "authenticated";

grant truncate on table "public"."evaluacion_empleado" to "authenticated";

grant update on table "public"."evaluacion_empleado" to "authenticated";

grant delete on table "public"."evaluacion_empleado" to "service_role";

grant insert on table "public"."evaluacion_empleado" to "service_role";

grant references on table "public"."evaluacion_empleado" to "service_role";

grant select on table "public"."evaluacion_empleado" to "service_role";

grant trigger on table "public"."evaluacion_empleado" to "service_role";

grant truncate on table "public"."evaluacion_empleado" to "service_role";

grant update on table "public"."evaluacion_empleado" to "service_role";

grant delete on table "public"."factura" to "anon";

grant insert on table "public"."factura" to "anon";

grant references on table "public"."factura" to "anon";

grant select on table "public"."factura" to "anon";

grant trigger on table "public"."factura" to "anon";

grant truncate on table "public"."factura" to "anon";

grant update on table "public"."factura" to "anon";

grant delete on table "public"."factura" to "authenticated";

grant insert on table "public"."factura" to "authenticated";

grant references on table "public"."factura" to "authenticated";

grant select on table "public"."factura" to "authenticated";

grant trigger on table "public"."factura" to "authenticated";

grant truncate on table "public"."factura" to "authenticated";

grant update on table "public"."factura" to "authenticated";

grant delete on table "public"."factura" to "service_role";

grant insert on table "public"."factura" to "service_role";

grant references on table "public"."factura" to "service_role";

grant select on table "public"."factura" to "service_role";

grant trigger on table "public"."factura" to "service_role";

grant truncate on table "public"."factura" to "service_role";

grant update on table "public"."factura" to "service_role";

grant delete on table "public"."mantenimiento_maquina" to "anon";

grant insert on table "public"."mantenimiento_maquina" to "anon";

grant references on table "public"."mantenimiento_maquina" to "anon";

grant select on table "public"."mantenimiento_maquina" to "anon";

grant trigger on table "public"."mantenimiento_maquina" to "anon";

grant truncate on table "public"."mantenimiento_maquina" to "anon";

grant update on table "public"."mantenimiento_maquina" to "anon";

grant delete on table "public"."mantenimiento_maquina" to "authenticated";

grant insert on table "public"."mantenimiento_maquina" to "authenticated";

grant references on table "public"."mantenimiento_maquina" to "authenticated";

grant select on table "public"."mantenimiento_maquina" to "authenticated";

grant trigger on table "public"."mantenimiento_maquina" to "authenticated";

grant truncate on table "public"."mantenimiento_maquina" to "authenticated";

grant update on table "public"."mantenimiento_maquina" to "authenticated";

grant delete on table "public"."mantenimiento_maquina" to "service_role";

grant insert on table "public"."mantenimiento_maquina" to "service_role";

grant references on table "public"."mantenimiento_maquina" to "service_role";

grant select on table "public"."mantenimiento_maquina" to "service_role";

grant trigger on table "public"."mantenimiento_maquina" to "service_role";

grant truncate on table "public"."mantenimiento_maquina" to "service_role";

grant update on table "public"."mantenimiento_maquina" to "service_role";

grant delete on table "public"."maquina" to "anon";

grant insert on table "public"."maquina" to "anon";

grant references on table "public"."maquina" to "anon";

grant select on table "public"."maquina" to "anon";

grant trigger on table "public"."maquina" to "anon";

grant truncate on table "public"."maquina" to "anon";

grant update on table "public"."maquina" to "anon";

grant delete on table "public"."maquina" to "authenticated";

grant insert on table "public"."maquina" to "authenticated";

grant references on table "public"."maquina" to "authenticated";

grant select on table "public"."maquina" to "authenticated";

grant trigger on table "public"."maquina" to "authenticated";

grant truncate on table "public"."maquina" to "authenticated";

grant update on table "public"."maquina" to "authenticated";

grant delete on table "public"."maquina" to "service_role";

grant insert on table "public"."maquina" to "service_role";

grant references on table "public"."maquina" to "service_role";

grant select on table "public"."maquina" to "service_role";

grant trigger on table "public"."maquina" to "service_role";

grant truncate on table "public"."maquina" to "service_role";

grant update on table "public"."maquina" to "service_role";

grant delete on table "public"."materia_prima_recibida" to "anon";

grant insert on table "public"."materia_prima_recibida" to "anon";

grant references on table "public"."materia_prima_recibida" to "anon";

grant select on table "public"."materia_prima_recibida" to "anon";

grant trigger on table "public"."materia_prima_recibida" to "anon";

grant truncate on table "public"."materia_prima_recibida" to "anon";

grant update on table "public"."materia_prima_recibida" to "anon";

grant delete on table "public"."materia_prima_recibida" to "authenticated";

grant insert on table "public"."materia_prima_recibida" to "authenticated";

grant references on table "public"."materia_prima_recibida" to "authenticated";

grant select on table "public"."materia_prima_recibida" to "authenticated";

grant trigger on table "public"."materia_prima_recibida" to "authenticated";

grant truncate on table "public"."materia_prima_recibida" to "authenticated";

grant update on table "public"."materia_prima_recibida" to "authenticated";

grant delete on table "public"."materia_prima_recibida" to "service_role";

grant insert on table "public"."materia_prima_recibida" to "service_role";

grant references on table "public"."materia_prima_recibida" to "service_role";

grant select on table "public"."materia_prima_recibida" to "service_role";

grant trigger on table "public"."materia_prima_recibida" to "service_role";

grant truncate on table "public"."materia_prima_recibida" to "service_role";

grant update on table "public"."materia_prima_recibida" to "service_role";

grant delete on table "public"."orden_produccion" to "anon";

grant insert on table "public"."orden_produccion" to "anon";

grant references on table "public"."orden_produccion" to "anon";

grant select on table "public"."orden_produccion" to "anon";

grant trigger on table "public"."orden_produccion" to "anon";

grant truncate on table "public"."orden_produccion" to "anon";

grant update on table "public"."orden_produccion" to "anon";

grant delete on table "public"."orden_produccion" to "authenticated";

grant insert on table "public"."orden_produccion" to "authenticated";

grant references on table "public"."orden_produccion" to "authenticated";

grant select on table "public"."orden_produccion" to "authenticated";

grant trigger on table "public"."orden_produccion" to "authenticated";

grant truncate on table "public"."orden_produccion" to "authenticated";

grant update on table "public"."orden_produccion" to "authenticated";

grant delete on table "public"."orden_produccion" to "service_role";

grant insert on table "public"."orden_produccion" to "service_role";

grant references on table "public"."orden_produccion" to "service_role";

grant select on table "public"."orden_produccion" to "service_role";

grant trigger on table "public"."orden_produccion" to "service_role";

grant truncate on table "public"."orden_produccion" to "service_role";

grant update on table "public"."orden_produccion" to "service_role";

grant delete on table "public"."pago" to "anon";

grant insert on table "public"."pago" to "anon";

grant references on table "public"."pago" to "anon";

grant select on table "public"."pago" to "anon";

grant trigger on table "public"."pago" to "anon";

grant truncate on table "public"."pago" to "anon";

grant update on table "public"."pago" to "anon";

grant delete on table "public"."pago" to "authenticated";

grant insert on table "public"."pago" to "authenticated";

grant references on table "public"."pago" to "authenticated";

grant select on table "public"."pago" to "authenticated";

grant trigger on table "public"."pago" to "authenticated";

grant truncate on table "public"."pago" to "authenticated";

grant update on table "public"."pago" to "authenticated";

grant delete on table "public"."pago" to "service_role";

grant insert on table "public"."pago" to "service_role";

grant references on table "public"."pago" to "service_role";

grant select on table "public"."pago" to "service_role";

grant trigger on table "public"."pago" to "service_role";

grant truncate on table "public"."pago" to "service_role";

grant update on table "public"."pago" to "service_role";

grant delete on table "public"."paso_produccion" to "anon";

grant insert on table "public"."paso_produccion" to "anon";

grant references on table "public"."paso_produccion" to "anon";

grant select on table "public"."paso_produccion" to "anon";

grant trigger on table "public"."paso_produccion" to "anon";

grant truncate on table "public"."paso_produccion" to "anon";

grant update on table "public"."paso_produccion" to "anon";

grant delete on table "public"."paso_produccion" to "authenticated";

grant insert on table "public"."paso_produccion" to "authenticated";

grant references on table "public"."paso_produccion" to "authenticated";

grant select on table "public"."paso_produccion" to "authenticated";

grant trigger on table "public"."paso_produccion" to "authenticated";

grant truncate on table "public"."paso_produccion" to "authenticated";

grant update on table "public"."paso_produccion" to "authenticated";

grant delete on table "public"."paso_produccion" to "service_role";

grant insert on table "public"."paso_produccion" to "service_role";

grant references on table "public"."paso_produccion" to "service_role";

grant select on table "public"."paso_produccion" to "service_role";

grant trigger on table "public"."paso_produccion" to "service_role";

grant truncate on table "public"."paso_produccion" to "service_role";

grant update on table "public"."paso_produccion" to "service_role";

grant delete on table "public"."paso_produccion_sync" to "anon";

grant insert on table "public"."paso_produccion_sync" to "anon";

grant references on table "public"."paso_produccion_sync" to "anon";

grant select on table "public"."paso_produccion_sync" to "anon";

grant trigger on table "public"."paso_produccion_sync" to "anon";

grant truncate on table "public"."paso_produccion_sync" to "anon";

grant update on table "public"."paso_produccion_sync" to "anon";

grant delete on table "public"."paso_produccion_sync" to "authenticated";

grant insert on table "public"."paso_produccion_sync" to "authenticated";

grant references on table "public"."paso_produccion_sync" to "authenticated";

grant select on table "public"."paso_produccion_sync" to "authenticated";

grant trigger on table "public"."paso_produccion_sync" to "authenticated";

grant truncate on table "public"."paso_produccion_sync" to "authenticated";

grant update on table "public"."paso_produccion_sync" to "authenticated";

grant delete on table "public"."paso_produccion_sync" to "service_role";

grant insert on table "public"."paso_produccion_sync" to "service_role";

grant references on table "public"."paso_produccion_sync" to "service_role";

grant select on table "public"."paso_produccion_sync" to "service_role";

grant trigger on table "public"."paso_produccion_sync" to "service_role";

grant truncate on table "public"."paso_produccion_sync" to "service_role";

grant update on table "public"."paso_produccion_sync" to "service_role";

grant delete on table "public"."pedido_servicio" to "anon";

grant insert on table "public"."pedido_servicio" to "anon";

grant references on table "public"."pedido_servicio" to "anon";

grant select on table "public"."pedido_servicio" to "anon";

grant trigger on table "public"."pedido_servicio" to "anon";

grant truncate on table "public"."pedido_servicio" to "anon";

grant update on table "public"."pedido_servicio" to "anon";

grant delete on table "public"."pedido_servicio" to "authenticated";

grant insert on table "public"."pedido_servicio" to "authenticated";

grant references on table "public"."pedido_servicio" to "authenticated";

grant select on table "public"."pedido_servicio" to "authenticated";

grant trigger on table "public"."pedido_servicio" to "authenticated";

grant truncate on table "public"."pedido_servicio" to "authenticated";

grant update on table "public"."pedido_servicio" to "authenticated";

grant delete on table "public"."pedido_servicio" to "service_role";

grant insert on table "public"."pedido_servicio" to "service_role";

grant references on table "public"."pedido_servicio" to "service_role";

grant select on table "public"."pedido_servicio" to "service_role";

grant trigger on table "public"."pedido_servicio" to "service_role";

grant truncate on table "public"."pedido_servicio" to "service_role";

grant update on table "public"."pedido_servicio" to "service_role";

grant delete on table "public"."permiso" to "anon";

grant insert on table "public"."permiso" to "anon";

grant references on table "public"."permiso" to "anon";

grant select on table "public"."permiso" to "anon";

grant trigger on table "public"."permiso" to "anon";

grant truncate on table "public"."permiso" to "anon";

grant update on table "public"."permiso" to "anon";

grant delete on table "public"."permiso" to "authenticated";

grant insert on table "public"."permiso" to "authenticated";

grant references on table "public"."permiso" to "authenticated";

grant select on table "public"."permiso" to "authenticated";

grant trigger on table "public"."permiso" to "authenticated";

grant truncate on table "public"."permiso" to "authenticated";

grant update on table "public"."permiso" to "authenticated";

grant delete on table "public"."permiso" to "service_role";

grant insert on table "public"."permiso" to "service_role";

grant references on table "public"."permiso" to "service_role";

grant select on table "public"."permiso" to "service_role";

grant trigger on table "public"."permiso" to "service_role";

grant truncate on table "public"."permiso" to "service_role";

grant update on table "public"."permiso" to "service_role";

grant delete on table "public"."produccion_registro" to "anon";

grant insert on table "public"."produccion_registro" to "anon";

grant references on table "public"."produccion_registro" to "anon";

grant select on table "public"."produccion_registro" to "anon";

grant trigger on table "public"."produccion_registro" to "anon";

grant truncate on table "public"."produccion_registro" to "anon";

grant update on table "public"."produccion_registro" to "anon";

grant delete on table "public"."produccion_registro" to "authenticated";

grant insert on table "public"."produccion_registro" to "authenticated";

grant references on table "public"."produccion_registro" to "authenticated";

grant select on table "public"."produccion_registro" to "authenticated";

grant trigger on table "public"."produccion_registro" to "authenticated";

grant truncate on table "public"."produccion_registro" to "authenticated";

grant update on table "public"."produccion_registro" to "authenticated";

grant delete on table "public"."produccion_registro" to "service_role";

grant insert on table "public"."produccion_registro" to "service_role";

grant references on table "public"."produccion_registro" to "service_role";

grant select on table "public"."produccion_registro" to "service_role";

grant trigger on table "public"."produccion_registro" to "service_role";

grant truncate on table "public"."produccion_registro" to "service_role";

grant update on table "public"."produccion_registro" to "service_role";

grant delete on table "public"."produccion_registro_sync" to "anon";

grant insert on table "public"."produccion_registro_sync" to "anon";

grant references on table "public"."produccion_registro_sync" to "anon";

grant select on table "public"."produccion_registro_sync" to "anon";

grant trigger on table "public"."produccion_registro_sync" to "anon";

grant truncate on table "public"."produccion_registro_sync" to "anon";

grant update on table "public"."produccion_registro_sync" to "anon";

grant delete on table "public"."produccion_registro_sync" to "authenticated";

grant insert on table "public"."produccion_registro_sync" to "authenticated";

grant references on table "public"."produccion_registro_sync" to "authenticated";

grant select on table "public"."produccion_registro_sync" to "authenticated";

grant trigger on table "public"."produccion_registro_sync" to "authenticated";

grant truncate on table "public"."produccion_registro_sync" to "authenticated";

grant update on table "public"."produccion_registro_sync" to "authenticated";

grant delete on table "public"."produccion_registro_sync" to "service_role";

grant insert on table "public"."produccion_registro_sync" to "service_role";

grant references on table "public"."produccion_registro_sync" to "service_role";

grant select on table "public"."produccion_registro_sync" to "service_role";

grant trigger on table "public"."produccion_registro_sync" to "service_role";

grant truncate on table "public"."produccion_registro_sync" to "service_role";

grant update on table "public"."produccion_registro_sync" to "service_role";

grant delete on table "public"."producto" to "anon";

grant insert on table "public"."producto" to "anon";

grant references on table "public"."producto" to "anon";

grant select on table "public"."producto" to "anon";

grant trigger on table "public"."producto" to "anon";

grant truncate on table "public"."producto" to "anon";

grant update on table "public"."producto" to "anon";

grant delete on table "public"."producto" to "authenticated";

grant insert on table "public"."producto" to "authenticated";

grant references on table "public"."producto" to "authenticated";

grant select on table "public"."producto" to "authenticated";

grant trigger on table "public"."producto" to "authenticated";

grant truncate on table "public"."producto" to "authenticated";

grant update on table "public"."producto" to "authenticated";

grant delete on table "public"."producto" to "service_role";

grant insert on table "public"."producto" to "service_role";

grant references on table "public"."producto" to "service_role";

grant select on table "public"."producto" to "service_role";

grant trigger on table "public"."producto" to "service_role";

grant truncate on table "public"."producto" to "service_role";

grant update on table "public"."producto" to "service_role";

grant delete on table "public"."producto_sync" to "anon";

grant insert on table "public"."producto_sync" to "anon";

grant references on table "public"."producto_sync" to "anon";

grant select on table "public"."producto_sync" to "anon";

grant trigger on table "public"."producto_sync" to "anon";

grant truncate on table "public"."producto_sync" to "anon";

grant update on table "public"."producto_sync" to "anon";

grant delete on table "public"."producto_sync" to "authenticated";

grant insert on table "public"."producto_sync" to "authenticated";

grant references on table "public"."producto_sync" to "authenticated";

grant select on table "public"."producto_sync" to "authenticated";

grant trigger on table "public"."producto_sync" to "authenticated";

grant truncate on table "public"."producto_sync" to "authenticated";

grant update on table "public"."producto_sync" to "authenticated";

grant delete on table "public"."producto_sync" to "service_role";

grant insert on table "public"."producto_sync" to "service_role";

grant references on table "public"."producto_sync" to "service_role";

grant select on table "public"."producto_sync" to "service_role";

grant trigger on table "public"."producto_sync" to "service_role";

grant truncate on table "public"."producto_sync" to "service_role";

grant update on table "public"."producto_sync" to "service_role";

grant delete on table "public"."registro" to "anon";

grant insert on table "public"."registro" to "anon";

grant references on table "public"."registro" to "anon";

grant select on table "public"."registro" to "anon";

grant trigger on table "public"."registro" to "anon";

grant truncate on table "public"."registro" to "anon";

grant update on table "public"."registro" to "anon";

grant delete on table "public"."registro" to "authenticated";

grant insert on table "public"."registro" to "authenticated";

grant references on table "public"."registro" to "authenticated";

grant select on table "public"."registro" to "authenticated";

grant trigger on table "public"."registro" to "authenticated";

grant truncate on table "public"."registro" to "authenticated";

grant update on table "public"."registro" to "authenticated";

grant delete on table "public"."registro" to "service_role";

grant insert on table "public"."registro" to "service_role";

grant references on table "public"."registro" to "service_role";

grant select on table "public"."registro" to "service_role";

grant trigger on table "public"."registro" to "service_role";

grant truncate on table "public"."registro" to "service_role";

grant update on table "public"."registro" to "service_role";

grant delete on table "public"."registro_aseo" to "anon";

grant insert on table "public"."registro_aseo" to "anon";

grant references on table "public"."registro_aseo" to "anon";

grant select on table "public"."registro_aseo" to "anon";

grant trigger on table "public"."registro_aseo" to "anon";

grant truncate on table "public"."registro_aseo" to "anon";

grant update on table "public"."registro_aseo" to "anon";

grant delete on table "public"."registro_aseo" to "authenticated";

grant insert on table "public"."registro_aseo" to "authenticated";

grant references on table "public"."registro_aseo" to "authenticated";

grant select on table "public"."registro_aseo" to "authenticated";

grant trigger on table "public"."registro_aseo" to "authenticated";

grant truncate on table "public"."registro_aseo" to "authenticated";

grant update on table "public"."registro_aseo" to "authenticated";

grant delete on table "public"."registro_aseo" to "service_role";

grant insert on table "public"."registro_aseo" to "service_role";

grant references on table "public"."registro_aseo" to "service_role";

grant select on table "public"."registro_aseo" to "service_role";

grant trigger on table "public"."registro_aseo" to "service_role";

grant truncate on table "public"."registro_aseo" to "service_role";

grant update on table "public"."registro_aseo" to "service_role";

grant delete on table "public"."registro_aseo_entry" to "anon";

grant insert on table "public"."registro_aseo_entry" to "anon";

grant references on table "public"."registro_aseo_entry" to "anon";

grant select on table "public"."registro_aseo_entry" to "anon";

grant trigger on table "public"."registro_aseo_entry" to "anon";

grant truncate on table "public"."registro_aseo_entry" to "anon";

grant update on table "public"."registro_aseo_entry" to "anon";

grant delete on table "public"."registro_aseo_entry" to "authenticated";

grant insert on table "public"."registro_aseo_entry" to "authenticated";

grant references on table "public"."registro_aseo_entry" to "authenticated";

grant select on table "public"."registro_aseo_entry" to "authenticated";

grant trigger on table "public"."registro_aseo_entry" to "authenticated";

grant truncate on table "public"."registro_aseo_entry" to "authenticated";

grant update on table "public"."registro_aseo_entry" to "authenticated";

grant delete on table "public"."registro_aseo_entry" to "service_role";

grant insert on table "public"."registro_aseo_entry" to "service_role";

grant references on table "public"."registro_aseo_entry" to "service_role";

grant select on table "public"."registro_aseo_entry" to "service_role";

grant trigger on table "public"."registro_aseo_entry" to "service_role";

grant truncate on table "public"."registro_aseo_entry" to "service_role";

grant update on table "public"."registro_aseo_entry" to "service_role";

grant delete on table "public"."registro_aseo_entry_sync" to "anon";

grant insert on table "public"."registro_aseo_entry_sync" to "anon";

grant references on table "public"."registro_aseo_entry_sync" to "anon";

grant select on table "public"."registro_aseo_entry_sync" to "anon";

grant trigger on table "public"."registro_aseo_entry_sync" to "anon";

grant truncate on table "public"."registro_aseo_entry_sync" to "anon";

grant update on table "public"."registro_aseo_entry_sync" to "anon";

grant delete on table "public"."registro_aseo_entry_sync" to "authenticated";

grant insert on table "public"."registro_aseo_entry_sync" to "authenticated";

grant references on table "public"."registro_aseo_entry_sync" to "authenticated";

grant select on table "public"."registro_aseo_entry_sync" to "authenticated";

grant trigger on table "public"."registro_aseo_entry_sync" to "authenticated";

grant truncate on table "public"."registro_aseo_entry_sync" to "authenticated";

grant update on table "public"."registro_aseo_entry_sync" to "authenticated";

grant delete on table "public"."registro_aseo_entry_sync" to "service_role";

grant insert on table "public"."registro_aseo_entry_sync" to "service_role";

grant references on table "public"."registro_aseo_entry_sync" to "service_role";

grant select on table "public"."registro_aseo_entry_sync" to "service_role";

grant trigger on table "public"."registro_aseo_entry_sync" to "service_role";

grant truncate on table "public"."registro_aseo_entry_sync" to "service_role";

grant update on table "public"."registro_aseo_entry_sync" to "service_role";

grant delete on table "public"."registro_aseo_sync" to "anon";

grant insert on table "public"."registro_aseo_sync" to "anon";

grant references on table "public"."registro_aseo_sync" to "anon";

grant select on table "public"."registro_aseo_sync" to "anon";

grant trigger on table "public"."registro_aseo_sync" to "anon";

grant truncate on table "public"."registro_aseo_sync" to "anon";

grant update on table "public"."registro_aseo_sync" to "anon";

grant delete on table "public"."registro_aseo_sync" to "authenticated";

grant insert on table "public"."registro_aseo_sync" to "authenticated";

grant references on table "public"."registro_aseo_sync" to "authenticated";

grant select on table "public"."registro_aseo_sync" to "authenticated";

grant trigger on table "public"."registro_aseo_sync" to "authenticated";

grant truncate on table "public"."registro_aseo_sync" to "authenticated";

grant update on table "public"."registro_aseo_sync" to "authenticated";

grant delete on table "public"."registro_aseo_sync" to "service_role";

grant insert on table "public"."registro_aseo_sync" to "service_role";

grant references on table "public"."registro_aseo_sync" to "service_role";

grant select on table "public"."registro_aseo_sync" to "service_role";

grant trigger on table "public"."registro_aseo_sync" to "service_role";

grant truncate on table "public"."registro_aseo_sync" to "service_role";

grant update on table "public"."registro_aseo_sync" to "service_role";

grant delete on table "public"."registro_sync" to "anon";

grant insert on table "public"."registro_sync" to "anon";

grant references on table "public"."registro_sync" to "anon";

grant select on table "public"."registro_sync" to "anon";

grant trigger on table "public"."registro_sync" to "anon";

grant truncate on table "public"."registro_sync" to "anon";

grant update on table "public"."registro_sync" to "anon";

grant delete on table "public"."registro_sync" to "authenticated";

grant insert on table "public"."registro_sync" to "authenticated";

grant references on table "public"."registro_sync" to "authenticated";

grant select on table "public"."registro_sync" to "authenticated";

grant trigger on table "public"."registro_sync" to "authenticated";

grant truncate on table "public"."registro_sync" to "authenticated";

grant update on table "public"."registro_sync" to "authenticated";

grant delete on table "public"."registro_sync" to "service_role";

grant insert on table "public"."registro_sync" to "service_role";

grant references on table "public"."registro_sync" to "service_role";

grant select on table "public"."registro_sync" to "service_role";

grant trigger on table "public"."registro_sync" to "service_role";

grant truncate on table "public"."registro_sync" to "service_role";

grant update on table "public"."registro_sync" to "service_role";

grant delete on table "public"."rol" to "anon";

grant insert on table "public"."rol" to "anon";

grant references on table "public"."rol" to "anon";

grant select on table "public"."rol" to "anon";

grant trigger on table "public"."rol" to "anon";

grant truncate on table "public"."rol" to "anon";

grant update on table "public"."rol" to "anon";

grant delete on table "public"."rol" to "authenticated";

grant insert on table "public"."rol" to "authenticated";

grant references on table "public"."rol" to "authenticated";

grant select on table "public"."rol" to "authenticated";

grant trigger on table "public"."rol" to "authenticated";

grant truncate on table "public"."rol" to "authenticated";

grant update on table "public"."rol" to "authenticated";

grant delete on table "public"."rol" to "service_role";

grant insert on table "public"."rol" to "service_role";

grant references on table "public"."rol" to "service_role";

grant select on table "public"."rol" to "service_role";

grant trigger on table "public"."rol" to "service_role";

grant truncate on table "public"."rol" to "service_role";

grant update on table "public"."rol" to "service_role";

grant delete on table "public"."rol_permiso" to "anon";

grant insert on table "public"."rol_permiso" to "anon";

grant references on table "public"."rol_permiso" to "anon";

grant select on table "public"."rol_permiso" to "anon";

grant trigger on table "public"."rol_permiso" to "anon";

grant truncate on table "public"."rol_permiso" to "anon";

grant update on table "public"."rol_permiso" to "anon";

grant delete on table "public"."rol_permiso" to "authenticated";

grant insert on table "public"."rol_permiso" to "authenticated";

grant references on table "public"."rol_permiso" to "authenticated";

grant select on table "public"."rol_permiso" to "authenticated";

grant trigger on table "public"."rol_permiso" to "authenticated";

grant truncate on table "public"."rol_permiso" to "authenticated";

grant update on table "public"."rol_permiso" to "authenticated";

grant delete on table "public"."rol_permiso" to "service_role";

grant insert on table "public"."rol_permiso" to "service_role";

grant references on table "public"."rol_permiso" to "service_role";

grant select on table "public"."rol_permiso" to "service_role";

grant trigger on table "public"."rol_permiso" to "service_role";

grant truncate on table "public"."rol_permiso" to "service_role";

grant update on table "public"."rol_permiso" to "service_role";

grant delete on table "public"."tarea_aseo" to "anon";

grant insert on table "public"."tarea_aseo" to "anon";

grant references on table "public"."tarea_aseo" to "anon";

grant select on table "public"."tarea_aseo" to "anon";

grant trigger on table "public"."tarea_aseo" to "anon";

grant truncate on table "public"."tarea_aseo" to "anon";

grant update on table "public"."tarea_aseo" to "anon";

grant delete on table "public"."tarea_aseo" to "authenticated";

grant insert on table "public"."tarea_aseo" to "authenticated";

grant references on table "public"."tarea_aseo" to "authenticated";

grant select on table "public"."tarea_aseo" to "authenticated";

grant trigger on table "public"."tarea_aseo" to "authenticated";

grant truncate on table "public"."tarea_aseo" to "authenticated";

grant update on table "public"."tarea_aseo" to "authenticated";

grant delete on table "public"."tarea_aseo" to "service_role";

grant insert on table "public"."tarea_aseo" to "service_role";

grant references on table "public"."tarea_aseo" to "service_role";

grant select on table "public"."tarea_aseo" to "service_role";

grant trigger on table "public"."tarea_aseo" to "service_role";

grant truncate on table "public"."tarea_aseo" to "service_role";

grant update on table "public"."tarea_aseo" to "service_role";

grant delete on table "public"."tarea_aseo_sync" to "anon";

grant insert on table "public"."tarea_aseo_sync" to "anon";

grant references on table "public"."tarea_aseo_sync" to "anon";

grant select on table "public"."tarea_aseo_sync" to "anon";

grant trigger on table "public"."tarea_aseo_sync" to "anon";

grant truncate on table "public"."tarea_aseo_sync" to "anon";

grant update on table "public"."tarea_aseo_sync" to "anon";

grant delete on table "public"."tarea_aseo_sync" to "authenticated";

grant insert on table "public"."tarea_aseo_sync" to "authenticated";

grant references on table "public"."tarea_aseo_sync" to "authenticated";

grant select on table "public"."tarea_aseo_sync" to "authenticated";

grant trigger on table "public"."tarea_aseo_sync" to "authenticated";

grant truncate on table "public"."tarea_aseo_sync" to "authenticated";

grant update on table "public"."tarea_aseo_sync" to "authenticated";

grant delete on table "public"."tarea_aseo_sync" to "service_role";

grant insert on table "public"."tarea_aseo_sync" to "service_role";

grant references on table "public"."tarea_aseo_sync" to "service_role";

grant select on table "public"."tarea_aseo_sync" to "service_role";

grant trigger on table "public"."tarea_aseo_sync" to "service_role";

grant truncate on table "public"."tarea_aseo_sync" to "service_role";

grant update on table "public"."tarea_aseo_sync" to "service_role";

grant delete on table "public"."usuario" to "anon";

grant insert on table "public"."usuario" to "anon";

grant references on table "public"."usuario" to "anon";

grant select on table "public"."usuario" to "anon";

grant trigger on table "public"."usuario" to "anon";

grant truncate on table "public"."usuario" to "anon";

grant update on table "public"."usuario" to "anon";

grant delete on table "public"."usuario" to "authenticated";

grant insert on table "public"."usuario" to "authenticated";

grant references on table "public"."usuario" to "authenticated";

grant select on table "public"."usuario" to "authenticated";

grant trigger on table "public"."usuario" to "authenticated";

grant truncate on table "public"."usuario" to "authenticated";

grant update on table "public"."usuario" to "authenticated";

grant delete on table "public"."usuario" to "service_role";

grant insert on table "public"."usuario" to "service_role";

grant references on table "public"."usuario" to "service_role";

grant select on table "public"."usuario" to "service_role";

grant trigger on table "public"."usuario" to "service_role";

grant truncate on table "public"."usuario" to "service_role";

grant update on table "public"."usuario" to "service_role";

grant delete on table "public"."usuario_rol" to "anon";

grant insert on table "public"."usuario_rol" to "anon";

grant references on table "public"."usuario_rol" to "anon";

grant select on table "public"."usuario_rol" to "anon";

grant trigger on table "public"."usuario_rol" to "anon";

grant truncate on table "public"."usuario_rol" to "anon";

grant update on table "public"."usuario_rol" to "anon";

grant delete on table "public"."usuario_rol" to "authenticated";

grant insert on table "public"."usuario_rol" to "authenticated";

grant references on table "public"."usuario_rol" to "authenticated";

grant select on table "public"."usuario_rol" to "authenticated";

grant trigger on table "public"."usuario_rol" to "authenticated";

grant truncate on table "public"."usuario_rol" to "authenticated";

grant update on table "public"."usuario_rol" to "authenticated";

grant delete on table "public"."usuario_rol" to "service_role";

grant insert on table "public"."usuario_rol" to "service_role";

grant references on table "public"."usuario_rol" to "service_role";

grant select on table "public"."usuario_rol" to "service_role";

grant trigger on table "public"."usuario_rol" to "service_role";

grant truncate on table "public"."usuario_rol" to "service_role";

grant update on table "public"."usuario_rol" to "service_role";


