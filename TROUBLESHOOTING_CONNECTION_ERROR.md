# 🔧 TROUBLESHOOTING: "Unable to open JDBC Connection" Error

## Síntoma

```
org.springframework.beans.factory.BeanCreationException:
Error creating bean with name 'entityManagerFactory' defined in class path
resource [org/springframework/boot/autoconfigure/orm/jpa/HibernateJpaConfiguration.class]:
[PersistenceUnit: default] Unable to build Hibernate SessionFactory;
nested exception is org.hibernate.exception.JDBCConnectionException:
Unable to open JDBC Connection for DDL execution [The connection attempt failed.]
```

## Causa Probable

✅ La URL fue convertida correctamente (`postgresql://` → `jdbc:postgresql://`)
❌ Pero la conexión fue rechazada

### Razones Comunes:

1. **Variables de entorno no configuradas en OnRender**
   - DATABASE_URL falta
   - PGUSER falta
   - PGPASSWORD falta

2. **Supabase no está lista**
   - Se crea lentamente (~5 minutos)
   - Estado aún "Creating"

3. **Credenciales incorrectas**
   - PGPASSWORD no es la contraseña correcta
   - HOST no es accesible

4. **Timeout de conexión**
   - Firewall bloquea puerto 5432
   - Red inestable

---

## ✅ SOLUCIÓN PASO A PASO

### Paso 1: Verificar que Supabase Está Listo

1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. Verifica estado: **debe decir "Ready"** (no "Creating")
4. Va a tomar 5-10 minutos la primera vez
5. **Espera a que esté totalmente listo**

---

### Paso 2: Obtener Credenciales Correctas

#### En Supabase Dashboard:

1. **Settings** → **Database** → **Connection String**
2. Configura el dropdown: **Select Framework** → **PHP** (o cualquiera)
3. Busca la **Connection String** (psql)
4. Debe verse así:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

5. **Nota especial:**
   - Reemplaza `[PASSWORD]` con tu CONTRASEÑA (que elegiste cuando creaste el proyecto)
   - Reemplaza `[PROJECT-REF]` con tu ID de proyecto

---

### Paso 3: Configurar en OnRender Dashboard

#### En OnRender:

1. Ve a tu servicio `labendicion-backend`
2. **Environment** → **Add Environment Variable**

**Variable 1: DATABASE_URL** ✅ **CRÍTICO**
```
Name:  DATABASE_URL
Value: postgresql://postgres:MiContraseña123@db.ujsioelnrctyalqezyay.supabase.co:5432/postgres

⚠️ IMPORTANTE:
- Comienza con postgresql:// (SIN jdbc:)
- Incluye la contraseña REAL
- Incluye DB.supabase.co
- Incluye :5432
- Incluye /postgres al final
```

**Variable 2: PGUSER**
```
Name:  PGUSER
Value: postgres
```

**Variable 3: PGPASSWORD**
```
Name:  PGPASSWORD
Value: MiContraseña123

⚠️ La MISMA contraseña que en DATABASE_URL
```

**Variable 4: SPRING_PROFILES_ACTIVE**
```
Name:  SPRING_PROFILES_ACTIVE
Value: supabase
```

---

### Paso 4: Verificar Formatos

En OnRender, la variable `DATABASE_URL` debe lucir así (**sin** `jdbc:`):
```
✓ CORRECTO:    postgresql://postgres:PASSWORD@db.XXX.supabase.co:5432/postgres
✗ INCORRECTO:  jdbc:postgresql://postgres:PASSWORD@db.XXX.supabase.co:5432/postgres
✗ INCORRECTO:  postgres://postgres:PASSWORD@db.XXX.supabase.co:5432/postgres

Java automáticamente agregará jdbc: cuando necesite
```

---

### Paso 5: Deploy y Esperar

1. En OnRender, presiona **Deploy** (o **Redeploy** si ya has deployado)
2. Ve a **Deployments** → Pestaña **Build Logs**
3. Busca líneas que comiencen con `========== SUPABASE DATASOURCE CONFIGURATION`
4. Verifica que imprima:
   ```
   DATABASE_URL: ✓ SET
   PGUSER: ✓ SET (postgres)
   PGPASSWORD: ✓ SET (length: XXX)
   Final URL: jdbc:postgresql://USER:***@db.XXX.***
   ✓ DataSource creado exitosamente
   ```

