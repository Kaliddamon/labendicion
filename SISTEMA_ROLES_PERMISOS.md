# ✅ Sistema de Roles y Permisos Completado

## 📋 Resumen de Cambios

He implementado un **sistema completo de roles y permisos** que permite gestionar el acceso a diferentes módulos según el rol del usuario.

---

## 🎯 Roles Creados

### 1️⃣ SUPERADMINISTRADOR
- **Email asignado automáticamente:** `cristian.san.garcia@gmail.com`
- **Acceso:** Todo el sistema
- **Permisos especiales:**
  - Puede asignar roles de ADMINISTRADOR
  - Puede ver y gestionar todos los módulos
  - Acceso a sección de Gestión de Roles

### 2️⃣ ADMINISTRADOR
- **Acceso:** Casi todo el sistema (menos asignar SUPERADMINISTRADOR)
- **Puede:**
  - Asignar roles de TRABAJADOR y USUARIO
  - Gestionar Producción, Empleados, Aseo, Reportes
  - Acceso a sección de Gestión de Roles

### 3️⃣ TRABAJADOR
- **Puede:**
  - Ver tareas de Aseo
  - Ver su historial de rendimiento
  - Acceder al Dashboard
  - Marcar tareas como completadas

### 4️⃣ USUARIO
- **Acceso:** Limitado (sin permisos específicos asignados)
- **Por defecto:** Cualquier usuario nuevo que se registre sin ser Superadmin

---

## 🏗️ Cambios en Backend

### Entidades Nuevas Creadas:

#### 1. `Usuario.java` 
```java
- id (PK)
- email (UNIQUE)
- nombre
- fotoUrl
- googleId (UNIQUE)
- activo (BOOLEAN)
- fechaRegistro
- ultimoAcceso
- roles (ManyToMany)
```

#### 2. `Rol.java`
```java
- id (PK)
- nombre (UNIQUE)
- descripcion
- permisos (ManyToMany)
```

#### 3. `Permiso.java`
```java
- id (PK)
- nombre (UNIQUE)
- descripcion
- categoria (PRODUCCION, EMPLEADOS, ASEO, REPORTES, ROLES, DASHBOARD)
```

### Repositorios Nuevos:
- `UsuarioRepository` - CRUD de usuarios
- `RolRepository` - CRUD de roles
- `PermisoRepository` - CRUD de permisos

### Servicios Nuevos:
- `RolService.java` - Gestión de roles, permisos y asignaciones

### Controladores Nuevos:
- `RolController.java` - Endpoints para gestionar roles
  - `GET /api/roles` - Obtener todos los roles
  - `POST /api/roles/asignar` - Asignar rol a usuario por email
  - `POST /api/roles/remover` - Remover rol de usuario
  - `GET /api/roles/usuario?email=...` - Obtener info del usuario
  - `GET /api/roles/tiene-permiso?email=...&permiso=...` - Verificar permiso

### Inicializador Automático:
- `RolInitializer.java` - Ejecuta automáticamente al iniciar la app:
  - Crea 4 roles predeterminados
  - Crea 19 permisos categorizados
  - Asigna permisos a cada rol
  - Solo ejecuta si no existen (idempotente)

### AuthController Actualizado:
- Ahora crea/actualiza usuario en BD al hacer login
- Asigna automáticamente:
  - `SUPERADMINISTRADOR` si email es `cristian.san.garcia@gmail.com`
  - `USUARIO` por defecto para otros
- Devuelve roles en la respuesta de `/api/auth/verify-google`

### CORS Actualizado:
- Agregado `https://labendicion-beta.vercel.app` en AuthController

---

## 🎨 Cambios en Frontend

### AuthContext Actualizado:
```typescript
- roles: string[] // Array de roles del usuario
- tieneRol(nombreRol: string): boolean
- tienePermiso(nombrePermiso: string): boolean
- login(token, user, roles) // Ahora incluye roles
```

### Nuevos Componentes:

#### 1. `ProtectedRoute.tsx`
Componente para proteger rutas según roles:
```tsx
<ProtectedRoute requiredRoles={['ADMINISTRADOR', 'SUPERADMINISTRADOR']}>
  <MiComponente />
</ProtectedRoute>
```

#### 2. `GestionarRoles.tsx`
Interfaz para asignar roles a usuarios por email:
- Solo accesible para SUPERADMINISTRADOR y ADMINISTRADOR
- Permite asignar roles a otros usuarios
- Muestra descripción de cada rol
- Devuelve feedback de éxito/error

### Routes Actualizado:
```typescript
// El formato ahora incluye ProtectedRoute con roles requeridos:
{ path: "produccion", Component: () => 
  <ProtectedRoute requiredRoles={['SUPERADMINISTRADOR', 'ADMINISTRADOR']}>
    <Produccion />
  </ProtectedRoute> 
}
```

### Layout Actualizado:
- Filtra items de navegación según roles
- Muestra los roles del usuario en la barra lateral
- Agrega link a "Roles" (solo visible para admin)
- Importa Shield icon para roles

---

## 🔐 Permisos Disponibles (19 Total)

### Producción (4)
- VER_PRODUCCION
- CREAR_PRODUCCION
- EDITAR_PRODUCCION
- ELIMINAR_PRODUCCION

### Empleados (4)
- VER_EMPLEADOS
- CREAR_EMPLEADOS
- EDITAR_EMPLEADOS
- ELIMINAR_EMPLEADOS

