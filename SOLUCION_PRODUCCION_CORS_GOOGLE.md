# 🔧 Solución: Error CORS + Google OAuth (Producción)

## El Problema

Tu app está en **producción**:
- Frontend: `https://labendicion-beta.vercel.app`
- Backend: `https://labendicion-be.onrender.com`

Pero no están configurados para comunicarse entre sí.

---

## ✅ Solución Paso a Paso

### Paso 1: Actualizar Backend (CORS)

**Ya lo hice por ti.** Agregué `https://labendicion-beta.vercel.app` a la whitelist CORS.

**Ahora debes:**
1. Hacer push a GitHub:
```bash
cd backend
git add -A
git commit -m "Fix: Add CORS origin for vercel-beta"
git push
```

2. Render recompilará automáticamente
3. Espera ~2-3 minutos a que termine el deploy

---

### Paso 2: Registrar Origen en Google Cloud Console

El error de Google dice:
```
The given origin is not allowed for the given client ID.
```

**Significa:** `https://labendicion-beta.vercel.app` NO está registrado.

#### 🔹 Ve a Google Cloud Console:
https://console.cloud.google.com

#### 🔹 Selecciona tu proyecto

Arriba a la izquierda → Selector de proyectos → Selecciona tu proyecto

#### 🔹 Ve a Credenciales

Menú lateral → APIs y Servicios → Credenciales

#### 🔹 Edita tu Aplicación OAuth2

1. Busca una entrada tipo "Aplicación web"
2. Haz clic en el nombre para editar
3. O haz clic en el icono ✏️

#### 🔹 Sección: "Orígenes de JavaScript autorizados"

Debes agregar:
```
https://labendicion-beta.vercel.app
```

**Debe quedar así:**
```
✓ http://localhost:5173
✓ http://localhost:5174
✓ https://labendicion.vercel.app
✓ https://labendicion-beta.vercel.app  ← AGREGAR ESTO
```

#### 🔹 Sección: "URIs de redirección autorizados"

Agrega:
```
https://labendicion-beta.vercel.app
```

#### 🔹 Haz clic en "Guardar"

---

### Paso 3: Actualizar Vercel con el Client ID

Ve a tu proyecto en Vercel:
1. Settings → Environment Variables
2. Busca `VITE_GOOGLE_CLIENT_ID`
3. Verifica que sea el Client ID correcto (debe terminar en `.apps.googleusercontent.com`)
4. Si no existe, agrégala
5. Redeployea:
   - Settings → Deployments
   - Click en el deploy más reciente
   - Click "Redeploy" o "Rebuild"

---

### Paso 4: Espera y Prueba

1. Espera 5-10 minutos (Google tarda en sincronizar)
2. Abre: https://labendicion-beta.vercel.app
3. Intenta hacer login con Google
4. Debería funcionar ✅

---

## 🧪 Verificación

Abre console del navegador (F12 → Console) y verifica:

**ANTES (con error):**
```
The given origin is not allowed for the given client ID.
Access to fetch at 'https://labendicion-be.onrender.com' ... blocked by CORS
```

**DESPUÉS (corregido):**
```
✅ Sin errores CORS
✅ Botón de Google se abre
✅ Puedes seleccionar cuenta
```

---

## 📋 Checklist Final

- [ ] Actualicé SecurityConfig (agregué `https://labendicion-beta.vercel.app`)
- [ ] Hice push a GitHub
- [ ] Render redeployó (verificar en Render dashboard)
- [ ] Registré `https://labendicion-beta.vercel.app` en Google Cloud Console
- [ ] Guardé cambios en Google Console
- [ ] Esperé 5-10 minutos
- [ ] Verifiqué en Vercel que VITE_GOOGLE_CLIENT_ID está configurado
- [ ] Redeployé en Vercel
- [ ] Abrí https://labendicion-beta.vercel.app
- [ ] Clickeé botón Google
- [ ] ✅ Funciona!

---

## 🆘 Si Sigues Teniendo Errores

### Error CORS aún existe
- Verifica que Render termine el deploy (puede tardar 2-3 minutos)
- Recarga la página (Ctrl+F5)
- Verifica que `https://labendicion-beta.vercel.app` esté en SecurityConfig

### Google sigue diciendo "not allowed origin"
- Verifica en Google Console que registraste exactamente: `https://labendicion-beta.vercel.app`
- NO agregues `https://` dos veces
- NO agregues `/` al final
- NO agregues `/login`
- Debe ser exactamente lo que se ve en el navegador

### El Client ID es incorrecto
- En Vercel, Settings → Environment Variables
- Verifica que `VITE_GOOGLE_CLIENT_ID` sea el correcto
- Copia de Google Console → Credenciales → Tu OAuth app → Client ID
- Debe terminar en `.apps.googleusercontent.com`

---

**La clave:** Los orígenes registrados en Google deben coincidir EXACTAMENTE con la URL donde abres la app.

