# 🔐 Guía: Persistencia de Datos en Supabase desde Render

## Problema Resuelto
✅ Los datos ahora se guardan en Supabase (PostgreSQL) en lugar de en memoria o archivos locales  
✅ Los datos **persisten después de redeploy** en Render  
✅ Los datos se recuperan automáticamente desde la base de datos

---

## ⚠️ Paso 1: Obtener Credenciales de Supabase

### 1.1 Ve a tu Proyecto Supabase
- Abre: https://app.supabase.com
- Selecciona tu proyecto

### 1.2 Obtén la Cadena de Conexión
**Settings → Database → Connection Pooling**

Busca la sección `Connection string` (también llamada URI o Connection pooling)

Debe verse como:
```
postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

Copia esta cadena completa.

---

## ⚠️ Paso 2: Agregar Variables a Render

### 2.1 Ve al Dashboard de Render
- Abre: https://dashboard.render.com
- Selecciona tu servicio `labendicion-backend`

### 2.2 Accede a Environment Variables
- Haz clic en **"Environment"** o **"Settings"** (puede variar según la interfaz)
- Busca la sección **"Environment Variables"**

### 2.3 Agrega Estas Tres Variables

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | La cadena de conexión de Supabase que copiaste en 1.2 |
| `PGUSER` | `postgres` (usuario por defecto en Supabase) |
| `PGPASSWORD` | La contraseña de Supabase (la que ves después del `:` en la cadena) |

**Ejemplo (NO estes es real, usa tus propios valores):**
```
DATABASE_URL=postgresql://postgres:abc123xyz@db.ujsioelnrctyalqezyay.supabase.co:5432/postgres
PGUSER=postgres
PGPASSWORD=abc123xyz
```

### 2.4 Guarda los Cambios
- Haz clic en "Save"
- Render automáticamente hará redeploy con las nuevas variables

---

## 🚀 Paso 3: Verificar que Funciona

### 3.1 Espera el Redeploy
- Render redeployará automáticamente cuando agregues las variables
- Espera a que termine (puedes ver el estado en los logs)

### 3.2 Prueba la Persistencia
1. Ve a tu frontend: https://labendicion.vercel.app
2. **Crea un registro** (ej: un empleado, un pedido, etc.)
3. **Verifica que aparezca en la lista**
4. **Espera 2-3 minutos**
5. **Recarga la página** (`Ctrl+F5`)
6. **El registro debe seguir ahí**

### 3.3 Verifica en Supabase
Para mayor seguridad, puedes ver directamente desde Supabase:
1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. **SQL Editor** o **Table Editor**
4. Verifica que tus registros estén en las tablas

---

## ❌ Solución de Problemas

### Los datos siguen desapareciendo
**Causa**: Las variables de entorno no se agregaron o se agregaron mal  
**Solución**:
- Verifica que `DATABASE_URL`, `PGUSER`, `PGPASSWORD` estén en Render
- Verifica que la cadena de conexión sea correcta (sin espacios extra)
- Haz clic en "Redirect deployment" en Render para forzar un nuevo despliegue

### Error: "Could not get a live connection"
**Causa**: Credenciales incorrectas o Supabase no es accesible  
**Solución**:
- Verifica que Supabase esté corriendo
- Verifica que la contraseña sea correcta
- En Supabase Settings → Database, resetea la contraseña master si es necesario

### Las tablas están vacías
**Causa**: Primera ejecución no creó las tablas  
**Solución**:
- Crea un registro desde el frontend
- Las tablas se crearán automáticamente (Hibernate con `ddl-auto=update`)

---

## 📋 Cambios Técnicos Realizados

### Backend (Java)
✅ `application-prod.properties`: Changed `ddl-auto` from `validate` to `update`  
✅ `application-supabase.properties`: Changed `ddl-auto` from `create` to `update`  

### Render
✅ `render.yaml`: Changed `SPRING_PROFILES_ACTIVE` from `supabase` to `prod`  
✅ Updated variable comments to use prod profile  

### Por Qué Estos Cambios
- **`update` en lugar de `create`**: Crea las tablas la primera vez, pero después solo agrega cambios sin perder datos
- **Perfil `prod` en lugar de `supabase`**: Acepta `DATABASE_URL` como cadena completa; más robusto y compatible con más plataformas
- **PostgreSQL de Supabase**: Datos reales en la nube, persisten entre deployments

---

## ✅ Checklist Final

- [ ] Obtuve la cadena de conexión de Supabase (DATABASE_URL)
- [ ] Extraje la contraseña de Supabase (PGPASSWORD)
- [ ] Agregué las 3 variables (`DATABASE_URL`, `PGUSER`, `PGPASSWORD`) en Render
- [ ] Guardé los cambios en Render
- [ ] Render redeployó la aplicación
- [ ] Creé un registro de prueba en el frontend
- [ ] Recargué la página y el registro seguía ahí
- [ ] Verifiqué en Supabase que el registro existe

---

## 📞 Preguntas Frecuentes

**P: ¿Qué es Supabase?**  
R: Es un servicio de PostgreSQL en la nube (similar a AWS RDS). Es gratis hasta cierto uso y es lo más fácil para persistir datos.

**P: ¿Qué pasa con los datos que tenía antes?**  
R: Si estaban en H2 (memoria o archivo), se perdieron. Ahora nuevos datos irán a Supabase.

**P: ¿Puedo usar otra base de datos?**  
R: Sí, cualquier PostgreSQL. Solo cambia `DATABASE_URL` en Render.

**P: ¿Por qué `update` y no `validate`?**  
R: `validate` no crea tablas. `update` las crea en la primera ejecución y luego mantiene cambios sin perder datos.

---

🎉 **¡Listo! Tus datos ahora son persistentes.**

