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
    <div className="min-h-screen flex">
      {/* ── Left Decorative Panel ─── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden" style={{ background: 'var(--indigo-deep)' }}>
        {/* Textile pattern overlay */}
        <div className="absolute inset-0 bg-textile-thread opacity-30" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--carbon)] via-[var(--indigo-deep)] to-[var(--indigo-deep)]" style={{ opacity: 0.7 }} />

        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,160,18,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-10 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,160,18,0.08) 0%, transparent 70%)' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="animate-fade-up">
            {/* Decorative line */}
            <div className="w-12 h-1 rounded-full mb-8" style={{ background: 'var(--accent-copper)' }} />

            <h2
              className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
            >
              Gestión textil
              <br />
              <span style={{ color: 'var(--accent-copper-bright)' }}>inteligente</span>
            </h2>

            <p className="text-slate-400 text-lg leading-relaxed max-w-md mb-10">
              Controla tu producción, equipo y calidad desde un solo lugar.
              Precisión y elegancia para tu taller.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3">
              {['Producción', 'Empleados', 'Calidad', 'Reportes'].map((feat, i) => (
                <span
                  key={feat}
                  className="animate-fade-up px-4 py-2 rounded-full text-sm font-medium border"
                  style={{
                    animationDelay: `${0.2 + i * 0.1}s`,
                    color: 'var(--accent-copper-bright)',
                    borderColor: 'rgba(212, 160, 18, 0.25)',
                    background: 'rgba(212, 160, 18, 0.08)',
                  }}
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom textile line decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-copper)]/30 to-transparent" />
      </div>

      {/* ── Right Login Panel ─── */}
      <div
        className="flex-1 flex items-center justify-center p-6 bg-textile-crosshatch"
        style={{ background: 'var(--surface-cotton)' }}
      >
        <div className="w-full max-w-sm animate-fade-up">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full animate-breathe" style={{ background: 'var(--accent-copper-glow)' }} />
              <img
                src="/logo.png"
                alt="Logo La Bendición"
                className="relative h-20 w-auto object-contain drop-shadow-lg"
              />
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-3xl font-bold text-center mb-1"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)', letterSpacing: '-0.02em' }}
          >
            La Bendición
          </h1>
          <p className="text-center text-slate-500 mb-8 text-sm font-medium tracking-wide uppercase" style={{ letterSpacing: '0.15em', fontSize: '11px' }}>
            Sistema de Gestión Textil
          </p>

          {/* Login Card */}
          <div
            className="card-premium-static p-8 rounded-2xl"
            style={{ background: 'var(--surface-silk)' }}
          >
            {error && (
              <div
                className="mb-5 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2 animate-scale-in"
                style={{
                  background: 'rgba(225, 29, 72, 0.06)',
                  border: '1px solid rgba(225, 29, 72, 0.15)',
                  color: '#be123c',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => setError('Error al conectar con Google')}
              />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: 'var(--border-fiber)' }} />
              <span className="text-xs text-slate-400 font-medium">Acceso seguro</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border-fiber)' }} />
            </div>

            <p className="mt-4 text-center text-xs text-slate-400">
              Solo cuentas autorizadas pueden ingresar al sistema.
            </p>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-[11px] text-slate-400">
            © {new Date().getFullYear()} La Bendición · Taller Textil
          </p>
        </div>
      </div>
    </div>
  );
};
