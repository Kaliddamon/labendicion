# 🔐 Solución: Error "no registered origin" - Google OAuth2

## 🐛 Problema
```
Error 401: invalid_client
no registered origin
```

Esto significa que el **origen del frontend NO está registrado en Google Cloud Console**.

---

## ✅ Paso 1: Ve a Google Cloud Console

Abre: https://console.cloud.google.com

---

## ✅ Paso 2: Selecciona tu Proyecto

- Arriba a la izquierda, haz clic en el selector de proyectos
- Selecciona el proyecto donde creaste las credenciales OAuth2
- Si no tienes ninguno, crea uno nuevo

---

## ✅ Paso 3: Ve a Credenciales

En el menú lateral izquierdo:
1. Haz clic en **"APIs y Servicios"**
2. Haz clic en **"Credenciales"**

---

## ✅ Paso 4: Edita tu Aplicación OAuth2

1. Busca en la lista una entrada que diga **"Aplicación web"** o similar
2. O si tienes múltiples, busca la que creaste para "La Bendición"
3. Haz clic en el **nombre** (o en el icono de edición ✏️)

---

## ✅ Paso 5: Registra los Orígenes Autorizados

### 🔹 Si estás en DESARROLLO local:

En la sección **"Orígenes de JavaScript autorizados"**, agrega:
- `http://localhost:5173`
- `http://localhost:5174`
- `http://127.0.0.1:5173`

### 🔹 Si estás en PRODUCCIÓN (Vercel):

Agrega:
- `https://labendicion.vercel.app`

**Ejemplo de cómo se ve:**
```
✓ http://localhost:5173
✓ http://localhost:5174
✓ https://labendicion.vercel.app
```

---

## ✅ Paso 6: Registra las URIs de Redirección

En la sección **"URIs de redirección autorizados"**, agrega:
- `http://localhost:5173` (desarrollo)
- `http://localhost:5174` (desarrollo)
- `https://labendicion.vercel.app` (producción)

---

## ✅ Paso 7: Guarda los Cambios

Haz clic en **"Guardar"** o **"Update"**

---

## ✅ Paso 8: Copia el Client ID

1. Vuelve a la página de Credenciales
2. Busca tu aplicación OAuth2
3. Haz clic en ella
4. Copia el **"Client ID"** (es un texto largo que termina en `.apps.googleusercontent.com`)

---

## ✅ Paso 9: Configura el Frontend

### 🔹 Si estás en DESARROLLO:

Crea un archivo `.env` en `frontend/.env`:

```env
VITE_GOOGLE_CLIENT_ID=paste_your_client_id_here.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:8080
```

**Importante:** Reemplaza `paste_your_client_id_here` con tu Client ID real

### 🔹 Si estás en PRODUCCIÓN (Vercel):

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - **Name:** `VITE_GOOGLE_CLIENT_ID`
   - **Value:** Tu Client ID (el que copiaste en Paso 8)

---

## ✅ Paso 10: Reinicia el Frontend

### En desarrollo:
```bash
# Detén el servidor (Ctrl+C)
# Luego:
npm run dev
```

### En producción:
Vercel redeployará automáticamente cuando agregues la variable

---

## 🧪 Prueba Localmente

1. Abre: http://localhost:5173
2. Deberías ver un botón "Iniciar sesión con Google"
3. Haz clic en él
4. Se abrirá una ventana de Google (sin error)
5. Selecciona tu cuenta

---

## 🐛 Si Sigues Teniendo Error

### Error: "Consent screen not configured"
**Solución:** Debes crear una pantalla de consentimiento OAuth:
1. Ve a: **APIs y Servicios → Pantalla de consentimiento**
2. Selecciona **Externo** o **Interno**
3. Completa los campos:
   - Nombre de la app: "La Bendición"
   - Email de soporte: Tu email
   - Email de contacto: Tu email
4. Haz clic en **"Guardar y continuar"**
5. En la sección de scopes, no agregues nada (olvida esa sección)
6. Haz clic en **"Guardar y continuar"**
7. En usuarios de prueba, agrega tu email
8. Haz clic en **"Guardar y continuar"**

### Error: "invalid_client"
**Causa:** Client ID incorrecto
**Solución:** Verifica que hayas copiado el Client ID completo (sin espacios)

### Botón de Google no aparece
**Causa:** `VITE_GOOGLE_CLIENT_ID` no está configurado
**Solución:** Crea `.env` en frontend/ con la variable correcta

---

## 📋 Checklist

- [ ] Fui a Google Cloud Console
- [ ] Seleccioné mi proyecto
- [ ] Entré en Credenciales
- [ ] Edité mi aplicación OAuth2
- [ ] Agregué `http://localhost:5173` a Orígenes Autorizados
- [ ] Agregué `https://labendicion.vercel.app` a Orígenes Autorizados (si está en producción)
- [ ] Copié mi Client ID
- [ ] Creé/actualicé `frontend/.env` con `VITE_GOOGLE_CLIENT_ID`
- [ ] Reinicié el frontend (`npm run dev`)
- [ ] Abrí http://localhost:5173 en navegador
- [ ] Hice clic en botón de Google
- [ ] Se abrió ventana de Google sin error ✅

---

## 💡 Nota Importante

**Para desarrollo local:**
- El origen es: `http://localhost:5173`
- NO es: `http://localhost:8080` (ese es el backend)
- NO lleva `/api/auth` al final

**Para URL completa del Google OAuth callback:**
- El navegador automáticamente redirige a: `http://localhost:5173/`
- Google maneja el flujo OAuth internamente
- Nosotros recibimos el `credential` JWT en el frontend

---

## 🎯 ¿Qué sucede cuando haces clic en "Iniciar sesión con Google"?

1. Frontend abre ventana de Google (usa Origen registrado)
2. Google valida que el Origen está en la whitelist
3. Si está ✅ → Se abre ventana para seleccionar cuenta
4. Si está ❌ → Error "no registered origin"

---

¿Ya completaste estos pasos? Si aún tienes error, cuéntame:
- ¿Estás en http://localhost:5173 o en otra URL?
- ¿Registraste ese origen en Google Cloud Console?
- ¿Copiaste el Client ID correctamente en `.env`?

