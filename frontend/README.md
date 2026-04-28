# Frontend La Bendicion

## Desarrollo local

- `npm i`
- `npm run dev`

## Tests

- `npm test` ejecuta Vitest en modo CI.
- `npm run test:watch` ejecuta Vitest en modo interactivo.

## Deploy en Vercel

1. Importa el repo/proyecto en Vercel.
2. Define la variable de entorno:
   - `VITE_API_BASE_URL=https://<tu-backend-railway>/api/frontend`
3. Vercel usara `vercel.json` para:
   - construir con Vite,
   - publicar `dist`,
   - y reescribir rutas SPA a `index.html`.

Puedes usar `.env.example` como referencia para las variables.
  