---

### Paso 6: Monitorear Logs Detallados

En OnRender, cuando despliegues, busca estos logs:

```
✓ DataSource creado exitosamente desde DATABASE_URL
```

Si ves esto, la conexión está bien. Si ves:

```
✗ Error creando DataSource desde DATABASE_URL:
```

Entonces hay un problema con las credenciales o la BD.

---

## 🔍 DEBUGGING AVANZADO

### Si sigue fallando, copia estos logs de OnRender:

1. Ve a tu servicio en OnRender
2. Scroll a **Logs** (abajo)
3. Busca líneas que comiencen con:
   - `DATABASE_URL:`
   - `PGUSER:`
   - `PGPASSWORD:`
   - `PGHOST:`
   - `Final URL:`
   - `Error:`

4. **Copia exactamente lo que ves** (mascarando contraseña)
5. Verifica:
   - ¿DATABASE_URL está configured?
   - ¿Está completo (con host, puerto, database)?
   - ¿PASSWORD es correcto?

---

## 🧪 TEST LOCAL (Antes de desplegar)

Para probar en tu PC antes de OnRender:

```powershell
# 1. Configura variables (reemplaza con TUS valores)
$env:DATABASE_URL="postgresql://postgres:MiPassword@db.ujsioelnrctyalqezyay.supabase.co:5432/postgres"
$env:PGUSER="postgres"
$env:PGPASSWORD="MiPassword"
$env:SPRING_PROFILES_ACTIVE="supabase"

# 2. Compila
cd C:\Users\CRIST\Desktop\labendicion\backend
mvn clean compile

# 3. Ejecuta (déjalo correr)
mvn spring-boot:run

# 4. En otra terminal, prueba
curl http://localhost:8080/actuator/health
# Deberías ver: {"status":"UP"}
```

---

## ✅ CHECKLIST FINAL ANTES DE DEPLOY

- [ ] Proyecto Supabase estado: **Ready** (no Creating)
- [ ] DATABASE_URL copiado correctamente sin typos
- [ ] DATABASE_URL comienza con `postgresql://` (no `jdbc:`)
- [ ] PGUSER = `postgres`
- [ ] PGPASSWORD es la contraseña Supabase REAL
- [ ] SPRING_PROFILES_ACTIVE = `supabase`
- [ ] Todas las variables en OnRender Environment
- [ ] Deploy presionado
- [ ] Esperaste 10 minutos

---

## 📋 VALORES DE EJEMPLO

```
Si tu proyecto Supabase es:
Project URL: https://ujsioelnrctyalqezyay.supabase.co
Contraseña elegida: MySecurePass123

DATABASE_URL debe ser:
postgresql://postgres:MySecurePass123@db.ujsioelnrctyalqezyay.supabase.co:5432/postgres

PGUSER:
postgres

PGPASSWORD:
MySecurePass123
```

---

## 🆘 CONTACTO / SOPORTE

Si aún no funciona:

1. Verifica que Supabase esté "Ready"
2. Copia los **primeros 500 caracteres** del error
3. Copia las **variables de entorno** (mascarando credenciales)
4. Verifica que compiló localmente exitosamente

---

## 📊 TABLA DE DIAGNOSTICO

| Síntoma | Causa Probable | Solución |
|---------|---|---|
| "Connection refused" | Credenciales mal | Verifica DATABASE_URL |
| "Access denied for user" | PASSWORD incorrecto | Copia exacto de Supabase |
| "No database found" | database name mal | Debe ser `/postgres` |
| "Timeout connecting" | Host inaccesible | ¿Supabase está Ready? |
| "Host not found" | DATABASE_URL corrupta | Copia nuevamente completa |

---

**La clase `DataSourceConfig.java` ha sido mejorada con logging detallado.**

**Cuando despliegues, verás exactamente qué variable falta y por qué falla.**


