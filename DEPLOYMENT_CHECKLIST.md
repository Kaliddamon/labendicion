# ✅ Checklist de Deployment - Optimizaciones de Performance

Sigue esta lista paso a paso para desplegar las optimizaciones en producción.

## Antes de Desplegar (Verificaciones Locales)

- [ ] Leer `OPTIMIZACION_PERFORMANCE_GUIA.md` completo
- [ ] Compilación exitosa: `mvn clean package -DskipTests` ✅
- [ ] Revisar cambios:
  - [ ] FrontendSyncController.java (límite de 100 registros)
  - [ ] application.properties (batching Hibernate)
  - [ ] application-prod.properties (tuning producción)
  - [ ] V999__optimize_indexes.sql (índices creados)

---

## Paso 1: Ejecutar Índices en Supabase ⏱️ 5 minutos

**IMPORTANTE: Hazlo PRIMERO, antes de hacer deploy en Render**

- [ ] Ir a https://supabase.com/dashboard
- [ ] Seleccionar proyecto `labendicion`
- [ ] Menú → SQL Editor → New Query
- [ ] Abrir `backend/src/main/resources/db/migration/V999__optimize_indexes.sql`
- [ ] Copiar TODO el contenido
- [ ] Pegar en Supabase SQL Editor
- [ ] Ejecutar (Run / Ctrl+Enter)
- [ ] Verificar que no hay errores rojo (warnings verdes OK)
- [ ] Validar índices creados:
  ```sql
  SELECT COUNT(*) FROM pg_indexes WHERE indexname LIKE 'idx_%';
  ```
  Debería devolver: `10` (o más si tienes otros índices previos)

---

## Paso 2: Push de Cambios a GitHub 📤 2 minutos

```bash
cd C:\Users\CRIST\Desktop\labendicion

git status  # Verifica qué cambios hay

git add .   # Añade TODO

git commit -m "🚀 Performance: optimize bootstrap, add 10 indexes, tune Hibernate batching

- Limit registros a 100 en bootstrap
- Add 10 indexes on FK, ORDER BY, search fields
- Configure Hibernate batching (size 20/30)
- Increase connection pool (10-20)
- Application-prod optimized for Render"

git push origin main  # O tu rama principal
```

- [ ] Commits pushed exitosamente
- [ ] Verifica en GitHub que aparecen los cambios

---

## Paso 3: Deploy en Render 🚀 3-5 minutos

### Opción A: Automático (Recomendado si tienes CI/CD)
- [ ] Ve a https://dashboard.render.com
- [ ] Selecciona tu servicio backend (`labendicion-be`)
- [ ] Si tiene auto-deploy habilitado, debería detectar el push y desplegar automáticamente
- [ ] Espera a que termine (ve a "Events" para ver logs)

### Opción B: Manual
- [ ] Ve a https://dashboard.render.com
- [ ] Selecciona tu servicio backend
- [ ] Botón **"Redeploy"** (no "Clear Build Cache")
- [ ] Espera a que termine el build:
  ```
  Building and deploying...
  [✓] Deployed successfully
  ```

### Timeline esperado:
```
- 0:00 - Push iniciado
- 1:00 - Render detecta cambios
- 1:30 - Build comienza (maven compile)
- 4:00 - Build completado, artifact creado
- 4:30 - Nueva instancia iniciada
- 5:00 - Deploy completado
```

- [ ] Verifica que el deploy fue exitoso (status: "Live")
- [ ] Copia URL del servicio (ej: `https://labendicion-be.onrender.com`)

---

## Paso 4: Validaciones Post-Deploy 🧪 5 minutos

### Validación 1: Bootstrap Response
```bash
# En PowerShell:
$url = "https://labendicion-be.onrender.com/api/frontend/bootstrap"
$start = [System.Diagnostics.Stopwatch]::StartNew()
$resp = Invoke-WebRequest -Uri $url
$start.Stop()

Write-Host "Status: $($resp.StatusCode)"
Write-Host "Time: $($start.ElapsedMilliseconds)ms"
Write-Host "Size: $($resp.RawContent.Length) bytes"
```

- [ ] Status = 200 ✅
- [ ] Tiempo < 2000ms (2 segundos) ✅
- [ ] Tamaño < 10MB ✅

