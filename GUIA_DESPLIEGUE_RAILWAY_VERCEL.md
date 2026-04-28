# 🚀 GUÍA COMPLETA DE DESPLIEGUE - Railway + Vercel

## Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Parte 1: Preparación del Código](#parte-1-preparación-del-código)
3. [Parte 2: Despliegue en Railway (Backend + BD)](#parte-2-despliegue-en-railway)
4. [Parte 3: Despliegue en Vercel (Frontend)](#parte-3-despliegue-en-vercel)
5. [Parte 4: Integración y Testing](#parte-4-integración-y-testing)

---

# Requisitos Previos

Antes de comenzar, necesitas:

- ✅ Cuenta en [Railway.app](https://railway.app)
- ✅ Cuenta en [Vercel.com](https://vercel.com)
- ✅ Repositorio en [GitHub.com](https://github.com) (público o privado)
- ✅ Git instalado en tu PC
- ✅ Node.js + npm
- ✅ Java + Maven

**Tiempo total estimado:** 1-2 horas

---

# PARTE 1: Preparación del Código

## Paso 1.1: Crear Repositorio en GitHub

### En GitHub.com:

1. Inicia sesión en GitHub
2. Haz clic en **"+"** (arriba a la derecha) → **"New repository"**
3. Nombre: `labendicion` (o el que prefieras)
4. Descripción: "Sistema de gestión para microempresa textil"
5. Selecciona: **Public** (para facilitar deploy) o **Private**
6. Haz clic en **"Create repository"**
7. GitHub te mostrará instrucciones. **Copia el URL HTTPS** (ejemplo: `https://github.com/tunombre/labendicion.git`)

---

## Paso 1.2: Pushear Código a GitHub

### En tu PC (Terminal):

```bash
# Navega a la carpeta del proyecto
cd C:\Users\CRIST\Desktop\labendicion

# Inicializa git si no está inicializado
git init

# Agrega todos los archivos
git add .

# Commit con mensaje
git commit -m "Initial commit: labendicion sistema de gestión textil"

# Agrega el remote (reemplaza URL con la tuya)
git remote add origin https://github.com/TU_USUARIO/labendicion.git

# Push a GitHub
git branch -M main
git push -u origin main
```

**Resultado esperado:** ✅ Código ahora está en GitHub

---

## Paso 1.3: Verificar que Todo está Listo

```bash
# Verifica que los builds funcionan localmente
cd C:\Users\CRIST\Desktop\labendicion\backend
mvn clean package -DskipTests

cd ..\frontend
npm run build

# Ambos deberían completar sin errores ✅
```

---

# PARTE 2: Despliegue en Railway

## Panorama General de Railway

```
Tu GitHub → Railway (conecta repo) → Auto deploy 
                              ↓
                    PostgreSQL (BD)
                    Spring Boot App (API)
```

---

## Paso 2.1: Crear Cuenta y Proyecto en Railway

### En Railway.app:

1. Ve a https://railway.app
2. Haz clic en **"Get Started"** (o Sign Up si no tienes cuenta)
3. Usa GitHub para login (es más fácil)
4. Autoriza que Railway acceda a tu GitHub
5. Te llevará al dashboard

---

## Paso 2.2: Crear Proyecto Nuevo

### En el Dashboard de Railway:

1. Haz clic en **"+ New Project"**
2. Selecciona **"Create New"** (no "Deploy from GitHub yet")
3. Dale un nombre: `labendicion-backend`
4. Haz clic en **"Create"**

**Resultado:** Tendrás un proyecto vacío en Railroad

---

## Paso 2.3: Agregar Base de Datos PostgreSQL

### Dentro del Proyecto:

1. Haz clic en **"+ Add Service"** (o el botón + grande)
2. En el modal que aparece, selecciona **"Database"**
3. Selecciona **"PostgreSQL"**
4. Railway lo agregará automáticamente

**Resultado:** Verás PostgreSQL en tu proyecto de Railway

---

## Paso 2.4: Configurar la Base de Datos

### En la Card de PostgreSQL:

1. Haz clic en la card de PostgreSQL
2. Ve a la pestaña **"Variables"** (abajo o en el menú)
3. Verás variables automáticas:
   - `DATABASE_URL` = URL de conexión
   - `PGUSER` = Usuario (default: postgres)
   - `PGPASSWORD` = Contraseña (auto-generada)
   - `PGHOST` = Host
   - `PGPORT` = 5432

**Importante:** Guarda estos valores o haz screenshot, los necesitarás

---

## Paso 2.5: Crear Servicio para la Aplicación Spring Boot

### De Vuelta al Proyecto:

1. Haz clic nuevamente en **"+ Add Service"**
2. Selecciona **"GitHub Repo"** o **"Deploy from GitHub"**
3. Autoriza si te lo pide
4. Busca tu repositorio: `labendicion`
5. Selecciona la rama: **main**
6. Haz clic en **"Deploy"**

**Resultado:** Railway detecta el proyecto y comienza a construir

---

## Paso 2.6: Configurar Variables de Entorno

### En el Nuevo Servicio de Spring Boot:

1. Haz clic en el servicio (no PostgreSQL, el otro)
2. Ve a la pestaña **"Variables"**
3. Haz clic en **"New Variable"** para agregar cada una:

**Agregar estas variables:**

```
Variable                 Valor
─────────────────────────────────────────────────────────────
SPRING_PROFILES_ACTIVE   prod

DATABASE_URL             (cópiala de PostgreSQL - verás algo como)
                         postgresql://user:pass@host:port/dbname

PGUSER                   postgres

PGPASSWORD               (la contraseña auto-generada de Railway)

CORS_ALLOWED_ORIGINS     https://tu-frontend.vercel.app
                         (la cambiarás después de crear Vercel)

SWAGGER_ENABLED          true
```

**IMPORTANTE:** La variable `DATABASE_URL` está vinculada automáticamente si conectaste PostgreSQL. Si no aparece:
- Ve al servicio PostgreSQL
- Copia el valor de `DATABASE_URL`
- Pégalo en el servicio Spring Boot

---

## Paso 2.7: Verificar el Build

### En el Dashboard:

1. Ve a la pestaña **"Deployments"** del servicio Spring Boot
2. Verás un despliegue en progreso (la primera vez tarda 3-5 min)
3. Espera a que cambie a **"✓ Success"** (verde)

**Si falla:**
- Haz clic en el deployment fallido
- Lee los logs (abajo)
- Busca el error específico

---

## Paso 2.8: Obtener la URL del Backend

### Una Vez que Deploy sea Exitoso:

1. Haz clic en el servicio Spring Boot
2. Ve a la pestaña **"Settings"**
3. Busca **"Domain"** - verás algo como:
   ```
   https://labendicion-production.up.railway.app
   ```
4. **Guarda esta URL** - la necesitarás para Vercel

---

## Paso 2.9: Probar que el Backend Funciona

### Desde tu Navegador:

```
Abre:
https://labendicion-production.up.railway.app/actuator/health

Deberías ver:
{
  "status": "UP"
}
```

Si lo ves, ¡tu backend está funcionando! ✅

---

# PARTE 3: Despliegue en Vercel

## Panorama General de Vercel

```
Tu GitHub → Vercel (conecta repo) → Auto deploy
                              ↓
                    React App en CDN Global
```

---

## Paso 3.1: Crear Cuenta en Vercel

### En Vercel.com:

1. Ve a https://vercel.com
2. Haz clic en **"Sign Up"**
3. Usa GitHub (es lo más fácil)
4. Autoriza que Vercel acceda a tu GitHub
5. Te pedirá confirmación por email (verifica)

---

## Paso 3.2: Importar Proyecto desde GitHub

### En el Dashboard de Vercel:

1. Haz clic en **"Add New"** → **"Project"**
2. Busca tu repositorio: `labendicion`
3. Haz clic en **"Import"**

---

## Paso 3.3: Configurar el Proyecto

### En la Pantalla de Configuración:

1. **Project Name:** `labendicion` (o lo que prefieras)
2. **Framework:** Vercel debería detectar Vite automáticamente
3. **Root Directory:** Deja en blanco (Vercel lo detectará como `frontend/`)
4. **Build Command:** Deja el que sugiere Vercel (probablemente `npm run build`)
5. **Output Directory:** `dist`

---

## Paso 3.4: Configurar Variables de Entorno del Frontend

### En la Sección "Environment Variables":

Necesitas agregar la URL de tu backend:

```
Nome:  VITE_API_URL
Value: https://labendicion-production.up.railway.app
       (la URL que guardaste de Railway)
```

**¿Por qué?** Tu frontend React necesita saber dónde está el backend.

---

## Paso 3.5: Deploy

### Haz clic en **"Deploy"**

Vercel comenzará:
1. Clonar el repo de GitHub
2. Instalar dependencias (`npm install`)
3. Construir el proyecto (`npm run build`)
4. Subir a su CDN global

**Tiempo:** 2-5 minutos para la primera vez

---

## Paso 3.6: Obtener URL del Frontend

### Una Vez que Deploy sea Exitoso:

1. Verás una pantalla con ✅ "Congratulations!"
2. Tu URL será algo como:
   ```
   https://labendicion.vercel.app
   ```
3. **Guarda esta URL**

---

## Paso 3.7: Actualizar CORS en Railway

### Vuelve a Railway:

1. Ve al servicio Spring Boot
2. Variables → `CORS_ALLOWED_ORIGINS`
3. Cambia el valor por:
   ```
   https://labendicion.vercel.app
   ```
4. **Guarda/Deploy** de nuevo

**Esto permite que el frontend acceda al backend sin errores CORS**

---

# PARTE 4: Integración y Testing

## Paso 4.1: Probar Conectividad Fronted-Backend

### Desde tu Navegador:

1. Abre: https://labendicion.vercel.app
2. Abre la Consola (F12 → Pestaña "Console")
3. Verifica que NO hay errores de CORS
4. La app debería cargarse normalmente

---

## Paso 4.2: Probar API desde Swagger

### Desde tu Navegador:

1. Abre: `https://labendicion-production.up.railway.app/swagger-ui.html`
2. Verás la documentación de Swagger
3. Prueba un endpoint simple, ejemplo:
   - GET `/api/empresas`
   - Haz clic en "Try it out"
   - Haz clic en "Execute"
4. Deberías recibir una respuesta (probablemente un array vacío [])

---

## Paso 4.3: Crear Datos de Prueba

### Desde Swagger:

1. Busca POST `/api/empresas`
2. Haz clic en "Try it out"
3. Completa el JSON:
   ```json
   {
     "nombre": "Mi Primera Empresa",
     "email": "empresa@test.com",
     "telefono": "3001234567",
     "direccion": "Cra 1 #1",
     "nit": "900123456-7",
     "contactoPersona": "Juan Pérez"
   }
   ```
4. Haz clic en "Execute"
5. Deberías recibir un 200 OK con el objeto creado

---

## Paso 4.4: Consumir API desde el Frontend

### En tu Código React (si tienes llamadas API):

Asegúrate de que usas la variable de entorno:

```javascript
// En tu archivo de configuración o servicio:
const API_URL = import.meta.env.VITE_API_URL;

// En tus fetch/axios calls:
const response = await fetch(`${API_URL}/api/empresas`);
```

---

# CHECKLIST DE VERIFICACIÓN FINAL

```
═══════════════════════════════════════════════════════════

ENTORNO LOCAL
✅ Backend: mvn clean install
✅ Frontend: npm run build
✅ JAR generado: target/*.jar
✅ Dist folder generado: dist/

GITHUB
✅ Repositorio creado
✅ Código pusheado
✅ Rama main actualizada

RAILWAY (Backend + BD)
✅ Proyecto creado
✅ PostgreSQL agregada
✅ Spring Boot conectado
✅ Variables de entorno configuradas
✅ Database activa
✅ Health check funciona (/actuator/health)
✅ URL backend guardada

VERCEL (Frontend)
✅ Proyecto creado
✅ Repositorio conectado
✅ Build configurado
✅ Variables VITE_API_URL configuradas
✅ Deploy exitoso
✅ URL frontend guardada

INTEGRACIÓN
✅ Frontend carga sin errores
✅ Frontend puede alcanzar backend (sin CORS errors)
✅ Swagger accesible desde backend
✅ API responde correctamente
✅ CORS habilitado correctamente

═══════════════════════════════════════════════════════════
```

---

# Troubleshooting: Problemas Comunes

## Problema 1: "CORS error" desde Frontend

**Síntomas:** Frontend no puede contactar backend, error en console

**Solución:**
1. Ve a Railway → Spring Boot → Variables
2. Verifica que `CORS_ALLOWED_ORIGINS` contenga tu URL de Vercel
3. Redeploy (Railway lo hace automáticamente al cambiar variables)
4. Espera 2-3 minutos
5. Recarga el frontend

---

## Problema 2: "Connection refused" desde Frontend

**Síntomas:** Frontend intenta conectar pero no alcanza backend

**Solución:**
1. Verifica que `VITE_API_URL` sea correcto en Vercel
2. Verifica que el backend esté up: `https://tu-backend.up.railway.app/actuator/health`
3. Revisa logs en Railway para errores

---

## Problema 3: Build de Frontend falla en Vercel

**Síntomas:** Deploy rojo/fallido

**Solución:**
1. Haz clic en el deployment fallido
2. Lee los logs
3. 90% de veces es por falta de variables de entorno
4. Agrega variables faltantes
5. Redeploy automáticamente

---

## Problema 4: Build de Backend falla en Railway

**Síntomas:** Deploy rojo/fallido, no compila

**Solución:**
1. Verifica que tienes `railway.json` en raíz del backend
2. Verifica que `pom.xml` está presente
3. Revisa logs en Railway
4. Intenta un commit/push nuevo

---

# Checklist de URLs Importantes

Una vez desplegado, guarda estas URLs:

```
┌─────────────────────────────────────────────────────────┐
│ URLS DEL PROYECTO EN PRODUCCIÓN                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🌐 Frontend:                                            │
│    https://labendicion.vercel.app                       │
│                                                         │
│ 🔌 Backend API:                                         │
│    https://labendicion-production.up.railway.app        │
│                                                         │
│ 📚 Swagger (Documentación API):                         │
│    https://labendicion-production.up.railway.app/       │
│    swagger-ui.html                                      │
│                                                         │
│ 💚 Health Check:                                        │
│    https://labendicion-production.up.railway.app/       │
│    actuator/health                                      │
│                                                         │
│ 📊 API Docs (JSON):                                     │
│    https://labendicion-production.up.railway.app/       │
│    api-docs                                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

# Dashboards para Monitoreo

Después de desplegar, estas son tus áreas de control:

## Railway Dashboard
- URL: https://railway.app/dashboard
- Ver: Logs, métricas, variables, costos
- Acción: Redeploy, rollback, escalar

## Vercel Dashboard
- URL: https://vercel.com/dashboard
- Ver: Despliegues, analytics, performance
- Acción: Redeploy, configuración

---

# ¿Y Ahora Qué?

### Próximos pasos después del despliegue inicial:

1. **Monitorear:** Revisa logs periódicamente
2. **Backups:** Railway hace backups automáticos
3. **Performance:** Vercel muestra métricas en analytics
4. **Updates:** Cuando hagas push a GitHub, auto-deploy
5. **Escalar:** Si crece, aumenta recursos en Railway

---

# Comandos Rápidos de Referencia

```bash
# Si necesitas redeploy manual desde tu PC:
git add .
git commit -m "Update: descripción del cambio"
git push

# Railway y Vercel detectarán el push y redeployarán automáticamente

# Para verificar estado local:
cd backend && mvn clean compile
cd ../frontend && npm run build

# Para ver logs en Railway (si tienes Railway CLI):
railway logs
```

---

**¡Listo! Tu proyecto está en producción.** 🎉

¿Tienes dudas de algún paso? Revisa la sección de Troubleshooting.

