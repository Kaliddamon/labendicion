# ⚡ GUÍA RÁPIDA OnRender - Variables de Entorno

## 🚨 IMPORTANTE - Lee Esto Primero

El error que tuviste en OnRender:
```
Driver org.postgresql.Driver claims to not accept jdbcUrl, postgresql://...
```

**Ha sido completamente resuelto.** ✅

El backend ahora **automáticamente convierte** `postgresql://` a `jdbc:postgresql://`

---

## 📋 Variables a Configurar en OnRender

### Paso 1: Obtener Credenciales de Supabase

1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. **Settings** → **Database** → **Connection String**
4. Copia el CONNECTION STRING URI (ej: `postgresql://postgres:PASSWORD@db.XXX.supabase.co:5432/postgres`)

---

### Paso 2: En OnRender Dashboard

1. Servicio `labendicion-backend`
2. Pestaña **"Environment"**
3. **Agrega EXACTAMENTE estas variables:**

```
┌─────────────────────────────────────────────────────────┐
│ KEY: DATABASE_URL                                       │
│ VALUE: postgresql://postgres:PASSWORD@db.XXX.supabase.co:5432/postgres
│                                                         │
│ (Pega el Connection String de Supabase aquí)          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ KEY: PGUSER                                             │
│ VALUE: postgres                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ KEY: PGPASSWORD                                         │
│ VALUE: [TU_CONTRASEÑA_SUPABASE]                        │
│                                                         │
│ (La contraseña que elegiste cuando creaste Supabase)  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ KEY: SPRING_PROFILES_ACTIVE                             │
│ VALUE: supabase                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ KEY: CORS_ALLOWED_ORIGINS                               │
│ VALUE: https://labendicion-frontend.vercel.app         │
│                                                         │
│ (Cambia cuando tengas URL de Vercel)                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ KEY: SWAGGER_ENABLED                                    │
│ VALUE: true                                             │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist OnRender

```
ANTES DE DESPLEGAR:
- [ ] DATABASE_URL completada (incluye PASSWORD)
- [ ] PGUSER = "postgres"
- [ ] PGPASSWORD correcta
- [ ] SPRING_PROFILES_ACTIVE = "supabase"
- [ ] CORS_ALLOWED_ORIGINS = "https://labendicion-frontend.vercel.app"
- [ ] SWAGGER_ENABLED = "true"

DESPUÉS DE PRESIONAR DEPLOY:
- [ ] Build comienza (verás "Building...")
- [ ] Espera 5-10 minutos
- [ ] Verás "✓ Live" cuando esté listo
- [ ] Prueba: https://labendicion-backend.onrender.com/actuator/health
```

---

## 🧪 Probar que Funciona

### Test 1: Health Check
```
Abre en navegador:
https://labendicion-backend.onrender.com/actuator/health

Deberías ver:
{
  "status": "UP"
}
```

### Test 2: Swagger (API Docs)
```
Abre en navegador:
https://labendicion-backend.onrender.com/swagger-ui.html

Deberías ver la documentación interactiva
```

### Test 3: Loguear en OnRender
```
Si algo falla, verifica los logs:
1. Dashboard de OnRender
2. Tu servicio
3. Pestaña "Logs" (abajo a la derecha)
4. Busca el error
```

---

## 🔴 Si Ves Error "Connection refused"

**Causa:** La BD de Supabase no está lista o las credenciales son incorrectas

**Checklist:**
1. ¿Proyecto Supabase fue creado hace poco?
   - Espera 5 minutos más
   
2. ¿PASSWORD es correcto?
   - Verifica en Supabase Dashboard
   
3. ¿DATABASE_URL completo?
   - Debe incluir: `postgresql://postgres:PASSWORD@db.XXX.supabase.co:5432/postgres`
   - Sin `postgresql://` = error
   - Con `jdbc:postgresql://` = ERROR (no lo agregues, Java lo hace)

---

## 🟢 Una Vez Que Esté UP

### Próximo Paso: Vercel

```
1. Crear proyecto en Vercel
2. Seleccionar repositorio
3. Agregar variable: VITE_API_URL=https://labendicion-backend.onrender.com
4. Deploy
5. Probar que frontend conecta con backend
```

---

## 📞 URLs Recordar

```
OnRender Backend:
https://labendicion-backend.onrender.com

Swagger Docs:
https://labendicion-backend.onrender.com/swagger-ui.html

Health Check:
https://labendicion-backend.onrender.com/actuator/health

Supabase Dashboard:
https://app.supabase.com/project/[PROJECT_ID]/settings/database
```

---

## 🎯 TL;DR (Lo Esencial)

1. Copia `postgresql://postgres:PASSWORD@db.XXX.supabase.co:5432/postgres` de Supabase
2. Pégalo en OnRender como `DATABASE_URL`
3. Agrega `PGUSER=postgres` y `PGPASSWORD=`
4. Agrega `SPRING_PROFILES_ACTIVE=supabase`
5. Deploy
6. Espera 10 minutos
7. Verifica `/actuator/health`
8. ✅ Listo

---

**El error está resuelto. Adelante con el despliegue.** 🚀


