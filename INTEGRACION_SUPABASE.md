# 🚀 INTEGRACIÓN SUPABASE - LABENDICIÓN

## Estado: ✅ COMPLETADO

Se ha integrado Supabase exitosamente en tu frontend React + Vite.

---

## ¿Qué se instaló?

✅ **Paquete Supabase:** `@supabase/supabase-js`
✅ **Archivo .env:** Con credenciales de Supabase
✅ **Cliente Supabase:** `src/utils/supabase.ts`
✅ **Componente Ejemplo:** `src/app/components/SupabaseExample.tsx`

---

## Archivos Creados

### 1. `.env` (Frontend)
```
VITE_SUPABASE_URL=https://ujsioelnrctyalqezyay.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_y59f2pj3iTmdzn5CW7A39w_UYR5PF5e
```

**Ubicación:** `frontend/.env`

---

### 2. `src/utils/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

**Ubicación:** `frontend/src/utils/supabase.ts`
**Propósito:** Cliente central para conectar con Supabase

---

### 3. `src/app/components/SupabaseExample.tsx`
Componente de ejemplo que muestra cómo:
- Conectar con Supabase
- Consultar una tabla (`todos`)
- Mostrar datos dinámicamente
- Manejar estados de carga y errores

**Ubicación:** `frontend/src/app/components/SupabaseExample.tsx`
**Cómo usarlo:**
```tsx
// En cualquier página:
import SupabaseExample from '@/app/components/SupabaseExample'

export default function Home() {
  return (
    <div>
      <SupabaseExample />
    </div>
  )
}
```

---

## Cómo Usar Supabase en Tu Código

### Ejemplo 1: Leer Datos

```typescript
import { supabase } from '@/utils/supabase'

async function getEmpresas() {
  const { data, error } = await supabase
    .from('empresas')
    .select('*')
  
  if (error) console.error(error)
  return data
}
```

### Ejemplo 2: Filtrar Datos

```typescript
const { data } = await supabase
  .from('empresas')
  .select('*')
  .eq('status', 'activa')
  .limit(10)
```

### Ejemplo 3: Insertar Datos

```typescript
const { data, error } = await supabase
  .from('empresas')
  .insert([
    { 
      nombre: 'Nueva Empresa',
      email: 'empresa@example.com',
      nit: '900000000-0'
    }
  ])

if (error) console.error(error)
```

### Ejemplo 4: Actualizar Datos

```typescript
const { data, error } = await supabase
  .from('empresas')
  .update({ status: 'inactiva' })
  .eq('id', 1)
```

### Ejemplo 5: Eliminar Datos

```typescript
const { error } = await supabase
  .from('empresas')
  .delete()
  .eq('id', 1)
```

---

## En Componentes React

```tsx
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

export default function EmpresisList() {
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEmpresas() {
      const { data } = await supabase
        .from('empresas')
        .select('*')
      
      setEmpresas(data || [])
      setLoading(false)
    }

    fetchEmpresas()
  }, [])

  if (loading) return <div>Cargando...</div>

  return (
    <ul>
      {empresas.map(empresa => (
        <li key={empresa.id}>{empresa.nombre}</li>
      ))}
    </ul>
  )
}
```

---

## Configuración en Variables de Entorno

### Desarrollo Local
Las variables están en: `frontend/.env`

### Producción (Vercel)
Debes agregarlas en Vercel Dashboard:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   ```
   VITE_SUPABASE_URL = https://ujsioelnrctyalqezyay.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY = sb_publishable_y59f2pj3iTmdzn5CW7A39w_UYR5PF5e
   ```
4. Redeploy

---

## Autenticación con Supabase (Opcional)

Si quieres agregar auth:

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Sign out
await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

---

## Problemas Comunes

### "Error: Missing credentials"
**Causa:** Variables .env no configuradas
**Solución:** Verifica que `.env` existe con las credenciales correctas

### "Error: relation does not exist"
**Causa:** La tabla no existe en Supabase
**Solución:** Crea la tabla en Supabase Dashboard primero

### CORS Error
**Causa:** Supabase no reconoce tu dominio
**Solución:** 
1. Ve a Supabase Dashboard
2. Project Settings → API
3. Agrega tu URL de Vercel a la lista de CORS

---

## Próximos Pasos

1. ✅ Frontend React + Supabase (HECHO)
2. ⏳ Backend Spring Boot sigue igual (PostgreSQL + Railway)
3. ⏳ Integrar autenticación Supabase (opcional)
4. ⏳ Crear tablas en Supabase que necesites

---

## Migrando tu BD a Supabase (Opcional)

Si quieres migrar tu PostgreSQL de Railway a Supabase:

1. Exportar datos de Railway PostgreSQL
2. Importar en Supabase
3. Actualizar conexión en Backend

**No es necesario,** tu setup actual (Railway + Spring Boot) funciona perfecto.

---

## Verificar Instalación

Para verificar que todo funciona:

```bash
cd frontend
npm run dev
```

Abre la consola del navegador (F12) y no deberías ver errores.

---

**¡Supabase está integrado!** 🎉

Próximo paso: Implementar en tus páginas o testear con el componente SupabaseExample.

