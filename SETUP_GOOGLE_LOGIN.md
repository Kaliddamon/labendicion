# 🔐 Configuración: Login con Google OAuth

## Cambios Realizados

### Backend (Java/Spring Boot)
✅ **Dependencias agregadas:**
- `spring-boot-starter-security`
- `spring-security-oauth2-resource-server`
- `google-auth-library-oauth2-http`
- `java-jwt`

✅ **Archivos creados:**
- `SecurityConfig.java`: Configuración de Spring Security
- `AuthController.java`: Endpoints para autenticación

✅ **Archivos modificados:**
- `pom.xml`: Agregadas dependencias
- `application.properties`: Configuración JWT

### Frontend (React)
✅ **Dependencia agregada:**
- `@react-oauth/google`

✅ **Archivos creados:**
- `AuthContext.tsx`: Context para gestionar autenticación
- `Login.tsx`: Componente de login con Google

✅ **Archivos modificados:**
- `package.json`: Agregada dependencia
- `App.tsx`: Envuelto con `GoogleOAuthProvider` y `AuthProvider`
- `routes.tsx`: Protección de rutas (requieren login)
- `AppContext.tsx`: Agrega token JWT a cada request
- `.env.example`: Agregada variable `VITE_GOOGLE_CLIENT_ID`

---

## ⚠️ Paso 1: Obtener Google Client ID

### 1.1 Ve a Google Cloud Console
https://console.cloud.google.com

### 1.2 Crea un Nuevo Proyecto
- Haz clic en el selector de proyectos (arriba)
- Haz clic en "Nuevo proyecto"
- Dale un nombre: "La Bendición" (o el que prefieras)
- Haz clic en "Crear"

### 1.3 Habilita Google+ API
- En la barra de búsqueda, busca "Google+ API"
- Haz clic en ella
- Haz clic en "Habilitar"

### 1.4 Crea Credenciales OAuth2
- Ve a: **Credenciales** (en el menú lateral)
- Haz clic en **"Crear credenciales"**
- Selecciona: **ID de cliente de OAuth**
- Si te pide, primero crea una pantalla de consentimiento OAuth:
  - Escribe el nombre de la app: "La Bendición"
  - Email: Tu email
  - Agrega usuarios de prueba (tu email)
  - Haz clic en "Guardar"
- Ahora vuelve a Credenciales → Crear credenciales → ID de cliente
- Tipo de aplicación: **Aplicación web**
- Nombre: "La Bendición Frontend"

### 1.5 Agrega URIs Autorizados
En la sección "Orígenes autorizados de JavaScript", agrega:
- `http://localhost:5173`
- `http://localhost:5174`
- `https://labendicion.vercel.app`

En la sección "URI de redirección autorizados", agrega:
- `http://localhost:5173`
- `http://localhost:5174`
- `https://labendicion.vercel.app`

Haz clic en **"Crear"**

### 1.6 Copia el Client ID
Se abrirá un modal con tu Google Client ID. **Cópialo.**

---

## ⚠️ Paso 2: Configurar Frontend

### 2.1 Crea archivo `.env` (o actualiza si existe)
En `frontend/.env`:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:8080
```

Reemplaza `your_google_client_id` con el ID que copiaste en Paso 1.6

### 2.2 Instala dependencias
```bash
cd frontend
npm install
```

### 2.3 Inicia el frontend
```bash
npm run dev
```

---

## ⚠️ Paso 3: Configurar Backend

### 3.1 Agrega variable de entorno (local)
En tu terminal, antes de ejecutar el backend:

**Windows PowerShell:**
```powershell
$env:GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
mvn spring-boot:run
```

**bash/zsh:**
```bash
export GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
mvn spring-boot:run
```

O crea un archivo `.env` en `backend/` y usa un plugin de Maven para cargarlo.

### 3.2 Compila e inicia
```bash
cd backend
mvn clean package
java -Dspring.profiles.active=dev -jar target/labendicion-0.0.1-SNAPSHOT.jar
```

---

## 🚀 Prueba Localmente

1. **Abre:** http://localhost:5173
2. **Deberías ver:** Pantalla de Login con botón "Iniciar sesión con Google"
3. **Haz clic:** En el botón de Google
4. **Se abrirá:** Ventana de consentimiento de Google
5. **Después de autenticar:** Serás redirigido a Home
6. **Los datos se cargarán:** Desde el backend (con tu token incluido)

---

## 🔐 Producción (Render + Vercel)

### Backend (Render)
Agrega variable de entorno en Render Dashboard:
- **Key:** `GOOGLE_CLIENT_ID`
- **Value:** Tu Google Client ID

### Frontend (Vercel)
Agrega variable de entorno en Vercel Dashboard:
- **Name:** `VITE_GOOGLE_CLIENT_ID`
- **Value:** Tu Google Client ID (mismo)

---

## 📋 Flujo de Autenticación

```
Usuario abre app
    ↓
¿Token en localStorage? → NO → Redirige a /login
    ↓ SI
    ↓
Login con Google
    ↓
Backend valida token en /api/auth/verify-google
    ↓
Guarda token en localStorage
    ↓
Redirige a Home
    ↓
Cada request incluye: Authorization: Bearer {token}
```

---

## ❌ Solución de Problemas

### Error: "VITE_GOOGLE_CLIENT_ID no configurado"
**Causa:** Variable de entorno no existe  
**Solución:** Crea archivo `.env` en `frontend/` con el Client ID

### Error: "Token inválido"
**Causa:** El token no fue validado correctamente en backend  
**Solución:**
- Verifica que `GOOGLE_CLIENT_ID` sea correcto en backend
- Revisa logs del backend para más detalles

### Botón de Google no aparece
**Causa:** JavaScript de Google no se cargó  
**Solución:**
- Verifica que `VITE_GOOGLE_CLIENT_ID` sea válido
- Recarga la página (Ctrl+F5)

### Session se pierde al recargar
**Causa:** Token expiró (Max-Age de Google es ~1 hora)  
**Solución:** Usuario deberá volver a hacer login

---

## 🔄 Logout

Para agregar un botón de logout, usa el hook `useAuth()` en cualquier componente:

```typescript
import { useAuth } from '../context/AuthContext';

export const LogoutButton = () => {
  const { logout } = useAuth();
  return <button onClick={logout}>Cerrar sesión</button>;
};
```

---

## 📚 Documentación

- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Spring Security OAuth2](https://spring.io/projects/spring-security-oauth2-resource-server)
- [@react-oauth/google](https://github.com/react-oauth/react-oauth.github.io)

---

✅ **¡Listo! Tu aplicación ahora tiene login con Google.**

