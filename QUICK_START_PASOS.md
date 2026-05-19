# 🚀 Quick Start - Modelado Relacional de Pasos

## ⚡ Inicio Rápido (5 minutos)

### 1. Respalda tu Base de Datos (IMPORTANTE)
```powershell
# PostgreSQL
pg_dump -h localhost -U tu_usuario tu_basedatos > backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql

# H2 (si usas el archivo embebido)
# Copia el archivo .mv.db a una carpeta segura
```

### 2. Limpia y Construye el Backend
```powershell
cd C:\Users\CRIST\Desktop\labendicion\backend
.\mvnw.cmd clean package -DskipTests
```
**Salida esperada**: `BUILD SUCCESS`

### 3. Ejecuta el Backend
```powershell
# Opción A: Ejecutar desde el JAR compilado
java -jar target\labendicion-0.0.1-SNAPSHOT.jar

# Opción B: Ejecutar directamente con Maven
.\mvnw.cmd spring-boot:run
```

**Señales de éxito**:
- Ves "Tomcat started on port 8080"
- No hay excepciones en los logs sobre Flyway

### 4. Verifica las Migraciones (en otra terminal)
```sql
-- Para PostgreSQL
psql -h localhost -U tu_usuario tu_basedatos

-- EN LA CONSOLA SQL:
SELECT * FROM flyway_schema_history;
-- Deberías ver V1, V2, V3

-- Verifica las tablas
\dt empresa_sync
\dt paso_produccion_sync
```

### 5. Frontend (en otro terminal)
```powershell
cd C:\Users\CRIST\Desktop\labendicion\frontend
npm install # solo si es la primera vez
npm run dev
```

**Accede a**: http://localhost:5173

---

## 🧪 Prueba Rápida (Paso a Paso)

### 1. Crear una Empresa (vía web)
1. Ingresa a la app (http://localhost:5173)
2. Ve a **Producción**
3. Haz clic en **Nueva Orden**
4. Haz clic en el botón **"Empresas"** (si eres SUPERADMINISTRADOR)
5. En el modal, llena:
   - **Razon social**: "Mi Primera Empresa"
   - **Teléfono**: "3001234567"
   - **Correo**: "contacto@empresa.com"
   - **Dirección**: "Calle 123 #45-67"
   - **Estado**: Selecciona "Sin ordenes"
6. Haz clic en **"Crear"**

### 2. Crear una Orden con Pasos
1. Aún en el formulario de **Nueva Orden**
2. Completa:
   - **¿Qué vamos a confeccionar?**: "Fundas de cojín"
   - **Cantidad**: Escribe `50` → verás `50` (pequeño para ser formateado, intenta `5000` → `5'000`)
   - **Empresa / Cliente**: Selecciona "Mi Primera Empresa"
   - **Ganancia por este trabajo**: Escribe `500000` → deberías ver `500'000`
   - **Estado**: "Pendiente"

3. En la sección **"Acciones / Pasos"**:
   - **Paso 1**: Escribe "Cortar tela" → Haz clic en "Agregar"
   - **Paso 2**: Escribe "Coser" → Haz clic en "Agregar"
   - **Paso 3**: Escribe "Control de calidad" → Haz clic en "Agregar"

4. Haz clic en **"Guardar Orden"**

### 3. Verifica en la Base de Datos
```sql
-- Conecta a tu BD
psql -h localhost -U tu_usuario tu_basedatos

-- Ve los datos
SELECT * FROM producto_sync WHERE nombre = 'Fundas de cojín';
-- Obtén el ID (ej: abc123def456)

SELECT * FROM paso_produccion_sync WHERE producto_sync_id = 'abc123def456';
-- Deberías ver 3 filas (tus 3 pasos)

SELECT * FROM empresa_sync WHERE razon_social = 'Mi Primera Empresa';
-- Estado debería ser 'Ordenes pendientes'
```

### 4. Prueba los Endpoints (curl, Postman, etc.)
```bash
# Listar empresas
curl http://localhost:8080/api/frontend/empresas

# Listar pasos de una orden (reemplaza {productoId} con el ID obtenido)
curl http://localhost:8080/api/frontend/productos/{productoId}/pasos

# Marcar un paso como completado (reemplaza {pasoId} con el ID)
curl -X PATCH http://localhost:8080/api/frontend/pasos/{pasoId}/toggle
```

---

## 🐛 Troubleshooting

### Error: "Flyway migration failed"
**Causa**: Columna `pasos` ya existe en `producto_sync` y no puede dropearse.
**Solución**:
```sql
-- Drop manualmente ANTES de ejecutar el backend
ALTER TABLE producto_sync DROP COLUMN pasos;
-- Luego reinicia el backend
```

### Error: "LazyInitializationException" al cargar pasos
**Causa**: Los pasos no fueron cargados del BD.
**Solución**: Ya está arreglado (`fetch = FetchType.EAGER` en la entidad).

### Error: Migraciones no se aplican
**Causa**: Flyway no está habilitado o no encuentra los archivos.
**Verificación**:
```
1. Verifica que existan: src/main/resources/db/migration/V1__*, V2__*, V3__*
2. Verifica en application.properties que no haya "spring.flyway.enabled=false"
```

### El selector de empresas está vacío
**Causa**: Las empresas no se cargaron del bootstrap.
**Verificación**:
```
1. Abre Developer Tools (F12) → Network
2. Busca la llamada a "/api/frontend/bootstrap"
3. Verifica que la respuesta incluya "empresas": [...]
4. Si no, el backend no está sirviendo los datos
```

---

## 📊 Checklist de Verificación

- [ ] Backend compila sin errores (`BUILD SUCCESS`)
- [ ] Migraciones Flyway se ejecutan (ves V1, V2, V3 en flyway_schema_history)
- [ ] Tablas `empresa_sync` y `paso_produccion_sync` existen
- [ ] Frontend carga sin errores (http://localhost:5173)
- [ ] Puedes crear una empresa desde el modal
- [ ] Puedes crear una orden con 3 pasos
- [ ] Los números se formatean con apóstrofes (500'000)
- [ ] El estado de la empresa cambió a "Ordenes pendientes"
- [ ] GET /api/frontend/empresas devuelve tu empresa
- [ ] GET /api/frontend/productos/{id}/pasos devuelve tus 3 pasos

---

## 📚 Documentación Completa

Para instrucciones detalladas, rollback, y referencias:
- Ver: `RESUMEN_IMPLEMENTACION.md`
- Ver: `MIGRACION_PASOS_RELACIONAL.md`

---

## 💡 Tips Útiles

1. **Modo H2 Console** (desarrollo):
   - Ve a http://localhost:8080/h2-console
   - Conecta con usuario "sa" (sin contraseña)
   - Puedes ver y modificar datos en tiempo real

2. **Logs de Flyway**:
   ```
   En el stdout del backend verás líneas como:
   "Successfully validated 3 migrations (execution time 10ms)"
   "Successfully applied 3 migrations (execution time 50ms)"
   ```

3. **Resetting de BD durante desarrollo**:
   ```sql
   DELETE FROM paso_produccion_sync;
   DELETE FROM producto_sync;
   DELETE FROM empresa_sync;
   -- Luego reinicia el frontend para que recargue el bootstrap
   ```

---

## 🎉 ¡Listo!

Si todo se ejecuta correctamente, ya tienes:
- ✅ Órdenes con pasos en tabla relacional
- ✅ Formato numérico en vivo
- ✅ Gestión completa de empresas
- ✅ Estado automático de empresas
- ✅ Migraciones Flyway aplicadas

¡Disfruta tu nuevo sistema! 🚀