### Aseo (5)
- VER_ASEO
- CREAR_ASEO
- EDITAR_ASEO
- ELIMINAR_ASEO
- COMPLETAR_ASEO

### Reportes (2)
- VER_RENDIMIENTO
- VER_HISTORIAL

### Dashboard (1)
- VER_DASHBOARD

### Roles (3)
- GESTIONAR_ROLES
- ASIGNAR_ADMINISTRADOR
- ASIGNAR_TRABAJADOR

---

## 🚀 Cómo Usar

### Para el Superadministrador:

1. **Login con Google** usando `cristian.san.garcia@gmail.com`
   - Se asignará automáticamente el rol SUPERADMINISTRADOR

2. **Ir a "/roles"** desde la navegación
   - Solo visible si eres SUPER ADMIN o ADMIN

3. **Asignar roles a otros usuarios:**
   - Correo: email del usuario
   - Rol: Selecciona cual asignar
   - Click en "Asignar Rol"

### Para administradores:

1. **Login normalmente**
   - Se asignará rol ADMINISTRADOR (debes hacerlo manualmente con el Superadmin primero)

2. **Ir a "/roles"**
   - Puede asignar TRABAJADOR y USUARIO (no ADMINISTRADOR ni SUPERADMINISTRADOR)

3. **Para trabajadores:**
   - Solo pueden ver Aseo, Rendimiento y Dashboard
   - No pueden acceder a Producción ni Empleados

---

## 🔄 Flujo de Login

```
Usuario abre app
  ↓
¿Token en localStorage? → NO → Redirige a /login
  ↓ SI
  ↓
Login con Google
  ↓
Backend valida token
  ↓
Crea/actualiza Usuario en BD
  ↓
Asigna rol:
  - Si email === cristian.san.garcia@gmail.com → SUPERADMINISTRADOR
  - Si es otro email → USUARIO
  ↓
Devuelve { email, name, picture, roles: ['SUPERADMINISTRADOR'] }
  ↓
Frontend guarda en localStorage: authRoles
  ↓
AuthContext actualiza estado con roles
  ↓
ProtectedRoute verifica roles requeridos
  ��
¿Tiene rol? → SI → Muestra componente
           → NO → Muestra "Acceso Denegado"
```

---

## 📝 Base de Datos (Supabase)

### Tablas Creadas Automáticamente:

```sql
-- Tabla de usuarios
usuario (
  id BIGINT PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  nombre VARCHAR,
  foto_url TEXT,
  google_id VARCHAR UNIQUE,
  activo BOOLEAN DEFAULT TRUE,
  fecha_registro TIMESTAMP DEFAULT NOW(),
  ultimo_acceso TIMESTAMP
)

-- Tabla de roles
rol (
  id BIGINT PRIMARY KEY,
  nombre VARCHAR UNIQUE NOT NULL,
  descripcion TEXT
)

-- Tabla de permisos
permiso (
  id BIGINT PRIMARY KEY,
  nombre VARCHAR UNIQUE NOT NULL,
  descripcion TEXT,
  categoria VARCHAR NOT NULL
)

-- Tabla de relación usuario-rol
usuario_rol (
  usuario_id BIGINT FOREIGN KEY,
  rol_id BIGINT FOREIGN KEY,
  PRIMARY KEY (usuario_id, rol_id)
)

-- Tabla de relación rol-permiso
rol_permiso (
  rol_id BIGINT FOREIGN KEY,
  permiso_id BIGINT FOREIGN KEY,
  PRIMARY KEY (rol_id, permiso_id)
)
```

---

## ✅ Variables de Entorno Necesarias

### En Render (Backend):
```
SUPABASE_JDBC_URL=postgresql://postgres.xxxxx:password@xxxxx.supabase.co:5432/postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=tu_password
GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
CORS_ALLOWED_ORIGINS=https://labendicion-beta.vercel.app
```

### En Vercel (Frontend):
```
VITE_GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
VITE_API_BASE_URL=https://labendicion-be.onrender.com/api/frontend
```

---

## 🐛 Troubleshooting

### Error: "Token inválido"
- Verifica que GOOGLE_CLIENT_ID en Render sea correcto
- Verifica que los orígenes estén registrados en Google Cloud Console

### Error: "Usuario no encontrado"
- El usuario debe haber hecho login antes de asignarle un rol
- Login automáticamente crea el usuario en la BD

### Error de CORS
- Verifica CORS_ALLOWED_ORIGINS en Render
- Incluye el dominio de Vercel exactamente como aparece en el navegador

---

## 📊 Próximos Pasos Recomendados

1. **Configurar Supabase:** Asegúrate de que SUPABASE_JDBC_URL esté configurada en Render
2. **Hacer Redeploy:** Push a GitHub → Render redeployará automáticamente
3. **Probar Login:** 
   - Login con `cristian.san.garcia@gmail.com` → Debe ser SUPERADMINISTRADOR
   - Login con otro email → Debe ser USUARIO
4. **Asignar Roles:** Usa /roles para asignar roles a otros usuarios
5. **Verificar Acceso:** Cada módulo ahora requiere roles específicos

---

## 🎉 ¡Listo!

El sistema de roles y permisos está completamente implementado y listo para usar. 

**Próximos pasos:**
1. Hacer redeploy en Render
2. Hacer redeploy en Vercel
3. Probar login con cristian.san.garcia@gmail.com
4. Asignar roles a otros usuarios desde /roles
5. Verificar que los permisos funcionan correctamente


