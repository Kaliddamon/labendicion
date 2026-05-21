# Modelado Relacional de Pasos - Guía de Implementación

## Cambios realizados

### Backend (Java / Spring Boot)

#### 1. Nueva Entidad: `PasoProduccionSync`
- **Archivo**: `src/main/java/dev/kali/labendicion/domain/entity/PasoProduccionSync.java`
- **Descripción**: Entidad JPA que representa un paso/acción individual dentro de una orden de producción
- **Campos**:
  - `id` (String): Identificador único
  - `productoSync` (FK): Referencia a ProductoSync (relación ManyToOne)
  - `descripcion` (String): Descripción de la acción
  - `orden` (Integer): Número de orden del paso
  - `completado` (Boolean): Flag para indicar si se completó

#### 2. Actualización de Entidad: `ProductoSync`
- **Cambios**:
  - Removida columna `pasos` (String JSON)
  - Añadida relación `@OneToMany(mappedBy = "productoSync", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)`
  - Los pasos ahora son una `List<PasoProduccionSync>`

#### 3. Nuevo Repositorio: `PasoProduccionSyncRepository`
- **Archivo**: `src/main/java/dev/kali/labendicion/repository/PasoProduccionSyncRepository.java`
- **Métodos**:
  - `findByProductoSyncId(String productoSyncId)`: Obtener todos los pasos de una orden

#### 4. Actualización de Controlador: `FrontendSyncController`
- **Inyección**: `PasoProduccionSyncRepository`
- **Cambios en POST `/api/frontend/productos`**:
  - Ahora acepta pasos como array de objetos en el JSON
  - Crea y persiste instancias de `PasoProduccionSync` relacionadas
  - Guarda con cascade automático
  
- **Cambios en PUT `/api/frontend/productos/{id}`**:
  - Elimina pasos previos (orphanRemoval)
  - Crea nuevos pasos de la lista enviada
  
- **Nuevos Endpoints de Pasos**:
  - `GET /api/frontend/productos/{productoId}/pasos` → Lista pasos de una orden
  - `POST /api/frontend/productos/{productoId}/pasos` → Crea un paso individual
  - `PUT /api/frontend/pasos/{pasoId}` → Actualiza un paso
  - `PATCH /api/frontend/pasos/{pasoId}/toggle` → Marca paso como completado/no completado
  - `DELETE /api/frontend/pasos/{pasoId}` → Elimina un paso

### Migraciones SQL (Flyway)

#### V1__Create_empresa_sync.sql
- Crea tabla `empresa_sync` con columnas: id, razon_social, telefono, correo, direccion, estado
- Añade índice en `razon_social` para búsquedas rápidas

#### V2__Create_paso_produccion_sync.sql
- Crea tabla `paso_produccion_sync` con columnas: id, producto_sync_id (FK), descripcion, orden, completado
- Añade restricción de clave foránea con ON DELETE CASCADE
- Añade índice en `producto_sync_id`

#### V3__Drop_pasos_from_producto_sync.sql
- Elimina la columna `pasos` de `producto_sync` (si existe)
- Compatible con H2 (testing) y PostgreSQL (producción)

### Frontend (React / TypeScript)

#### Cambios en `Produccion.tsx`
- Mejor parseo de pasos al editar (soporta tanto array de objetos como JSON string legacy)
- Mejora en display de pasos en tarjetas de productos

## Instrucciones de Despliegue

### Paso 1: Respaldar Base de Datos (IMPORTANTE)
```sql
-- Para PostgreSQL
pg_dump -h <host> -U <user> <database> > backup_$(date +%Y%m%d_%H%M%S).sql

-- Para H2 (archivo)
-- Simplemente copia el archivo .mv.db a un lugar seguro
```

### Paso 2: Compilar Backend
```powershell
cd C:\Users\CRIST\Desktop\labendicion\backend
.\mvnw.cmd clean package -DskipTests
# O ejecutar directamente con Maven:
.\mvnw.cmd spring-boot:run
```

### Paso 3: Las migraciones se ejecutarán automáticamente
- Flyway detectará archivos en `src/main/resources/db/migration/`
- Se ejecutarán en orden (V1, V2, V3) automáticamente en el startup

### Paso 4: Compilar Frontend
```powershell
cd C:\Users\CRIST\Desktop\labendicion\frontend
npm install (si es necesario)
npm run dev  # Para desarrollo
# O para producción:
npx vite build
```

## Pruebas Manuales

