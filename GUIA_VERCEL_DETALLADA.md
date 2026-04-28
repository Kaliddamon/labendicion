# 🚀 GUÍA DETALLADA: DESPLIEGUE EN VERCEL

## Índice Rápido
- [Estructura de Vercel](#estructura-de-vercel)
- [Configuración Paso a Paso](#configuración-paso-a-paso)
- [Variables de Entorno](#variables-de-entorno)
- [Build & Deploy](#build--deploy)
- [Troubleshooting](#troubleshooting)

---

## Estructura de Vercel

Vercel es más simple que Railway. Funciona así:

```
Tu Repositorio GitHub
         ↓
   Conectas con Vercel
         ↓
Vercel detecta: Vite + React
         ↓
Ejecuta: npm install + npm run build
         ↓
Sube dist/ a CDN Global
         ↓
Tu site está disponible en 🌍
```

---

# CONFIGURACIÓN PASO A PASO

## FASE 1: Crear Cuenta en Vercel

### Paso 1.1: Ir a Vercel

**Abre en tu navegador:**
```
https://vercel.com
```

---

### Pantalla 1: Landing de Vercel

**Qué verás:**
```
┌──────────────────────────────────────────────────┐
│                                                  │
│  Vercel                                          │
│  ===========================================      │
│                                                  │
│  The platform for frontend developers           │
│                                                  │
│  [ Sign Up ]  [ Log In ]                         │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Tu Acción:**
1. Haz clic en [ Sign Up ]

---

### Pantalla 2: Opciones de Signup

**Qué verás:**
```
┌──────────────────────────────────────────────────┐
│ Create Account                                   │
├──────────────────────────────────────────────────┤
│                                                  │
│ Selecciona tu opción:                            │
│                                                  │
│ [ 🐙 Continue with GitHub ]  ← RECOMENDADO     │
│ [ 🔵 Continue with GitLab ]                      │
│ [ 🟤 Continue with Bitbucket ]                   │
│ [ 📧 Email ]                                     │
│                                                  │
│ Already have an account? [ Log In ]              │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Tu Acción:**
1. Haz clic en [ 🐙 Continue with GitHub ]
2. GitHub te pedirá autorizar - haz clic [ Authorize Vercel ]
3. Verifica tu email (Vercel te enviará un link)

---

### Pantalla 3: Post-Signup

**Qué verás:**
```
┌──────────────────────────────────────────────────┐
│ Getting started                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│ ¿Qué quieres hacer?                              │
│                                                  │
│ [ Hobby ]  - Desarrollo personal                │
│ [ Pro ]    - Equipos y producción                │
│                                                  │
│ Selecciona Hobby para empezar                   │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Tu Acción:**
1. Selecciona [ Hobby ] (gratis para comenzar)

---

## FASE 2: Importar Proyecto desde GitHub

### Pantalla 4: Dashboard de Vercel

**Qué verás después de signup:**
```
┌──────────────────────────────────────────────────┐
│ Vercel Dashboard                                 │
├──────────────────────────────────────────────────┤
│                                                  │
│ Welcome back, [Tu Nombre]!                       │
│                                                  │
│ [ + Add New ]  [ Serch projects ]                │
│        ▼                                         │
│                                                  │
│ Recent Projects: (vacío)                         │
│                                                  │
│ Tutorials, documentation links...                │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Tu Acción:**
1. Haz clic en [ Add New ▼ ]
2. Selecciona [ Project ] (en el dropdown)

---

### Pantalla 5: Seleccionar Repositorio

**Qué verás:**
```
┌──────────────────────────────────────────────────┐
│ Create New Project                               │
├──────────────────────────────────────────────────┤
│                                                  │
│ Import Git Repository                            │
│                                                  │
│ Search your repositories...                      │
│ [📝 labendicion        ]  ← tu repo si aparece  │
│                                                  │
│ Recent repositories:                             │
│ ───────────────────────────────────────────────  │
│ ○ labendicion                                    │
│ ○ otro-proyecto                                  │
│                                                  │
│ O:                                               │
│ [ 🔗 Import Third-Party Git Repo ]               │
│   (si tienes URL de GitLab, Bitbucket, etc)     │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Tu Acción:**
1. Ve a los "Recent repositories"
2. Haz clic en **labendicion**

---

### Pantalla 6: Importar Confirmado

**Qué verás:**
```
┌──────────────────────────────────────────────────┐
│ Import Git Repository                            │
├──────────────────────────────────────────────────┤
│                                                  │
│ Repository Name:  labendicion                    │
│ Repository URL:   github.com/tu/labendicion      │
│ Owner:            Tu Usuario (Personal account)  │
│                                                  │
│ [ Import ]                                       │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Tu Acción:**
1. Haz clic en [ Import ]

---

## FASE 3: Configurar Build

### Pantalla 7: Configure Project

**Qué verás (IMPORTANTE):**
```
┌──────────────────────────────────────────────────┐
│ Configure Project                                │
├──────────────────────────────────────────────────┤
│                                                  │
│ PROJECT NAME:                                    │
│ [_________________________] labendicion         │
│                                                  │
│ ROOT DIRECTORY:                                  │
│ [_________________________] frontend             │
│ (detecta automáticamente)                        │
│                                                  │
│ FRAMEWORK PRESET:                                │
│ [_________________________] Vite                │
│ (detecta automáticamente)                        │
│                                                  │
│ BUILD COMMAND:                                   │
│ [_________________________]                      │
│ npm run build   (o sugiere automáticamente)     │
│                                                  │
│ OUTPUT DIRECTORY:                                │
│ [_________________________]                      │
│ dist            (correcto para Vite)            │
│                                                  │
│ INSTALL COMMAND:                                 │
│ [_________________________]                      │
│ `npm install`   (automático)                     │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Verifica que:**
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Framework: Vite
- ✅ Root Directory: `frontend`

**Si los detectó bien, puedes dejar todo así.**

---

## FASE 4: Configurar Variables de Entorno

### En la Misma Pantalla (Desplázate Abajo)

**Qué verás:**
```
┌──────────────────────────────────────────────────┐
│ Environment Variables                            │
├──────────────────────────────────────────────────┤
│                                                  │
│ Add Environment Variables (optional)             │
│                                                  │
│ NAME:  [ VITE_API_URL________________ ]         │
│                                                  │
│ VALUE: [ https://backend.up.railway.app ]       │
│        (reemplaza con tu URL de Railway)        │
│                                                  │
│ [ + Add ]                                        │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Tu Acción:**
1. Haz clic en el campo NAME
2. Escribe: `VITE_API_URL`
3. Haz clic en el campo VALUE
4. Escribe: `https://tu-backend.up.railway.app` (la que guardaste de Railway)
5. Haz clic en [ + Add ]

**Resultado:** Verás la variable agregada

---

### Pantalla 8: Variables Configuradas

```
┌──────────────────────────────────────────────────┐
│ Environment Variables                            │
├──────────────────────────────────────────────────┤
│                                                  │
│ ✅ VITE_API_URL = https://labendicion-prod...   │
│                                                  │
│ These variables are available for build         │
│                                                  │
│ [ + Add ]                                        │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## FASE 5: Deploy

### Pantalla 9: Deploy Button

**Qué verás (final de la pantalla):**
```
┌──────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│                     [ Deploy ]                   │
│                                                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Tu Acción:**
1. Desplázate hasta el fondo
2. Haz clic en [ Deploy ]

---

## FASE 6: Esperando Deployment

### Pantalla 10: Deploy Progress

**Qué verás (se actualiza en tiempo real):**
```
┌──────────────────────────────────────────────────┐
│ Deploying... labendicion                         │
├──────────────────────────────────────────────────┤
│                                                  │
│ 🔄 Building Project... (1/3)                     │
│    Cloning repository                            │
│    Installing dependencies                       │
│    Building application                          │
│    Generating source maps                        │
│                                                  │
│ Progress: ████████░░░░░░░░░░  50%               │
│                                                  │
│ Logs (en tiempo real):                           │
│ > npm install                                    │
│ > npm run build                                  │
│ > vite build                                     │
│ ...                                              │
│                                                  │
│ Tiempo estimado: 2-5 minutos                     │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Espera pacientemente...**

---

### Cuando Termina (EXITOSO)

**Pantalla 11: Deployment Success**

```
┌──────────────────────────────────────────────────┐
│ 🎉 Congratulations!                              │
├──────────────────────────────────────────────────┤
│                                                  │
│ Your project has been successfully deployed     │
│                                                  │
│ https://labendicion.vercel.app                   │
│ ────────────────────────────────────────────── │
│                                                  │
│ ✅ Production                                    │
│    URL: ^ (copia arriba)                         │
│    Last Commit: [hash]                           │
│    Deployed by: [Tu nombre]                      │
│                                                  │
│ NEXT STEPS:                                      │
│ [ 👀 View Project ]  [ 📊 Analytics ]             │
│ [ 🔧 Settings ]      [ 📖 Docs ]                 │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Tu Acción:**
1. Haz clic en [ 👀 View Project ] para ver tu site
2. O simplemente abre en el navegador:
   ```
   https://labendicion.vercel.app
   ```

---

## FASE 7: Verificar que Funciona

### Probar Frontend

**Abre en tu navegador:**
```
https://labendicion.vercel.app
```

**Verás:**
- ✅ Tu aplicación React cargada
- ✅ Sin errores 404 (gracias a rewrites en vercel.json)
- ✅ Funcionalidad trabajando

---

### Verificar Conexión con Backend

**Abre Console (F12) en tu navegador:**
1. Presiona F12
2. Ve a pestaña "Console"
3. Mira si hay errores CORS (habrá si CORS no está configurado)
4. Si no hay errores, ¡funciona! ✅

---

## FASE 8: Obtener URL Final

**En el Dashboard de Vercel:**

```
┌──────────────────────────────────────────────────┐
│ labendicion                                      │
├──────────────────────────────────────────────────┤
│                                                  │
│ Domains                                          │
│ labendicion.vercel.app   ← Tu URL                │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Guarda esta URL** para actualizar CORS en Railway.

---

# VARIABLES DE ENTORNO: Guía Completa

## ¿Por qué VITE_API_URL?

En tu código React, necesitas conectar con el backend:

```javascript
// En un archivo de configuración o servicio:
const API_BASE_URL = import.meta.env.VITE_API_URL;

// En tus llamadas:
const response = await fetch(`${API_BASE_URL}/api/empresas`);
```

Vercel reemplaza `VITE_API_URL` con el valor que configuraste. ✅

---

## Variables por Entorno

### Desarrollo (Local)
```javascript
// Tu archivo .env.local (en frontend/)
VITE_API_URL=http://localhost:8080
```

### Producción (Vercel)
```
VITE_API_URL=https://labendicion-prod.up.railway.app
(la que configuraste en Vercel)
```

---

# Build & Deploy

## Auto-Deploy

Cuando hagas push a GitHub, Vercel automáticamente:

```
1. Detecta el commit
2. Clona el repo
3. npm install
4. npm run build
5. Sube dist/ a CDN
6. Tu site actualizado ✅
```

Tarda 2-5 minutos.

---

## Redeploy Manual

Si necesitas redeployar sin cambios:

**En el Dashboard de Vercel:**
1. Ve a tu proyecto
2. Haz clic en [ ... ] (Deployments)
3. Selecciona el último deployment
4. Haz clic en [ Redeploy ]

---

## Rollback a Versión Anterior

Si algo se rompió:

**En Deployments:**
1. Mira la lista de despliegues pasados
2. Haz clic en uno anterior que funcionaba
3. Haz clic en [ Promote to Production ]
4. Tu site vuelve a esa versión

---

# Troubleshooting

## Problema 1: "Build Failed" en Vercel

**Qué ves:**
```
Build failed:
Error: command not found: npm
```

**Causas:**
1. Falta package.json
2. Root directory incorrecto
3. Node.js version incompatible

**Solución:**
```
1. Ve a Settings → General
2. Verifica Node.js Version (debe ser 18+)
3. Verifica Root Directory = frontend/
4. Redeploy
```

---

## Problema 2: "404 Not Found" al cargar

**Qué ves:** Después de build exitoso, página 404

**Causas:** Falta vercel.json o mal configurado

**Solución:**
```
Verifica que en raíz de frontend/ existe vercel.json con:

{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Problema 3: "Cannot GET /api/..."

**Qué ves:** API calls fallan

**Causas:**
1. Backend no está up
2. VITE_API_URL incorrecta
3. CORS error

**Solución:**
```
1. Verifica backend en Railway: /actuator/health
2. Verifica VITE_API_URL en Vercel es correcto
3. Verifica CORS en Railway incluye vercel.app
4. Espera 2 min después de cambiar CORS
5. Redeploy frontend
```

---

## Problema 4: "CORS error" en Console

**Qué ves en F12 Console:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Causas:** CORS_ALLOWED_ORIGINS en Railway no incluye vercel.app

**Solución:**
```
1. Ve a Railway
2. Spring Boot → Variables
3. CORS_ALLOWED_ORIGINS debe incluir:
   https://labendicion.vercel.app
4. Redeploy railway
5. Espera 2-3 min y recarga frontend
```

---

## Problema 5: "Maximum deployment timeout"

**Qué ves:** Deployment tarda más de 10 min y cancela

**Causas:**
1. Build muy lento (dependencias muchas)
2. Problemas de red
3. Recursos limitados

**Solución:**
```
1. Intenta redeploy manual
2. Considera optimizar bundle (future)
3. Contacta soporte Vercel si persiste
```

---

# Monitoreo Post-Despliegue

## Dashboard de Vercel

Después de desplegar, accede a:

**URL:** https://vercel.com/dashboard

**Qué revisar:**
- [ ] Status: Green (despliegue exitoso)
- [ ] Analytics: No hay 5xx errors
- [ ] Performance: Time to Interactive < 3s
- [ ] Deployments: Última es reciente

---

## Analytics

En el Dashboard de cada proyecto:

```
┌──────────────────────────────────────────────────┐
│ Analytics                                        │
├──────────────────────────────────────────────────┤
│                                                  │
│ Core Web Vitals                                  │
│ ───────────────────────────────────────────────  │
│ Largest Contentful Paint (LCP): 1.2s    ✅      │
│ First Input Delay (FID): 50ms           ✅      │
│ Cumulative Layout Shift (CLS): 0.05     ✅      │
│                                                  │
│ Response Time (Average)                          │
│ 200ms (from SF)                                  │
│                                                  │
│ ✅ Excelente rendimiento                         │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

# Dominios Personalizados (Opcional)

Si quieres tu propio dominio (ej: labendicion.com):

**En Settings:**
1. Me voy a Domains
2. Haz clic en [ Add ]
3. Ingresa tu dominio: `labendicion.com`
4. Sigue instrucciones para DNS (cambia registrador)
5. Espera propagación (5-48 horas)

---

# Cheatsheet: URLs Importantes

**Después de desplegar ambas plataformas:**

```
Frontend (Vercel):
https://labendicion.vercel.app

Backend API (Railway):
https://labendicion-prod.up.railway.app

Swagger Docs:
https://labendicion-prod.up.railway.app/swagger-ui.html

Healthcheck:
https://labendicion-prod.up.railway.app/actuator/health
```

---

# Seguridad: Proteger tu Sitio

## Environment Secrets

NUNCA hardcodees:
- ❌ API keys
- ❌ Contraseñas
- ❌ URLs sensitivas

SIEMPRE usa variables de entorno. Vercel las oculta. ✅

---

# Performance Tips

Son opcionales, pero recomendados:

```javascript
// Lazy load componentes
const HeavyComponent = lazy(() => import('Component'));

// Code splitting
import.meta.glob('./components/*.jsx')

// Image optimization
<Image src={} alt={} width={} height={} />
```

---

**¡Tu frontend está en Vercel!** 🎉

Próximo paso: Integración y testing (ver guía principal)