### Validación 2: Script PowerShell Automatizado
```bash
cd C:\Users\CRIST\Desktop\labendicion
.\test-performance.ps1 -BackendUrl "https://labendicion-be.onrender.com"
```

- [ ] Todos los tests pasan ✅
- [ ] Performance: "🚀 EXCELENTE" o "✓ BUENO" ✅

### Validación 3: Navegador (desde Vercel Frontend)
- [ ] Abre tu app web en navegador
- [ ] DevTools (F12) → Network
- [ ] Recarga página (Ctrl+R)
- [ ] Busca request a `/api/frontend/bootstrap`
- [ ] Mira tiempo (Time):
  ```
  150-500ms   → 🚀 EXCELENTE
  500-1000ms  → ✓ BUENO
  1-2s        → ✓ ACEPTABLE
  > 2s        → ⚠️ Revisa logs de Render
  ```

- [ ] La carga de datos funciona sin errores
- [ ] Los productos, registros, etc. aparecen

---

## Paso 5: Rollback (Si hay problemas) 🔄

Si algo no funciona después del deploy:

```bash
# Ver último commit bueno:
git log --oneline -5

# Revertir a commit anterior:
git revert HEAD  # Crea un nuevo commit revertido
git push origin main

# Render detectará y redeployará automáticamente
```

Alternativa rápida en Render:
- Ve a deployment anterior "Successful"
- Haz clic en los "..." → "Redeploy"

- [ ] Rollback completado si fue necesario

---

## Verificaciones Finales

### 1. Logs de Render (Optional - para debugging)
```
Ve a dashboard.render.com → tu-servicio → Logs
Busca:
  ✓ "Started application in X ms"
  ✓ Sin "LazyInitializationException"
  ✓ Sin "Query did not return a unique result"
```

### 2. Índices en Supabase (Verificación)
```sql
-- En Supabase SQL Editor:
SELECT COUNT(*) FROM pg_indexes WHERE indexname LIKE 'idx_%';
-- Debe devolver: 10 (o +)
```

### 3. Performance Histórico (Después de 1 hora de uso)
```sql
-- En Supabase: ver uso de índices
SELECT indexname, idx_scan 
FROM pg_stat_user_indexes 
WHERE indexname LIKE 'idx_%'
ORDER BY idx_scan DESC;
```

- [ ] Todos los índices tienen idx_scan > 0 (están siendo usados)

---

## 📊 Resultados Esperados

Después de completar este checklist:

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| **Bootstrap Time** | 2-5s | <1s | **3-5x rápido** |
| **Response Size** | Variable | Consistente | **-40-60%** |
| **DB Connections** | Limitadas | Optimizadas | **+100% capacity** |
| **Registros Cargados** | 100% | 100 (últimos) | **-98%** |

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| Bootstrap sigue tardando > 2s | ✓ Verifica índices en Supabase; ejecuta `ANALYZE;` |
| Error "LazyInitializationException" | ✓ Verifica que los cambios están en Render (ver logs) |
| 404 en `/api/frontend/bootstrap` | ✓ Render no tiene el código nuevo; fuerza redeploy |
| Índices no se crearon | ✓ Revisa errores en Supabase SQL Editor; intenta de nuevo |
| Response 500 | ✓ Mira logs de Render → busca "Error"; copia stacktrace |

---

## ✅ Checklist Final

- [ ] Paso 1: Índices en Supabase ✅
- [ ] Paso 2: Push a GitHub ✅
- [ ] Paso 3: Deploy en Render ✅
- [ ] Paso 4: Validaciones post-deploy ✅
- [ ] Paso 5: Sin rollback necesario ✅
- [ ] Verificaciones finales completadas ✅

---

## 🎉 ¡Deployment Completo!

Tu app ahora carga **3-5x más rápido**. 

**Próximos pasos (Opcional):**
1. Recolectar feedback de usuarios sobre velocidad
2. Monitorear performance con Sentry/NewRelic (si tienes)
3. Considerar caché Redis para bootstrap (opcional a largo plazo)

---

**Duración total estimada:** 20-30 minutos (principalmente esperando deploys)

**Si tienes dudas:** Revisa `OPTIMIZACION_PERFORMANCE_GUIA.md` o `INDICES_GUIA_EJECUCION.md`

