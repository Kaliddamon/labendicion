import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Check, X } from 'lucide-react';

export const GestionarRoles = () => {
  const { user, tieneRol, roles } = useAuth();
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('ADMINISTRADOR');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  // Verificar permisos
  if (!tieneRol('SUPERADMINISTRADOR') && !tieneRol('ADMINISTRADOR')) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <AlertCircle className="inline mr-2" size={20} />
        No tienes permiso para gestionar roles.
      </div>
    );
  }

  const salAllowedRoles = tieneRol('SUPERADMINISTRADOR')
    ? ['ADMINISTRADOR', 'TRABAJADOR', 'USUARIO']
    : ['TRABAJADOR', 'USUARIO'];

  const handleAsignarRol = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/roles/asignar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nombreRol: rol }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessageType('success');
        setMessage(`✓ Rol ${rol} asignado a ${email}`);
        setEmail('');
        setRol('ADMINISTRADOR');
      } else {
        setMessageType('error');
        setMessage(`✗ Error: ${data.error}`);
      }
    } catch (err) {
      setMessageType('error');
      setMessage(`✗ Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-teal-900">Gestionar Roles</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Usuario actual:</strong> {user?.name} ({user?.email})
        </p>
        <p className="text-sm text-blue-800 mt-1">
          <strong>Rol:</strong> {roles.join(', ') ? 'Sin rol' : 'Usuario'}
        </p>
      </div>

      <form onSubmit={handleAsignarRol} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico del usuario
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@gmail.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rol a asignar
          </label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            {salAllowedRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition"
        >
          {loading ? 'Asignando...' : 'Asignar Rol'}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-4 rounded-lg flex items-center ${
            messageType === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {messageType === 'success' ? (
            <Check size={20} className="mr-2" />
          ) : (
            <X size={20} className="mr-2" />
          )}
          {message}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Disponibles:</h3>
        <div className="space-y-3">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="font-semibold text-purple-900">Superadministrador</p>
            <p className="text-sm text-purple-700">Acceso total + asignar administradores</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-semibold text-blue-900">Administrador</p>
            <p className="text-sm text-blue-700">Acceso casi total + asignar trabajadores</p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="font-semibold text-yellow-900">Trabajador</p>
            <p className="text-sm text-yellow-700">Ver aseo, rendimiento y dashboard</p>
          </div>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="font-semibold text-gray-900">Usuario</p>
            <p className="text-sm text-gray-700">Sin permisos (por ahora)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

