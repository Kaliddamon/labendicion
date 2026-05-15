import React from 'react';
import { RouterProvider } from 'react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { router } from './routes';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

// IMPORTANTE: Obtén tu Google Client ID en https://console.cloud.google.com
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function App() {
  if (!GOOGLE_CLIENT_ID) {
    return <div className="p-4 text-red-600">Error: VITE_GOOGLE_CLIENT_ID no configurado</div>;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
