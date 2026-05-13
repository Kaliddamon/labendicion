import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';

// No pongas aquí fetch a Supabase: App solo envuelve la app en contexto + rutas.
// Usa una página (p. ej. /supabase → SupabaseExample) como indica Supabase pero sin reemplazar el router.

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
