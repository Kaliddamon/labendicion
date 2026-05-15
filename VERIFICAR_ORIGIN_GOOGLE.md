# 🔍 Verificar el Origin que Google Ve

## Método 1: Component de Debug (Automático)

Acabé de agregar un componente de debug a tu app. Cuando abras la app, verás un recuadro **verde fluorescente** en la esquina inferior derecha que te muestra:

```
window.location.origin: https://labendicion-beta.vercel.app
```

**Este es el origin exacto que Google va a ver.**

### Para ver el debug:
1. Recarga tu app: `https://labendicion-beta.vercel.app`
2. Mira la esquina inferior derecha
3. Verás el origin en verde
4. **Registra exactamente ese origin en Google Cloud Console**

---

## Método 2: Consola del Navegador (Manual)

Si quieres verificarlo manualmente:

1. Abre tu app: `https://labendicion-beta.vercel.app`
2. Presiona `F12` (abre Developer Tools)
3. Ve a la pestaña **"Console"**
4. Escribe:
```javascript
window.location.origin
```
5. Presiona Enter
6. Verás el origin exacto

**Ejemplo de salida:**
```
> window.location.origin
< "https://labendicion-beta.vercel.app"
```

---

## Método 3: Network Tab (Avanzado)

Para ver qué está enviando Google:

1. Abre Developer Tools (F12)
2. Ve a **"Network"**
3. Busca requests a `accounts.google.com` o `lh.googleusercontent`
4. En los headers verá `Origin: https://labendicion-beta.vercel.app`
5. Ese es el origin que Google recibe

---

## ✅ Qué Verificar

El origin debe ser **exactamente así:**
```
https://labendicion-beta.vercel.app
```

☑️ **CORRECTO:**
- `https://labendicion-beta.vercel.app`

❌ **INCORRECTO (no registres estos):**
- `https://labendicion-beta.vercel.app/` (no incluir `/` al final)
- `https://labendicion-beta.vercel.app/login` (no incluir rutas)
- `labendicion-beta.vercel.app` (falta `https://`)
- `http://labendicion-beta.vercel.app` (debe ser `https://`)

---

## 🔧 Próximos Pasos

### 1. Ve a Google Cloud Console
https://console.cloud.google.com

### 2. APIs y Servicios → Credenciales

### 3. Edita tu OAuth2 App

### 4. "Orígenes de JavaScript autorizados"
Asegúrate de que esté registrado:
```
https://labendicion-beta.vercel.app
```

### 5. "URIs de redirección autorizados"
Asegúrate de que esté registrado:
```
https://labendicion-beta.vercel.app
```

### 6. Guarda

---

## 📝 Nota

El component de debug solo aparece si recargas la página. Desaparecerá después cuando hagas login (porque se redirige a Home).

Si quieres desactivar el debug después, simplemente quita la línea `<DebugOrigin />` de `App.tsx`.

