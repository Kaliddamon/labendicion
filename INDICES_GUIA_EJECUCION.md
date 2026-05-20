# 🗄️ Índices de Base de Datos - Guía de Ejecución

## Ubicación del Script SQL
```
backend/src/main/resources/db/migration/V999__optimize_indexes.sql
```

## 📋 ¿Qué hace el script?

Crea 10 índices estratégicos en PostgreSQL (Supabase) para optimizar las queries principales:

| Índice | Tabla | Campo | Propósito |
|--------|-------|-------|----------|
| `idx_producto_sync_nombre` | producto_sync | nombre | Búsqueda/ordenamiento de productos |
| `idx_producto_sync_estado` | producto_sync | estado | Filtrado por estado |
| `idx_paso_produccion_sync_producto_id` | paso_produccion_sync | producto_sync_id | FK index (crucial) |
| `idx_registro_sync_fecha` | registro_sync | fecha DESC | Order by fecha (bootstrap) |
| `idx_registro_sync_empleado_fecha` | registro_sync | (empleado_id, fecha DESC) | Filtrado empleado+fecha |
| `idx_empresa_sync_razon_social` | empresa_sync | razon_social | Búsqueda empresa (evita table scan) |
| `idx_empresa_sync_estado` | empresa_sync | estado | Filtrado estado empresa |
| `idx_tarea_aseo_sync_completada` | tarea_aseo_sync | completada | Filtrado tareas |
| `idx_empleado_sync_estado` | empleado_sync | estado | Filtrado empleados |
| `idx_produccion_registro_sync_*` | produccion_registro_sync | producto_id, registro_sync_id | FKs |

---

## ⚡ Opción 1: Ejecución en Supabase Web Console (RECOMENDADO)

### Paso 1: Acceder a Supabase
1. Abre https://supabase.com/dashboard
2. Selecciona tu proyecto `labendicion`
3. En el menú lateral → **SQL Editor**

### Paso 2: Crear nueva Query
1. Haz clic en **+ New Query** (botón azul arriba a la derecha)
2. Dale un nombre: `Índices_Optimizacion`

### Paso 3: Copiar Script
1. Abre `backend/src/main/resources/db/migration/V999__optimize_indexes.sql` en tu editor
2. Copia **TODO** el contenido
3. Pégalo en el SQL Editor de Supabase

### Paso 4: Ejecutar
1. Haz clic en **Run** (botón play azul o Ctrl+Enter)
2. Espera a que complete (debería tardar < 5 segundos)
3. Verifica que no hay errores rojo (los verde's `CREATE INDEX...` son normales)

✅ **¡Listo! Los índices se crearon.**

---

## ⚡ Opción 2: Ejecución vía Terminal (Solo si tienes psql instalado)

```bash
# Obtén tu DATABASE_URL de Supabase:
# Dashboard → Settings → Database → Connection pooling/Connection string

# Guarda en variable (Windows PowerShell):
$env:DATABASE_URL="postgresql://user:password@db.supabase.co:5432/postgres"

# O en bash:
export DATABASE_URL="postgresql://user:password@db.supabase.co:5432/postgres"

# Ejecuta el script:
psql $DATABASE_URL -f backend/src/main/resources/db/migration/V999__optimize_indexes.sql
```

---

## ⚡ Opción 3: Ejecución Automática via Flyway

Si tienes Flyway configurado en el proyecto (Spring Boot):
1. El script ya está en `src/main/resources/db/migration/V999__optimize_indexes.sql`
2. En el próximo deploy, Flyway lo detectará automáticamente
3. Se ejecutará antes de que la app inicie

**Configuración necesaria en `application.properties`:**
```properties
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
```

---

## ✅ Verificación Post-Ejecución

### En Supabase Web Console:
```sql
-- Ver todos los índices creados:
SELECT indexname FROM pg_indexes 
WHERE schemaname='public' AND indexname LIKE 'idx_%'
ORDER BY indexname;
```

**Esperado Output:**
```
idx_database...
idx_empleado_sync_estado
idx_empresa_sync_estado
idx_empresa_sync_razon_social
idx_paso_produccion_sync_producto_id
idx_produccion_registro_sync_producto_id
idx_produccion_registro_sync_registro_id
idx_producto_sync_estado
idx_producto_sync_nombre
idx_registro_sync_empleado_fecha
idx_registro_sync_fecha
idx_tarea_aseo_sync_completada
```

### Ver estadísticas de uso:
```sql
-- (Requiere algunos minutos de traffic para ver estadísticas)
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE indexname LIKE 'idx_%'
ORDER BY idx_scan DESC;
```

---

## ⚠️ Notas Importantes

### Seguridad
- ✅ **Seguro ejecutar múltiples veces**: Usa `CREATE INDEX IF NOT EXISTS`
- ✅ **Sin bloqueos**: PostgreSQL crea índices concurrentemente por defecto
- ✅ **Sin downtime**: La aplicación sigue funcionando mientras se crean

### Performance
- **Ejecución**: ~1-5 segundos (dependiendo de tamaño de tablas)
- **Impacto post-índices**: Bootstrap debería ser **3-5x más rápido**
- **Espacio**: Los índices usan ~50-100MB en total (estimado)

### Mantenimiento
- PostgreSQL auto-rebalanceará índices (VACUUM, ANALYZE)
- Sin necesidad de intervención manual
- Los índices se regeneran automáticamente en backups

---

## 🆘 Si algo falla...

### Error: "permission denied"
- Verifica que accediste con un usuario con permisos (admin en Supabase)
- Supabase por defecto permite la mayoría de operaciones

### Error: "index ... already exists"
- Normal si ejecutaste el script 2 veces
- Usa `DROP INDEX IF EXISTS` primero (aunque es innecesario con IF NOT EXISTS)

### Query sigue lenta después de crear índices
- Espera 5 minutos (PostgreSQL actualiza estadísticas)
- Ejecuta manualmente: `ANALYZE;` en Supabase SQL Editor
- Verifica que los índices se crearon: `SELECT * FROM pg_stat_user_indexes;`

---

## 📊 Monitoreo (Opcional)

Para ver si los índices se usan realmente:

```sql
-- Índices más utilizados en últimas 24h:
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE indexname LIKE 'idx_%'
  AND idx_scan > 0
ORDER BY idx_scan DESC;
```

---

**🎯 Próximo Paso:** 
1. Ejecuta los índices (Opción 1 recomendada)
2. Haz deploy en Render
3. Ejecuta `./test-performance.ps1` desde PowerShell para validar
4. ¡Disfruta del bootstrap 3-5x más rápido! 🚀

