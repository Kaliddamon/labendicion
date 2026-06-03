import React, { useState } from 'react';
import { useNavigate } from 'react-router';
// @ts-ignore
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setError('');
      const response = await fetch(`${API_BASE}/api/auth/verify-google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!response.ok) {
        throw new Error('Error en autenticación');
      }

      const data = await response.json();
      login(credentialResponse.credential as string, {
        id: data.id,
        email: data.email,
        name: data.name,
        picture: data.picture,
      }, data.roles || []);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center'>
      <div className='bg-white rounded-2xl shadow-xl p-8 max-w-md w-full'>
        <div className='flex justify-center mb-4'>
          <img src="/logo.png" alt="Logo La Bendición" className="h-24 w-auto object-contain" />
        </div>
        <h1 className='text-3xl font-bold text-center text-teal-900 mb-4'>La Bendición</h1>
        <p className='text-center text-slate-600 mb-6 text-sm'>Sistema de Gestión Textil</p>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 text-sm'>
            {error}
          </div>
        )}

        <div className='flex justify-center'>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError('Error al conectar con Google')}
          />
        </div>
      </div>
    </div>
  );
};
