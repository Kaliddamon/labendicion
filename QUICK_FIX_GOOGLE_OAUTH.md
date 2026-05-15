## Verificación Rápida - Error "no registered origin"

### Paso 1: ¿Tienes .env en frontend?
Archivo: `frontend/.env`
```env
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:8080
```

Si NO existe, CRÉALO.

### Paso 2: ¿Registraste el origen en Google?
1. https://console.cloud.google.com
2. APIs y Servicios → Credenciales
3. Tu app OAuth2 → Editar
4. "Orígenes de JavaScript autorizados"
5. Agrega: `http://localhost:5173`
6. Guarda

### Paso 3: Reinicia Frontend
```bash
npm run dev
```

---

**El error "no registered origin" significa:** El URL donde abres la app NO está registrado en Google Console.

