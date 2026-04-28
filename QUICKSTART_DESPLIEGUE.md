# ⚡ QUICK START: DESPLIEGUE EN 10 MINUTOS

**Para usuarios que quieren ir RÁPIDO sin toda la guía detallada.**

---

# ANTES DE EMPEZAR

✅ Tienes cuenta en GitHub, Railway.app y Vercel.com
✅ Tu código está en GitHub
✅ GitHub token creado (si es necesario)

---

# PASO 1: Push a GitHub (1 min)

```bash
cd C:\Users\CRIST\Desktop\labendicion

git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/labendicion.git
git branch -M main
git push -u origin main
```

---

# PASO 2: Railway Backend + DB (3 minutos)

## 2.1: Crear Proyecto
1. Ve a https://railway.app
2. [ + New Project ]
3. Nombre: `labendicion-backend`
4. [ Create ]

## 2.2: Agregar PostgreSQL
1. [ + Add Service ]
2. [ PostgreSQL ]
3. Espera a que esté Running ✅

## 2.3: Agregar Spring Boot
1. [ + New ]
2. [ GitHub Repo ]
3. Selecciona `labendicion`
4. [ Deploy ]
5. Espera a que diga "Success" ✅ (5-10 min)

## 2.4: Configurar Variables
En el servicio Spring Boot:

```
SPRING_PROFILES_ACTIVE    → prod
CORS_ALLOWED_ORIGINS      → http://localhost:5173
SWAGGER_ENABLED           → true
DATABASE_URL              → (automáticmente desde PostgreSQL)
```

## 2.5: Copiar URL
Cuando Build = Success, copia la URL:
```
https://labendicion-xxx.up.railway.app
```
Guarda para Vercel.

---

# PASO 3: Vercel Frontend (2 minutos)

## 3.1: Importar Proyecto
1. Ve a https://vercel.com
2. [ Add New ] → [ Project ]
3. Selecciona `labendicion` de GitHub
4. [ Import ]

## 3.2: Configurar Build (automático)
Vercel detecta:
- Framework: Vite ✅
- Build Command: npm run build ✅
- Output: dist ✅

## 3.3: Agregar Variables
```
VITE_API_URL → https://labendicion-xxx.up.railway.app
              (la URL de Railway que copiaste)
```

## 3.4: Deploy
1. [ Deploy ]
2. Espera a ver "Congratulations!" ✅ (2-5 min)
3. Copia la URL:
```
https://labendicion.vercel.app
```

---

# PASO 4: Actualizar CORS (1 min)

De vuelta en Railway:

1. Servicio Spring Boot → Variables
2. CORS_ALLOWED_ORIGINS → Cambia a:
```
https://labendicion.vercel.app,https://localhost:3000
```
3. Guarda (auto-redeploy)

---

# PASO 5: Verificar (1 min)

## Healthcheck Backend
```
https://labendicion-xxx.up.railway.app/actuator/health

Deberías ver: {"status":"UP"}
```

## Verificar Frontend
```
Abre: https://labendicion.vercel.app

Deberías ver: Tu app sin errores
```

## Probar Swagger
```
https://labendicion-xxx.up.railway.app/swagger-ui.html

Deberías ver: API documentation
```

---

# LISTO! 🎉

| Componente | URL | Status |
|-----------|-----|--------|
| Frontend | https://labendicion.vercel.app | 🟢 Live |
| Backend | https://labendicion-xxx.up.railway.app | 🟢 Live |
| DB | PostgreSQL en Railway | 🟢 Live |

---

# Si Algo Sale Mal

| Problema | Fix |
|----------|-----|
| Build falla | Ver logs en Vercel/Railway |
| CORS error | Actualizar CORS_ALLOWED_ORIGINS en Railway |
| Backend no responde | Verificar PostgreSQL está UP en Railway |
| Frontend 404 | Verificar vercel.json existe en frontend/ |
| API no funciona | Verificar VITE_API_URL es correcto en Vercel |

---

# Próximas Actualizaciones

Cuando hagas cambios:
```bash
git add .
git commit -m "Update: descripción"
git push

# Auto-deploy en Railway y Vercel (5 min)
```

---

**¿Necesitas Ayuda?**

Ver archivos detallados:
- GUIA_DESPLIEGUE_RAILWAY_VERCEL.md (paso a paso completo)
- GUIA_RAILWAY_DETALLADA.md (Railway con screenshots)
- GUIA_VERCEL_DETALLADA.md (Vercel con screenshots)

