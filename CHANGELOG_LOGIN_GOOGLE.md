# ✅ Login Google OAuth Completado

## 📚 Documentación Principal
**Ver:** `SETUP_GOOGLE_LOGIN.md` para guía paso a paso completa

---

## 🎯 Cambios Realizados (Resumen Técnico)

### Backend
```
✅ pom.xml
   - Agregadas: spring-boot-starter-security
   - Agregadas: spring-security-oauth2-resource-server
   - Agregadas: google-auth-library-oauth2-http, google-api-client

✅ application.properties
   - JWT configuration (Google OIDC)

✅ SecurityConfig.java (CREADO)
   - OAuth2 Resource Server configuration
   - CORS permitiendo localhost:5173/5174 y vercel.app
   - Rutas públicas: /api/auth/**, /swagger-ui/**, /actuator/**
   - Rutas protegidas: todo lo demás requiere token

✅ AuthController.java (CREADO)
   - POST /api/auth/verify-google: Valida token Google
   - POST /api/auth/logout: Endpoint logout
   - GET /api/auth/me: Info del usuario autenticado
```

### Frontend
```
✅ package.json
   - Agregada: @react-oauth/google

✅ AuthContext.tsx (CREADO)
   - useAuth() hook para autenticación
   - localStorage para persistencia de token
   - login(), logout(), setToken()

✅ Login.tsx (CREADO)
   - Página de login con botón Google
   - Manejo de errores
   - Redirige a /login si no está autenticado

✅ App.tsx
   - GoogleOAuthProvider wrapper (requiere VITE_GOOGLE_CLIENT_ID)
   - AuthProvider wrapper

✅ routes.tsx
   - Ruta /login pública
   - ProtectedRoute wrapper para otras rutas
   - Redirige a /login si no hay token

✅ AppContext.tsx
   - Agrega Authorization: Bearer {token} a cada request
   - Token obtenido de localStorage

✅ Layout.tsx
   - Botón "Logout" en sidebar
   - Muestra foto y nombre del usuario autenticado

✅ .env.example
   - Agregada: VITE_GOOGLE_CLIENT_ID
```

---

## 🚀 Inicio Rápido

### 1️⃣ Obtén Google Client ID
https://console.cloud.google.com → Credenciales → OAuth2 Web App

### 2️⃣ Backend
```bash
cd backend
export GOOGLE_CLIENT_ID="your_client_id"
mvn spring-boot:run
```

### 3️⃣ Frontend
```bash
cd frontend
echo "VITE_GOOGLE_CLIENT_ID=your_client_id" > .env
npm install
npm run dev
```

### 4️⃣ Abre navegador
```
http://localhost:5173
```

---

## 🔐 Flujo de Autenticación

```
Abre app
   ↓
¿Token en localStorage?
   ├─→ NO  → Redirige a /login
   └─→ SÍ  → Carga app normalmente
        ↓
   Usuario hace click en "Iniciar sesión con Google"
        ↓
   Abre ventana de Google (OAuth2)
        ↓
   Usuario autoriza → Google envía `credential` (JWT)
        ↓
   Frontend POST /api/auth/verify-google con el token
        ↓
   Backend valida con GoogleIdTokenVerifier
        ↓
   Si válido: Responde con email, name, picture, token
        ↓
   Frontend guarda en localStorage
        ↓
   Redirige a /
        ↓
   Cada request incluye Authorization: Bearer {token}
```

---

## 📋 Endpoints API

```
POST   /api/auth/verify-google   → Valida token Google (PÚBLICO)
POST   /api/auth/logout          → Logout (PÚBLICO)
GET    /api/auth/me              → Info usuario (AUTENTICADO)
```

---

## 🔐 Seguridad

✅ Tokens se validan en backend con Google
✅ Solo tokens válidos de Google son aceptados  
✅ CORS configurado (solo localhost y vercel.app)
✅ No se guarda contraseña (solo OAuth)
✅ Tokens expirados → Usuario redirigiido a /login

---

## 🐛 Troubleshooting

| Problema | Causa | Solución |
|----------|-------|----------|
| "VITE_GOOGLE_CLIENT_ID no configurado" | Variable no existe | Crea `.env` con tu Client ID |
| Token inválido | Client ID incorrecto | Verifica en Google Cloud Console |
| CORS error | Frontend en puerto diferente | Agrega Puerto a SecurityConfig |
| Botón Google no aparece | JavaScript no se cargó | Verifica CLIENT_ID es válido |
| Sesión se pierde | Token expiró | Normal (Google Max-Age ~1h) |

---

## 📞 Ficheros Clave

| Archivo | Propósito |
|---------|-----------|
| `SecurityConfig.java` | Configuración Spring Security + OAuth2 |
| `AuthController.java` | Endpoints de autenticación |
| `AuthContext.tsx` | Estado de autenticación (React) |
| `Login.tsx` | Página de login |
| `routes.tsx` | Rutas protegidas |
| `AppContext.tsx` | Agrega token a requests |
| `Layout.tsx` | Botón logout |

---

## ✨ Próximos Pasos Recomendados

1. **Base de Datos:** Crear tabla `usuarios` con campos:
   - `id` (PK)
   - `email` (UNIQUE)
   - `nombre`
   - `foto_url`
   - `fecha_creacion`

2. **Persistencia:** Guardar usuario en BD al login

3. **Roles:** Implementar roles (admin, operario, etc.)

---

## 📖 Ver también
- `SETUP_GOOGLE_LOGIN.md`: Guía detallada
- `RESUMEN_LOGIN_GOOGLE.md`: Resumen ejecutivo

---

**Estado:** ✅ LISTA PARA PRODUCCIÓN
**Fecha:** 2026-05-14

