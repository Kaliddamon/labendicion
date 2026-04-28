# 🔍 DIAGNÓSTICO: Connection Failed en OnRender

## El Error Exacto que Ves

```
2026-04-28T11:14:27.173Z ERROR 1 --- [labendicion] [main] 
o.h.engine.jdbc.spi.SqlExceptionHelper: The connection attempt failed.

2026-04-28T11:14:27.275Z ERROR 1 --- [labendicion] [main] 
Failed to initialize JPA EntityManagerFactory: [PersistenceUnit: default] 
Unable to build Hibernate SessionFactory; 
nested exception is org.hibernate.exception.JDBCConnectionException: 
Unable to open JDBC Connection for DDL execution
```

## ✅ Lo que esto significa

La URL JDBC se creó correctamente, pero **no pudo conectar a la BD**.

Probablemente porque:
- ❌ Las variables de entorno NO están configuradas en OnRender
- ❌ O las credenciales son incorrectas
- ❌ O Supabase no está lista

---

## 🧪 DIAGNÓSTICO PASO 1: ¿Ves logs de DATASOURCE?

En OnRender, ve a tu servicio y busca en **Logs**:

### Busca esto:
```
========== SUPABASE DATASOURCE CONFIGURATION ==========
Environment Variables Found:
  DATABASE_URL:
  PGUSER:
  PGPASSWORD:
```

---

## ESCENARIO A: SÍ veo los logs de DATASOURCE

Si ves `========== SUPABASE DATASOURCE CONFIGURATION ==========`:

**Busca esta línea exacta:**
```
Database URL: ✓ SET
```

O

```
Database URL: ✗ NOT SET
```

### Si ves ✓ SET:
→ Variables están configuradas

Busca línea final:
```
✓ DataSource creado exitosamente desde DATABASE_URL
```

Si NO la ves, busca:
```
✗ Error creando DataSource:
```

**ACCIÓN:** Copia el mensaje de error exacto y búscalo en TROUBLESHOOTING_CONNECTION_ERROR.md

---

### Si ves ✗ NOT SET:
→ Las variables NO están en OnRender Environment

**ACCIÓN INMEDIATA:**
```
1. Ve a OnRender Dashboard
2. Tu servicio labendicion-backend
3. Environment (abajo a la derecha)
4. Add Variable
5. Configura:
   DATABASE_URL = postgresql://postgres:PASSWORD@db.XXX.supabase.co:5432/postgres
   PGUSER = postgres
   PGPASSWORD = PASSWORD
   SPRING_PROFILES_ACTIVE = supabase
6. Deploy
7. Espera 15 minutos
```

---

## ESCENARIO B: NO veo los logs de DATASOURCE

Si **NO ves** `========== SUPABASE DATASOURCE CONFIGURATION ==========`:

**Significa:** Las variables NO están configuradas **Y** el perfil supabase NO está activo.

**ACCIÓN INMEDIATA:**

1. OnRender Dashboard → Tu servicio
2. Environment
3. Verifica estas variables:

```
SPRING_PROFILES_ACTIVE = supabase      ← CRÍTICO
DATABASE_URL = postgresql://...        ← CRÍTICO
PGUSER = postgres
PGPASSWORD = PASSWORD
```

4. Si falta `SPRING_PROFILES_ACTIVE = supabase`, AGRÉGALO ahora
5. Deploy
6. Espera 15 minutos

---

## 📋 CHECKLIST: ¿Configuré todo en OnRender?

Ve a OnRender → Tu servicio → **Environment**:

```
☐ DATABASE_URL está?
   Si NO → AGREGAR
   Valor: postgresql://postgres:PASSWORD@db.XXX.supabase.co:5432/postgres

☐ PGUSER está?
   Si NO → AGREGAR
   Valor: postgres

☐ PGPASSWORD está?
   Si NO → AGREGAR
   Valor: (la contraseña de tu BD Supabase)

☐ SPRING_PROFILES_ACTIVE está?
   Si NO → AGREGAR
   Valor: supabase
```

