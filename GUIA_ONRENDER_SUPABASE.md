# 🚀 GUÍA DESPLIEGUE OnRender + Supabase + Vercel

## Tabla de Contenidos
1. [Requisitos](#requisitos)
2. [Parte 1: Preparación del Código](#parte-1-preparación-del-código)
3. [Parte 2: Configurar Supabase](#parte-2-configurar-supabase)
4. [Parte 3: Despliegue en OnRender (Backend)](#parte-3-despliegue-en-onrender)
5. [Parte 4: Despliegue en Vercel (Frontend)](#parte-4-despliegue-en-vercel)
6. [Troubleshooting](#troubleshooting)

---

# Requisitos

- ✅ Cuenta en [GitHub](https://github.com)
- ✅ Cuenta en [Supabase](https://supabase.com)
- ✅ Cuenta en [OnRender](https://render.com)
- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Git instalado
- ✅ Java 17+ (para compilar localmente)
- ✅ Node.js + npm

**Tiempo estimado:** 1-2 horas

---

# PARTE 1: Preparación del Código

## Paso 1.1: Pushear a GitHub

```bash
cd C:\Users\CRIST\Desktop\labendicion

git init
git add .
git commit -m "feat: Add Supabase integration for OnRender deployment"

# Reemplaza TU_USUARIO con tu usuario de GitHub
git remote add origin https://github.com/TU_USUARIO/labendicion.git
git branch -M main
git push -u origin main
```

---

# PARTE 2: Configurar Supabase

## Paso 2.1: Crear Proyecto en Supabase

1. Inicia sesión en https://supabase.com
2. Haz clic en **"New Project"**
3. Configura:
   - **Name:** `labendicion`
   - **Database Password:** Elige una contraseña fuerte (guárdala)
   - **Region:** `South America (São Paulo)` (más cercano a Colombia)
4. Haz clic en **"Create new project"**
5. Espera 2-5 minutos a que se cree

---

## Paso 2.2: Obtener Credenciales de Conexión

### Una Vez que el Proyecto esté Listo:

1. Ve a **Settings** → **Database**
2. Copia la **Connection String URI**:
   - Verás algo como: `postgresql://postgres:[PASSWORD]@db.sjdksdfljsdf.supabase.co:5432/postgres`
3. Reemplaza `[PASSWORD]` con la contraseña que elegiste antes
4. Guarda este valor completo

**Ejemplo final:**
```
postgresql://postgres:MiContraseña123@db.ujsioelnrctyalqezyay.supabase.co:5432/postgres
```

---

## Paso 2.3: Obtener Variables del Frontend

### En la página del Proyecto Supabase:

1. Ve a **Settings** → **API**
2. Copia:
   - `Project URL` → guárdalo como `VITE_SUPABASE_URL`
   - `anon public` key → guárdalo como `VITE_SUPABASE_PUBLISHABLE_KEY`

---

# PARTE 3: Despliegue en OnRender

## Paso 3.1: Crear Cuenta y Conectar GitHub

1. Ve a https://render.com
2. Haz clic en **"Sign Up"**
3. Usa GitHub para login
4. Autoriza que Render acceda a tu GitHub

---

## Paso 3.2: Crear Nuevo Servicio Web

1. En el Dashboard, haz clic en **"New +"**
2. Selecciona **"Web Service"**
3. Selecciona tu repositorio `labendicion`
4. Configura:
   - **Name:** `labendicion-backend`
   - **Environment:** Docker
   - **Build Command:** (dejar vacío, usará Dockerfile)
   - **Start Command:** (dejar vacío)
   - **Plan:** Free
5. **Crea el servicio**

---

## Paso 3.3: Configurar Variables de Entorno

### CRÍTICO - Este es el paso que arregla tu error:

1. En el dashboard de Render, ve a tu servicio `labendicion-backend`
2. Haz clic en **"Environment"** (en el panel derecho)
3. Haz clic en **"Add Environment Variable"** para cada uno:

**Variable 1:**
```
Key: DATABASE_URL
Value: postgresql://postgres:MiContraseña123@db.ujsioelnrctyalqezyay.supabase.co:5432/postgres
```
*(Usa el que copiaste en Paso 2.2)*

**Variable 2:**
```
Key: PGUSER
Value: postgres
```

**Variable 3:**
```
Key: PGPASSWORD
Value: MiContraseña123
```
*(La contraseña que elegiste)*

**Variable 4:**
```
Key: SPRING_PROFILES_ACTIVE
Value: supabase
```

**Variable 5:**
```
Key: CORS_ALLOWED_ORIGINS
Value: https://labendicion.vercel.app
```
*(Lo cambiarás después cuando tengas la URL de Vercel)*

**Variable 6:**
```
Key: SWAGGER_ENABLED
Value: true
```

---

## Paso 3.4: Desplegar en OnRender

1. Vuelve a la pestaña principal del servicio
2. Haz clic en **"Deploy"** (botón grande arriba a la derecha)
3. Espera a que se compile (3-10 minutos)
4. Verás **"✓ Live"** cuando esté exitoso

---

## Paso 3.5: Obtener URL del Backend

1. En el Dashboard de tu servicio
2. Verás algo como: `https://labendicion-backend.onrender.com`
3. **Guarda esta URL**

---

## Paso 3.6: Probar Backend

### Abre en tu navegador:
```
https://labendicion-backend.onrender.com/actuator/health
```

**Deberías ver:**
```json
{
  "status": "UP"
}
```

Si ves esto, ¡tu backend funciona! ✅

---

# PARTE 4: Despliegue en Vercel

## Paso 4.1: Crear Proyecto en Vercel

1. Ve a https://vercel.com
2. Haz clic en **"Add New"** → **"Project"**
3. Selecciona tu repositorio `labendicion`
4. Configura:
   - **Project Name:** `labendicion-frontend`
   - **Framework:** Vite (detección automática)
   - **Root Directory:** `./frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

---

## Paso 4.2: Configurar Variables de Entorno

### En la sección "Environment Variables":

**Variable 1:**
```
Name: VITE_API_URL
Value: https://labendicion-backend.onrender.com
```
*(Tu URL de OnRender del Paso 3.5)*

**Variable 2:**
```
Name: VITE_SUPABASE_URL
Value: https://ujsioelnrctyalqezyay.supabase.co
```
*(Tu Project URL de Supabase)*

**Variable 3:**
```
Name: VITE_SUPABASE_PUBLISHABLE_KEY
Value: sb_publishable_y59f2pj3iTmdzn5CW7A39w_UYR5PF5e
```
*(Tu anon public key de Supabase)*

---

## Paso 4.3: Deploy en Vercel

1. Haz clic en **"Deploy"**
2. Espera 2-5 minutos
3. Verás ✅ "Congratulations!"

---

## Paso 4.4: Obtener URL del Frontend

1. En el Dashboard verás tu URL, algo como:
   ```
   https://labendicion-frontend.vercel.app
   ```
2. **Guarda esta URL**

---

## Paso 4.5: Actualizar CORS en OnRender

### De Vuelta en OnRender:

1. Ve a tu servicio `labendicion-backend`
2. **Environment** → Editar `CORS_ALLOWED_ORIGINS`
3. Cambia a:
   ```
   https://labendicion-frontend.vercel.app
   ```
4. **Guarda** → Render automáticamente redeploy

---

# TESTING & VALIDACIÓN

## Test 1: Frontend carga correctamente

1. Abre: `https://labendicion-frontend.vercel.app`
2. Abre la consola (F12)
3. Verifica que **NO hay errores de CORS**

## Test 2: API responde

1. Abre: `https://labendicion-backend.onrender.com/swagger-ui.html`
2. Verás la documentación de Swagger
3. Prueba un GET cualquiera

## Test 3: Conectividad Frontend-Backend

1. En tu navegador, en `https://labendicion-frontend.vercel.app`
2. Abre la consola (F12 → Network)
3. Intenta hacer una acción que envíe datos al backend
4. Verifica que los requests lleguen a `https://labendicion-backend.onrender.com`

---

# CHECKLIST FINAL

```
═══════════════════════════════════════════════════════════

GITHUB
✅ Repositorio creado y pushado
✅ Rama main actualizada

SUPABASE
✅ Proyecto creado
✅ DATABASE_URL obtenido
✅ Credenciales guardadas
✅ Variables frontend guardadas

ONRENDER (Backend)
✅ Servicio web creado
✅ Variables de entorno configuradas:
   - DATABASE_URL ✅
   - PGUSER ✅
   - PGPASSWORD ✅
   - SPRING_PROFILES_ACTIVE=supabase ✅
   - CORS_ALLOWED_ORIGINS ✅
   - SWAGGER_ENABLED ✅
✅ Deploy exitoso
✅ Health check funciona
✅ URL guardada

VERCEL (Frontend)
✅ Proyecto creado
✅ Variables de entorno:
   - VITE_API_URL ✅
   - VITE_SUPABASE_URL ✅
   - VITE_SUPABASE_PUBLISHABLE_KEY ✅
✅ Deploy exitoso
✅ URL guardada

INTEGRACIÓN
✅ Frontend sin errores
✅ CORS funcionando
✅ Swagger accesible
✅ API responde
✅ Conexión BD OK

═══════════════════════════════════════════════════════════
```

---

# Troubleshooting

## Error: "Driver org.postgresql.Driver claims to not accept jdbcUrl"

**Causa:** URL de Supabase no tiene prefijo `jdbc:`

**Solución ya implementada:**
- ✅ `DataSourceConfig.java` lo arregla automáticamente
- ✅ `application-supabase.properties` convertirá `postgresql://` a `jdbc:postgresql://`

Si aún falla:
1. Ve a OnRender → Environment
2. Verifica que `DATABASE_URL` comience con `postgresql://` (sin `jdbc:`)
3. La aplicación Spring lo convertirá automáticamente

---

## Error: CORS error desde Frontend

**Solución:**
1. Ve a OnRender → `labendicion-backend` → Environment
2. Verifica `CORS_ALLOWED_ORIGINS`
3. Debe ser exactamente: `https://labendicion-frontend.vercel.app`
4. Espera 2-3 minutos y recarga frontend

---

## Error: "Failed to connect to Supabase"

**Solución:**
1. Verifica que `PGUSER` es `postgres`
2. Verifica que `PGPASSWORD` es correcta
3. Verifica que `DATABASE_URL` tiene el puerto `:5432`
4. Prueba la conexión desde OnRender logs

---

## OnRender tarda mucho en desplegar

**Esto es normal:**
- Primera compilación: 5-10 minutos
- Subsecuentes: 2-3 minutos

Si lleva más de 15 minutos, revisa los logs para errores.

---

# URLs Finales

Una vez todo desplegado:

```
┌─────────────────────────────────────────────────────────┐
│ PROYECTO EN PRODUCCIÓN                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🌐 Frontend:                                            │
│    https://labendicion-frontend.vercel.app              │
│                                                         │
│ 🔌 Backend API:                                         │
│    https://labendicion-backend.onrender.com             │
│                                                         │
│ 📚 Swagger (Docs):                                      │
│    https://labendicion-backend.onrender.com/            │
│    swagger-ui.html                                      │
│                                                         │
│ 💚 Health Check:                                        │
│    https://labendicion-backend.onrender.com/            │
│    actuator/health                                      │
│                                                         │
│ 🗄️ Supabase:                                            │
│    https://app.supabase.com                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

# ¿Y Ahora Qué?

### Monitoreo Continuo:

1. **OnRender Logs:**
   - Revisa periódicamente para errores
   - Fija recursos si es necesario

2. **Vercel Analytics:**
   - Monitorea performance
   - Web Vitals

3. **Supabase Dashboard:**
   - Crea tablas según necesites
   - Monitorea uso de BD

### Auto-deployment:

- Cuando hagas `git push`, automáticamente:
  - GitHub notifica OnRender
  - GitHub notifica Vercel
  - Ambos redeploy

### Escalar:

- OnRender: Actualiza plan si es necesario
- Vercel: Automático con CDN global
- Supabase: Aumenta recursos de BD si es necesario

---

**¡Tu aplicación está en producción!** 🎉


