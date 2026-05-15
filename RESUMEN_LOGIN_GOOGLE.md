# ✅ Resumen: Login con Google OAuth

## 📝 Cambios Realizados (Mínimos y Esenciales)

### Backend (Java/Spring Boot)

**1. Dependencias en pom.xml:**
- Spring Security
- OAuth2 Resource Server
- Google Auth Library
- JWT Library

**2. Archivos Creados:**
- `SecurityConfig.java`: Configuración de seguridad
- `AuthController.java`: Endpoints `/api/auth/verify-google` y `/api/auth/logout`

**3. Modificaciones:**
- `application.properties`: Configuración JWT

---

### Frontend (React)

**1. Dependencia en package.json:**
- `@react-oauth/google`

**2. Archivos Creados:**
- `AuthContext.tsx`: Gestión de estado de autenticación
- `Login.tsx`: Página de login con botón de Google

**3. Modificaciones:**
- `App.tsx`: GoogleOAuthProvider + AuthProvider
- `routes.tsx`: Protección de rutas (ProtectedRoute wrapper)
- `AppContext.tsx`: Token agregado a cada request
- `.env.example`: Variable VITE_GOOGLE_CLIENT_ID

---

## 🚀 Configuración Requerida (3 pasos)

### Paso 1: Obtener Google Client ID
1. Ve a https://console.cloud.google.com
2. Crea un proyecto
3. Habilita Google+ API
4. Crea credenciales OAuth2 (tipo: aplicación web)
5. Copia el Client ID

### Paso 2: Frontend
Crea `frontend/.env`:
```env
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_API_BASE_URL=http://localhost:8080
```
Ejecuta: `npm install && npm run dev`

### Paso 3: Backend
Define variable de entorno:
```bash
export GOOGLE_CLIENT_ID=your_client_id
mvn clean package
java -jar target/labendicion-0.0.1-SNAPSHOT.jar
```

---

## 🔄 Flujo

1. Usuario intenta acceder → Redirige a `/login`
2. Hace clic en "Iniciar sesión con Google"
3. Abre ventana de Google → Autentica
4. Frontend envía token a `/api/auth/verify-google`
5. Backend valida y responde con datos del usuario
6. Token se guarda en localStorage
7. Se redirige a Home
8. Cada request incluye `Authorization: Bearer {token}`

---

## 📋 Checklist

- [ ] Obtuviste Google Client ID
- [ ] Creaste `frontend/.env` con VITE_GOOGLE_CLIENT_ID
- [ ] Instalaste dependencias (`npm install`)
- [ ] Definiste GOOGLE_CLIENT_ID en backend
- [ ] Compilaste el backend (`mvn clean package`)
- [ ] Iniciaste frontend en puerto 5173
- [ ] Iniciaste backend en puerto 8080
- [ ] Abriste http://localhost:5173
- [ ] Hiciste click en botón de Google
- [ ] Fuiste redirigido a Home

---

## 🔐 En Producción (Render + Vercel)

**Render (Backend):**
- Agrega variable: `GOOGLE_CLIENT_ID=your_id`

**Vercel (Frontend):**
- Agrega variable: `VITE_GOOGLE_CLIENT_ID=your_id`
- Especifica URL del backend: `VITE_API_BASE_URL=https://backend.render.com`

---

## 📖 Ver también:
- `SETUP_GOOGLE_LOGIN.md`: Guía completa paso a paso
- `AuthContext.tsx`: Gestión de tokens
- `AuthController.java`: Validación en backend
- `Security Config.java`: Configuración de Spring Security

---

**¡El login con Google está listo! 🎉**

