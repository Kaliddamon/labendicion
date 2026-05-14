# ✅ Cambios Realizados: Persistencia de Datos en Supabase

## 📋 Resumen Ejecutivo

Se han realizado **cambios mínimos** para que los datos se persistan en Supabase (PostgreSQL en la nube) en lugar de perderse cuando hay redeploy en Render o frontend.

**Problema Resuelto:**
- ❌ ANTES: Datos desaparecían después de redeploy (H2 en memoria/archivo)
- ✅ AHORA: Datos se guardan en Supabase y persisten entre redeploys

---

## 📝 Cambios Realizados

### 1. Backend: `application-prod.properties`
**Archivo:** `backend/src/main/resources/application-prod.properties`

**Cambio:**
```ini
# ANTES
spring.jpa.hibernate.ddl-auto=validate

# DESPUÉS
spring.jpa.hibernate.ddl-auto=update
```

**Razón:**
- `validate`: Solo valida que las tablas existan (no las crea)
- `update`: **Crea tablas si no existen, pero no las elimina** (mejor para producción)

---

### 2. Backend: `application-supabase.properties`
**Archivo:** `backend/src/main/resources/application-supabase.properties`

**Cambio:**
```ini
# ANTES
spring.jpa.hibernate.ddl-auto=create

# DESPUÉS
spring.jpa.hibernate.ddl-auto=update
```

**Razón:**
- `create`: Recrea las tablas cada vez (pierde datos)
- `update`: **Solo agrega cambios sin perder datos**

---

### 3. Render: `render.yaml`
**Archivo:** `render.yaml`

**Cambio:**
```yaml
# ANTES
- key: SPRING_PROFILES_ACTIVE
  value: supabase

# DESPUÉS
- key: SPRING_PROFILES_ACTIVE
  value: prod
```

**Razón:**
- El perfil `prod` es más robusto para conectarse a PostgreSQL
- Acepta variables estándar: `DATABASE_URL`, `PGUSER`, `PGPASSWORD`
- Mejor compatible con diferentes plataformas

---

## 🚀 Próximos Pasos para Activar Persistencia

### Solo 3 Variables de Entorno en Render

Ve a: **Render Dashboard → labendicion-backend → Environment Variables**

Agrega estas variables con tus datos reales de Supabase:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | `postgresql://postgres:TU_PASSWORD@db.xxxxxxxxxxxxx.supabase.co:5432/postgres` |
| `PGUSER` | `postgres` |
| `PGPASSWORD` | Tu contraseña de Supabase |

👉 **Ver sección "Obtener Credenciales" en `INSTRUCCIONES_PERSISTENCIA_SUPABASE.md`**

---

## 🔍 Cómo Verificar que Funciona

1. **Agrega las variables en Render** ⬆️
2. **Espera a que Render haga redeploy** (automático)
3. **Crea un registro en el frontend** (ej: empleado, pedido)
4. **Recarga la página** (`Ctrl+F5`)
5. **El registro sigue ahí** ✅

---

## 🛠️ Configuración Técnica

### Perfil `prod` (application-prod.properties)
```ini
# PostgreSQL (Supabase)
spring.datasource.url=${DATABASE_URL:}
spring.datasource.username=${PGUSER:}
spring.datasource.password=${PGPASSWORD:}

# Crea tablas si no existen, sin perder datos
spring.jpa.hibernate.ddl-auto=update
```

### Perfil `supabase` (application-supabase.properties)
```ini
# Alternativa usando formatos diferentes
# También usa 'update' para proteger datos

spring.jpa.hibernate.ddl-auto=update
```

### Dockerfile
✅ **Sin cambios** (ya está configurado correctamente)
- Inyecta la variable `SPRING_PROFILES_ACTIVE` en tiempo de ejecución

---

## 📚 Archivos Incluidos

1. **`INSTRUCCIONES_PERSISTENCIA_SUPABASE.md`**
   - Guía paso a paso para obtener credenciales
   - Cómo agregar variables en Render
   - Solución de problemas

2. **`RESUMEN_CAMBIOS_PERSISTENCIA.md`** (este archivo)
   - Cambios técnicos realizados
   - Configuración resultante

---

## ✨ Beneficios

✅ **Persistencia Real:** Datos en PostgreSQL (Supabase), no en memoria  
✅ **Sin Pérdidas:** Los datos sobreviven redeploys  
✅ **Recuperación Automática:** El frontend obtiene datos de la BD al cargar  
✅ **Escalable:** Compatible con cualquier plataforma (Render, Railway, Heroku, etc.)  

---

## ⚠️ Importante

**Sin agregar las 3 variables de entorno en Render, la persistencia NO funcionará.**

Ver: `INSTRUCCIONES_PERSISTENCIA_SUPABASE.md` para los pasos exactos.

---

**Cambios realizados:** 2026-05-14  
**Archivos modificados:** 2  
**Archivos creados:** 1 (guía)