### 1. Verificar migraciones
Después de iniciar el backend, verifica en tu BD:
```sql
-- PostgreSQL
\dt empresa_sync, paso_produccion_sync, producto_sync
SELECT * FROM flyway_schema_history;

-- H2 (en aplicación)
-- Abre http://localhost:8080/h2-console y verifica las tablas
```

### 2. Crear empresa
```bash
curl -X POST http://localhost:8080/api/frontend/empresas \
  -H "Content-Type: application/json" \
  -d '{
    "id": "emp001",
    "razonSocial": "Mi Empresa",
    "telefono": "1234567890",
    "correo": "info@empresa.com",
    "direccion": "Calle 123",
    "estado": "Sin ordenes"
  }'
```

### 3. Crear orden con pasos (vía frontend o curl)
```bash
curl -X POST http://localhost:8080/api/frontend/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Fundas de cojín",
    "cantidad": 100,
    "empresa": "Mi Empresa",
    "ganancia": 500000,
    "fechaAsignacion": "2026-05-18",
    "fechaTerminacion": "",
    "estado": "Pendiente",
    "pasos": [
      { "descripcion": "Cortar tela", "orden": 1, "completado": false },
      { "descripcion": "Coser", "orden": 2, "completado": false },
      { "descripcion": "Revisar calidad", "orden": 3, "completado": false }
    ]
  }'
```

### 4. Listar pasos de una orden
```bash
# Obtener el ID de la orden del paso 3
curl http://localhost:8080/api/frontend/productos/{productoId}/pasos
```

### 5. Marcar paso como completado
```bash
curl -X PATCH http://localhost:8080/api/frontend/pasos/{pasoId}/toggle
```

### 6. Verificar estado de empresa
Navega a la sección Producción en el frontend:
- Crea una orden (la empresa cambiar a "Ordenes pendientes")
- Elimina todos los pasos o la orden (si todo se elimina, estado debería cambiar a "Sin ordenes")

## Estructura de tablas

### EMPRESA_SYNC
```
id          VARCHAR(64) PRIMARY KEY
razon_social VARCHAR(255) NOT NULL
telefono    VARCHAR(100)
correo      VARCHAR(255)
direccion   VARCHAR(512)
estado      VARCHAR(50) DEFAULT 'Sin ordenes'
```

### PASO_PRODUCCION_SYNC
```
id              VARCHAR(64) PRIMARY KEY
producto_sync_id VARCHAR(64) NOT NULL FK → PRODUCTO_SYNC
descripcion     VARCHAR(1000)
orden           INT
completado      BOOLEAN DEFAULT FALSE
```

### PRODUCTO_SYNC (actualizado)
```
id                  VARCHAR(64) PRIMARY KEY
nombre              VARCHAR(...)
cantidad            INT
empresa             VARCHAR(...)
ganancia            INT
fechaAsignacion     VARCHAR(...)
fechaTerminacion    VARCHAR(...)
estado              VARCHAR(...)
-- pasos ahora es relación 1-N con PASO_PRODUCCION_SYNC (no columna)
```

## Rollback (en caso de error)

Si necesitas revertir los cambios:

1. **Restaurar BD desde backup**:
   ```sql
   -- PostgreSQL
   psql -h <host> -U <user> <database> < backup_file.sql
   ```

2. **Eliminar archivos de migración** (si aún no se ejecutaron):
   ```
   Eliminar V1, V2, V3 de src/main/resources/db/migration/
   ```

3. **Revertir cambios de código**:
   ```
   git checkout HEAD -- backend/
   git checkout HEAD -- frontend/
   ```

## Notas Importantes

1. **Cascade y Orphan Removal**: Al eliminar una orden (ProductoSync), todos sus pasos se eliminarán automáticamente.
2. **EAGER Fetch**: Los pasos se cargan automáticamente con la orden (mejora UX, aunque podría afectar performance si hay muchos pasos).
3. **Compatibilidad**: Las migraciones están diseñadas para H2 (testing) y PostgreSQL (producción).
4. **Validación de Roles**: Actualmente, los endpoints CRUD de empresas no están restringidos por rol. Se recomienda añadir `@PreAuthorize` o validación manual si se requiere.

## Próximos Pasos Opcionales

- [ ] Agregar validaciones de rol para endpoints CRUD de empresas (@PreAuthorize en controlador)
- [ ] Optimizar queries usando @Query con LEFT JOIN FETCH para evitar N+1 queries
- [ ] Añadir pruebas unitarias e integración para nuevos endpoints
- [ ] Extractar lógica de pasos a servicio dedicado (PasoProduccionService)
- [ ] Implementar soft deletes si es necesario auditoría
- [ ] Mejorar UI del modal de empresas (edición inline, paginación, etc.)
