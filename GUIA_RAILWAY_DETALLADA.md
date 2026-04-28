# 🛤️ GUÍA DETALLADA: DESPLIEGUE EN RAILWAY

## Índice Rápido
- [Estructura de Railway](#estructura-de-railway)
- [Configuración Paso a Paso](#configuración-paso-a-paso)
- [Variables de Entorno](#variables-de-entorno)
- [Solución de Problemas](#solución-de-problemas)

---

## Estructura de Railway

Railway funciona con un modelo de **Proyectos → Servicios → Variables**

```
Proyecto: labendicion-backend
│
├── Servicio 1: PostgreSQL (Base de Datos)
│   └── Variables automáticas: DATABASE_URL, PGUSER, PGPASSWORD, etc.
│
└── Servicio 2: Spring Boot App (Tu API)
    └── Variables: SPRING_PROFILES_ACTIVE, DATABASE_URL, CORS, etc.
```

---

# CONFIGURACIÓN PASO A PASO

## FASE 1: Crear Proyecto en Railway

### Pantalla 1: Dashboard de Railway

**Qué verás:**
```
┌─────────────────────────────────────────────┐
│ Railway.app Dashboard                       │
├─────────────────────────────────────────────┤
│                                             │
│  Welcome, [Tu Nombre]                       │
│                                             │
│  [ + New Project ]  [ + Create from Git ]   │
│                                             │
│  Recent Projects: (vacío la primera vez)    │
│                                             │
└─────────────────────────────────────────────┘
```

**Tu Acción:**
1. Haz clic en **"+ New Project"** (o "+ Create from Git")

---

### Pantalla 2: Crear Nuevo Proyecto

**Qué verás:**
```
┌─────────────────────────────────────────────┐
│ New Project                                 │
├─────────────────────────────────────────────┤
│                                             │
│ Select template or create custom:           │
│                                             │
│ ○ Deploy from GitHub                        │
│ ○ Create New                    ← AQUÍ     │
│ ○ From Template                             │
│                                             │
│ Name your project:                          │
│ [__________________ ] labendicion-backend   │
│                                             │
│ [ Create ]                                  │
│                                             │
└─────────────────────────────────────────────┘
```

**Tu Acción:**
1. Selecciona **"Create New"**
2. En el campo de nombre, escribe: `labendicion-backend`
3. Haz clic en **"Create"**

**Resultado:** Ahora tienes un proyecto vacío

---

## FASE 2: Agregar Base de Datos PostgreSQL

### Pantalla 3: Proyecto Vacío

**Qué verás:**
```
┌──────────────────────────────────────────────────┐
│ labendicion-backend                              │
├──────────────────────────────────────────────────┤
│                                                  │
│ [ + New ]  [ Environment ]  [ Settings ]         │
│                                                  │
│ This project is empty                            │
│                                                  │
│ [ + Add Service ]  or  [ Deploy from GitHub ]    │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Tu Acción:**
1. Haz clic en **"+ Add Service"** (el grande con el +)

---

### Pantalla 4: Agregar Servicio

**Qué verás:**
```
┌──────────────────────────────────────────────────┐
│ Add Service                                      │
├──────────────────────────────────────────────────┤
│                                                  │
│ What do you want to add?                         │
│                                                  │
│ ┌──────────────┐  ┌──────────────┐               │
│ │ 🗄️  Database │  │ 🔧 Plugin    │               │
│ │              │  │              │               │
│ │ PostgreSQL   │  │              │               │
│ │ MySQL        │  │              │               │
│ │ MongoDB      │  │              │               │
│ │ Redis        │  │              │               │
│ └──────────────┘  └──────────────┘               │
│                                                  │
│ ┌──────────────┐  ┌──────────────┐               │
│ │ 🔗 GitHub    │  │ 📦 Other     │               │
│ │              │  │              │               │
│ │ Repo         │  │ (coming soon)│               │
│ └──────────────┘  └──────────────┘               │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Tu Acción:**
1. Haz clic en **"PostgreSQL"**

---

### Pantalla 5: PostgreSQL Agregada

**Qué verás:**
```
┌──────────────────────────────────────────────────┐
│ labendicion-backend                              │
├──────────────────────────────────────────────────┤
│                                                  │
│ [ + New ]                                        │
│                                                  │
│ ┌─────────────────────────────────────────────┐  │
│ │ 🐘 postgres                                 │  │
│ │                                             │  │
│ │ Status: ✅ Initializing (espera 1-2 min)   │  │
│ │ Deploy: -                                   │  │
│ │ Usage: Memory: 32MB, CPU: 0%                │  │
│ │                                             │  │
│ │ [ Settings ]  [ More ]                      │  │
│ └─────────────────────────────────────────────┘  │
│                                                  │
│ [ + Add Service ]                                │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Resultado:** PostgreSQL se está inicializando. Espera a que diga **"✅ Running"**

---

## FASE 3: Verificar Credenciales de Base de Datos

Una vez que PostgreSQL esté corriendo:

### Pantalla 6: Variables de PostgreSQL

**Tu Acción:**
1. Haz clic en la card de PostgreSQL
2. En el menú lateral derecho, verás **"Variables"**
3. Haz clic en **"Variables"**

**Qué verás:**
```
┌──────────────────────────────────────────────────┐
│ Variables: pg_database                           │
├──────────────────────────────────────────────────┤
│                                                  │
│ DATABASE_URL                                     │
│ ═══════════════════════════════════════════════  │
│ postgresql://postgres:abcd1234@                  │
│ exit.railway.internal:5432/railway              │
│                                                  │
│ PGHOST                    exit.railway.internal  │
│ PGPORT                    5432                   │
│ PGUSER                    postgres               │
│ PGPASSWORD                abcd1234 (aleatoria)   │
│ PGDATABASE                railway                │
│                                                  │
│ [ Copy ] buttons para cada variable             │
│                                                  │
└──────────────────────────────────────────────────┘
```

**⚠️ IMPORTANTE:** 
- La URL contiene "railway.internal" (esto es solo dentro de Railway)
- Para conexiones externas, usarás un dominio diferente
- Por ahora, **guarda con screenshot o copia a un archivo**

---

## FASE 4: Agregar Spring Boot App

### Desde el Proyecto Principal:

Tienes dos opciones:

**OPCIÓN A: Deploy desde GitHub (RECOMENDADO)**
```
1. Haz clic en [ + New ]
2. Selecciona "GitHub Repo"
3. Autoriza según lo pida
4. Selecciona: labendicion
5. Railway detecta automáticamente
6. Haz clic en [ Deploy ]
```

**OPCIÓN B: Cargar ZIP manualmente**
```
1. Haz clic en [ + New ]
2. Selecciona "Deploy a Docker image" o "Dockerfile"
3. Carga tu código (más complejo)
```

### Pantalla 7: Conectando GitHub

**Qué verás:**
```
┌──────────────────────────────────────────────────┐
│ Deploy from GitHub                               │
├──────────────────────────────────────────────────┤
│                                                  │
│ Select Repository                                │
│                                                  │
│ Most recent                                      │
│ ○ labendicion          ← Tu repositorio         │
│ ○ otro-proyecto                                  │
│                                                  │
│ [ labendicion ▼ ]                                │
│                                                  │
│ Auto-deploy from: [ main ▼ ]                     │
│                                                  │
│ [ Deploy ]                                       │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Tu Acción:**
1. Selecciona `labendicion`
2. Verifica rama es `main`
3. Haz clic en [ Deploy ]

---

### Pantalla 8: Deploy en Progreso

**Qué verás:**
```
┌──────────────────────────────────────────────────┐
│ Deployments                                      │
├──────────────────────────────────────────────────┤
│                                                  │
│ [Running] deployment iniciado a las 14:32       │
│ Building...     🔄                               │
│ Status: Queued → Building → Deploying            │
│                                                  │
│ Logs (en tiempo real):                           │
│ ────────────────────────────────────────         │
│ > Cloning repository...                          │
│ > Building with Nixpacks...                      │
│ > Building Spring Boot application...            │
│ > Running Maven build...                         │
│ ...                                              │
│                                                  │
│ Espera: Primera vez tarda 5-10 minutos          │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Qué Hacer:** Espera pacientemente hasta que veas ✅

---

## FASE 5: Configurar Variables de Entorno

Una vez que el Build esté completo:

### Pantalla 9: Servicio Desplegado

**Qué verás:**
```
┌──────────────────────────────────────────────────┐
│ labendicion-backend                              │
├──────────────────────────────────────────────────┤
│                                                  │
│ ┌─────────────────────────────────────────────┐  │
│ │ 🐘 postgres                                 │  │
│ │ Status: ✅ Running                          │  │
│ └─────────────────────────────────────────────┘  │
│                                                  │
│ ┌─────────────────────────────────────────────┐  │
│ │ 🍃 labendicion (tu app Spring Boot)         │  │
│ │ Status: ✅ Running                          │  │
│ │ URL: https://labendicion-prod.up.railway... │  │
│ │ Deployment: Latest #1 deployed 2 min ago    │  │
│ └─────────────────────────────────────────────┘  │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Tu Acción:**
1. Haz clic en la card de Spring Boot (labendicion)

---

### Pantalla 10: Configurar Variables

**Qué verás:**
```
┌──────────────────────────────────────────────────┐
│ labendicion                                      │
├──────────────────────────────────────────────────┤
│                                                  │
│ [ Deployments ]  [ Variables ]  [ Settings ]     │
│                       ↑ AQUÍ                     │
│                                                  │
│ Variables for this service:                      │
│                                                  │
│ [ + New Variable ]                               │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Tu Acción:**
1. Haz clic en [ + New Variable ]
2. Agrega cada variable (ver tabla abajo)

---

### Tabla: Variables a Configurar

En Railway, agrega estas Variables (copiar nombre exacto):

```
╔════════════════════════╦════════════════════════════════════════════╗
║ NOMBRE DE VARIABLE     ║ VALOR                                      ║
╠════════════════════════╬════════════════════════════════════════════╣
║ SPRING_PROFILES_ACTIVE ║ prod                                       ║
║                        ║                                            ║
║ DATABASE_URL           ║ (Conectado automáticamente de PostgreSQL) ║
║                        ║ Si no está, Railway lo vincula automático  ║
║                        ║ o cópialo de PostgreSQL                    ║
║                        ║                                            ║
║ CORS_ALLOWED_ORIGINS   ║ https://localhost:3000                     ║
║                        ║ (La cambiarás cuando despliegues Vercel)  ║
║                        ║ Por ahora: http://localhost:5173          ║
║                        ║ Vercel: https://labendicion.vercel.app    ║
║                        ║                                            ║
║ SWAGGER_ENABLED        ║ true                                       ║
║                        ║ (opcional, para ver docs en prod)         ║
╚════════════════════════╩════════════════════════════════════════════╝
```

---

### Cómo Agregar Variables:

**Pantalla 11: Agregar Variable**

```
┌──────────────────────────────────────────────────┐
│ Add Variable                                     │
├──────────────────────────────────────────────────┤
│                                                  │
│ Name                                             │
│ [_______________________]                        │
│ (ejemplo: SPRING_PROFILES_ACTIVE)                │
│                                                  │
│ Value                                            │
│ [_______________________]                        │
│ (ejemplo: prod)                                  │
│                                                  │
│ [ Add ]                                          │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Repetir para cada variable:**
1. Escribe el NOMBRE
2. Escribe el VALOR
3. Haz clic [ Add ]
4. Verás que aparece en la lista
5. Repite para la siguiente

---

## FASE 6: Verificar Setup

### Pantalla 12: Variables Configuradas

Cuando termines, verás algo así:

```
┌──────────────────────────────────────────────────┐
│ Variables                                        │
├──────────────────────────────────────────────────┤
│                                                  │
│ ✅ SPRING_PROFILES_ACTIVE = prod                 │
│ ✅ DATABASE_URL = (autolinkado)                  │
│ ✅ CORS_ALLOWED_ORIGINS = http://localhost:5173 │
│ ✅ SWAGGER_ENABLED = true                        │
│                                                  │
│ [ + Add More ]                                   │
│                                                  │
└──────────────────────────────────────────────────┘
```

Cuando cambies `CORS_ALLOWED_ORIGINS`, Railway rebooteará automáticamente. ✅

---

## FASE 7: Verificar que Funciona

### Probar Health Check:

**En tu navegador, abre:**
```
https://labendicion-prod.up.railway.app/actuator/health
```

**Deberías ver:**
```json
{
  "status": "UP"
}
```

Si ves esto ✅, tu backend está funcionando desde Railway.

---

## FASE 8: Obtener URL Final

**En la card del servicio, verás:**
```
🔗 URL: https://labendicion-prod.up.railway.app

(Puedes hacer clic para copiar)
```

**Guarda esta URL**. La necesitarás para Vercel.

---

# VARIABLES DE ENTORNO: Guía Completa

## Entendiendo las Variables

Railway vincula automáticamente PostgreSQL a tu app. Si tu código usa:

```java
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${PGUSER}
spring.datasource.password=${PGPASSWORD}
```

Railway inyecta automáticamente estos valores de PostgreSQL. ✅

## Vincular PostgreSQL Manualmente

Si por alguna razón no se vincula:

1. Ve a PostgreSQL → Variables
2. Copia el valor de `DATABASE_URL`
3. Ve a Spring Boot → Variables
4. Crea variable: `DATABASE_URL` = (el valor copiado)
5. Redeploy

---

# Solución de Problemas

## Error: "Build Failed"

**Síntomas:** Deploy rojo, dice "Failed"

**Causas Comunes:**
1. Falta `railway.json` en backend/
2. Falta `pom.xml`
3. Java no está configurada
4. Dependencias no resolvibles

**Solución:**
```bash
# En tu PC, verifica localmente:
cd backend
mvn clean compile

# Si funciona localmente, pero falla en Railway:
# - Verifica que railway.json existe
# - Verifica que está en la carpeta correcta
# - Haz git push para actualizar
# - Railway detectará y redeployará
```

---

## Error: "Connection Refused" desde Frontend

**Síntomas:** Frontend no puede contactar backend

**Causas:**
1. `CORS_ALLOWED_ORIGINS` no tiene la URL de Vercel
2. Backend no está realmente en `UP`
3. URL incorrecta en frontend

**Solución:**
1. Verifica CORS incluye URL de Vercel:
   ```
   https://labendicion.vercel.app
   ```
2. Verifica health check:
   ```
   https://labendicion-prod.up.railway.app/actuator/health
   ```
3. Si cambiaste CORS, espera 2 min y recarga

---

## Error: "Database Connection Failed"

**Síntomas:** Logs dicen error de DB

**Causas:**
1. PostgreSQL no está corriendo
2. `DATABASE_URL` no configurada
3. Credenciales incorrectas

**Solución:**
```
1. Ve a PostgreSQL card
2. Verifica Status: ✅ Running
3. Verifica variables DATABASE_URL, PGUSER, PGPASSWORD
4. En Spring Boot, verifica que DATABASE_URL está configurada
5. Redeploy
```

---

## Error: "Swagger no carga" en producción

**Síntomas:** 404 cuando intentas acceder /swagger-ui.html

**Causas:**
1. `SWAGGER_ENABLED` = false
2. URL incorrecta

**Solución:**
```
1. Variables → SWAGGER_ENABLED = true
2. Redeploy
3. Intenta: https://backend.up.railway.app/swagger-ui.html
```

---

# Monitoreo Post-Despliegue

## Dashboard de Railway

Después de desplegar, accede regularmente a:

**URL:** https://railway.app/dashboard

**Qué revisar:**
- [ ] Status: Ambos servicios en ✅ Running
- [ ] Logs: Sin errores rojo frecuentes
- [ ] Usage: RAM/CPU dentro de límites
- [ ] Billing: Sin sorpresas

---

# Redeploy / Actualizaciones

Cuando hagas cambios en el código:

```bash
# En tu PC:
git add .
git commit -m "Update: descripción"
git push

# Railway automáticamente:
# 1. Detecta el commit
# 2. Clona el repo
# 3. Rebuilda
# 4. Redeploya
# Tarda 3-5 minutos
```

---

# Cheatsheet: Comandos Railway CLI

Si instalas Railway CLI (opcional):

```bash
# Instalar
npm install -g @railway/cli

# Login
railway login

# Link proyecto
railway link

# Ver logs
railway logs

# Deploy manual
railway up

# Variables
railway variables list
```

---

**¡Tu backend está en Railway!** 🚀

Siguiente paso: Vercel para el Frontend (ver otra guía)