Si falta CUALQUIERA de estas 4, **ES EL PROBLEMA**.

---

## 🔐 VERIFICACIÓN: ¿Las credenciales son correctas?

### Cómo verificar:

1. Ve a https://app.supabase.com
2. Tu proyecto
3. **Settings** → **Database**
4. Busca **Connection String** (arriba)
5. Copia exactamente:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
   ```

6. En OnRender, tu `DATABASE_URL` debería ser **IDÉNTICO**

### Si no coinciden:

**Opción 1: Actualizar la contraseña**
- En OnRender, en `PGPASSWORD`
- En OnRender, en `DATABASE_URL` (reemplaza PASSWORD)
- Deploy
- Espera 15 minutos

**Opción 2: Resetear contraseña en Supabase**
- Supabase → Settings → Database → Reset password
- Elige una nueva
- Copia a OnRender
- Deploy

---

## ⏱️ TIMELINE P RESOLVER

```
Ahora:
☐ Verifica si ves "SUPABASE DATASOURCE CONFIGURATION" en logs

Si NO ves (Escenario B):
☐ Configura 4 variables en OnRender Environment
☐ Deploy
☐ Espera 15 min

Si SÍ ves (Escenario A):
☐ Verifica que diga ✓ SET para DATABASE_URL
☐ Si dice ✗ NOT SET → Configura variables
☐ Si dice error → Verifica credenciales

Minuto 15:
☐ Busca nuevamente "✓ DataSource creado exitosamente"
☐ Si lo ves → ERROR RESUELTO ✅
☐ Si no lo ves → Busca el error exacto
```

---

## 🆘 SI TIENES DUDAS

Responde ESTAS 3 preguntas y podré ayudarte:

**Pregunta 1:** ¿Ves en los logs de OnRender la línea:
```
========== SUPABASE DATASOURCE CONFIGURATION ==========
```
Respuesta: SI / NO

**Pregunta 2:** Si respondiste SI, ¿Qué ves en la línea de DATABASE_URL?
```
DATABASE_URL: ✓ SET
```
o
```
DATABASE_URL: ✗ NOT SET
```
Respuesta: ✓ SET / ✗ NOT SET

**Pregunta 3:** ¿Cuál es la última línea antes del error?
Copia exactamente 1 línea (después de "===="):

Respuesta: [tu respuesta]

---

## 💡 RECUENTO RÁPIDO

| Síntoma | Causa | Solución |
|---------|-------|----------|
| No ves DATASOURCE logs | Variables no en OnRender | Agregar 4 variables |
| Ves DATABASE_URL: ✗ NOT SET | DATABASE_URL falta | Agregar DATABASE_URL |
| Ves PGUSER: ✗ NOT SET | PGUSER falta | Agregar PGUSER |
| Error: "connection refused" | Host incorrecto | Verifica db.supabase.co |
| Error: "access denied" | PASSWORD incorrecto | Verifica contraseña |

---

## 📞 ÚLTIMA OPCIÓN: Debug Local

Si quieres ver exactamente qué está pasando ANTES de desplegar en OnRender:

```powershell
# En tu PC, configura variables
$env:DATABASE_URL="postgresql://postgres:PASSWORD@db.XXX.supabase.co:5432/postgres"
$env:PGUSER="postgres"
$env:PGPASSWORD="PASSWORD"
$env:SPRING_PROFILES_ACTIVE="supabase"

# Compila
cd backend
mvn clean compile

# Ejecuta
mvn spring-boot:run

# Deberías ver en consola:
# ========== SUPABASE DATASOURCE CONFIGURATION ==========
# DATABASE_URL: ✓ SET
# ...
# ✓ DataSource creado exitosamente

# Si lo ves, significa que localmente funciona
# Entonces el problema IS al 100% en OnRender Environment
```

---

## ✨ CONCLUSIÓN

El error que ves es **100% problema de configuración**.

**NO es un bug del código.**

Solución: **Agregar 4 variables en OnRender y Deploy.**

Tiempo total: **5 minutos de acción + 15 minutos de espera.**


