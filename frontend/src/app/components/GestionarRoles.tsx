import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Check, X, Shield, Crown, Briefcase, User, Eye } from 'lucide-react';

export const GestionarRoles = () => {
  const { user, tieneRol } = useAuth();
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('ADMINISTRADOR');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  // Verificar permisos
  if (!tieneRol('SUPERADMINISTRADOR') && !tieneRol('ADMINISTRADOR')) {
    return (
      <div
        className="p-5 rounded-xl flex items-center gap-3 text-sm font-medium"
        style={{
          background: 'rgba(225, 29, 72, 0.06)',
          border: '1px solid rgba(225, 29, 72, 0.15)',
          color: '#be123c',
        }}
      >
        <AlertCircle size={20} />
        No tienes permiso para gestionar roles.
      </div>
    );
  }

  const salAllowedRoles = tieneRol('SUPERADMINISTRADOR')
    ? ['ADMINISTRADOR', 'SUPERVISOR', 'TRABAJADOR', 'USUARIO']
    : ['SUPERVISOR', 'TRABAJADOR', 'USUARIO'];

  const handleAsignarRol = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/roles/asignar`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ email, nombreRol: rol }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessageType('success');
        setMessage(`Rol ${rol} asignado a ${email}`);
        setEmail('');
        setRol('ADMINISTRADOR');
      } else {
        setMessageType('error');
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessageType('error');
      setMessage(`Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const roleCards = [
    {
      name: 'Superadministrador',
      desc: 'Acceso total + asignar administradores',
      icon: Crown,
      gradient: 'from-violet-500 to-violet-600',
      bg: 'rgba(124, 58, 237, 0.06)',
      border: 'rgba(124, 58, 237, 0.15)',
    },
    {
      name: 'Administrador',
      desc: 'Acceso casi total + asignar trabajadores',
      icon: Shield,
      gradient: 'from-blue-500 to-blue-600',
      bg: 'rgba(37, 99, 235, 0.06)',
      border: 'rgba(37, 99, 235, 0.15)',
    },
    {
      name: 'Supervisor',
      desc: 'Gestionar operaciones (sin finanzas ni roles)',
      icon: Eye,
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'rgba(16, 185, 129, 0.06)',
      border: 'rgba(16, 185, 129, 0.15)',
    },
    {
      name: 'Trabajador',
      desc: 'Ver aseo, rendimiento y dashboard',
      icon: Briefcase,
      gradient: 'from-amber-500 to-amber-600',
      bg: 'rgba(217, 119, 6, 0.06)',
      border: 'rgba(217, 119, 6, 0.15)',
    },
    {
      name: 'Usuario',
      desc: 'Sin permisos (por ahora)',
      icon: User,
      gradient: 'from-slate-400 to-slate-500',
      bg: 'var(--surface-linen)',
      border: 'var(--border-fiber)',
    },
  ];

  const inputStyle = {
    background: 'var(--surface-linen)',
    border: '1px solid var(--border-fiber)',
    color: 'var(--carbon)',
  };

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'var(--accent-copper)' }} />
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Seguridad
          </span>
        </div>
        <h1
          className="text-3xl font-bold flex items-center gap-3"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}
        >
          Gestionar Roles
          <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">
            <Shield size={18} className="text-violet-600" />
          </div>
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm">Asigna permisos a los miembros del equipo</p>
      </div>

      {/* Current user info */}
      <div
        className="rounded-xl px-5 py-3 mb-6 flex items-center gap-3"
        style={{
          background: 'rgba(37, 99, 235, 0.06)',
          border: '1px solid rgba(37, 99, 235, 0.12)',
        }}
      >
        {user?.picture && (
          <img src={user.picture} alt="" className="w-8 h-8 rounded-full" />
        )}
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--carbon)' }}>
            {user?.name}
          </p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>

      {/* Assign role form */}
      <form onSubmit={handleAsignarRol} className="card-premium-static p-6 rounded-2xl mb-8">
        <h2
          className="text-lg font-bold mb-5"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}
        >
          Asignar un rol
        </h2>

        <div className="space-y-4 mb-5">
          <div>
            <label
              className="block text-xs font-medium text-slate-500 mb-1.5"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Correo electrónico del usuario
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@gmail.com"
              className="w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none focus:border-[var(--accent-copper)] focus:ring-2 focus:ring-[var(--accent-copper-glow)]"
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label
              className="block text-xs font-medium text-slate-500 mb-1.5"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Rol a asignar
            </label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none focus:border-[var(--accent-copper)] focus:ring-2 focus:ring-[var(--accent-copper-glow)]"
              style={inputStyle}
            >
              {salAllowedRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none"
          style={{
            background: 'var(--accent-copper)',
            boxShadow: 'var(--shadow-copper)',
          }}
        >
          {loading ? 'Asignando...' : 'Asignar Rol'}
        </button>

        {/* Message */}
        {message && (
          <div
            className="mt-4 p-4 rounded-xl flex items-center gap-2.5 text-sm font-medium animate-scale-in"
            style={{
              background: messageType === 'success' ? 'rgba(22, 163, 74, 0.06)' : 'rgba(225, 29, 72, 0.06)',
              border: `1px solid ${messageType === 'success' ? 'rgba(22, 163, 74, 0.15)' : 'rgba(225, 29, 72, 0.15)'}`,
              color: messageType === 'success' ? '#15803d' : '#be123c',
            }}
          >
            {messageType === 'success' ? <Check size={18} /> : <X size={18} />}
            {message}
          </div>
        )}
      </form>

      {/* Available roles */}
      <div>
        <h3
          className="text-sm font-bold mb-4"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}
        >
          Roles disponibles
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {roleCards.map((role) => (
            <div
              key={role.name}
              className="rounded-xl p-4 flex items-start gap-4"
              style={{
                background: role.bg,
                border: `1px solid ${role.border}`,
              }}
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shrink-0`}
              >
                <role.icon size={18} className="text-white" />
              </div>
              <div>
                <p
                  className="font-bold text-sm"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}
                >
                  {role.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{role.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
