import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
  allowNoRole?: boolean;
}

/**
 * Componente para proteger rutas según roles y permisos
 *
 * Ejemplo:
 * <ProtectedRoute requiredRoles={['ADMINISTRADOR', 'SUPERADMINISTRADOR']}>
 *   <MiComponente />
 * </ProtectedRoute>
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallback,
  allowNoRole,
}) => {
  const { isAuthenticated, roles, tienePermiso } = useAuth();

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar roles
  if (requiredRoles.length > 0) {
    const tieneRolRequerido = requiredRoles.some((rol) => roles.includes(rol));
    if (!tieneRolRequerido) {
      return (
        fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
              <Lock size={48} className="mx-auto text-red-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
              <p className="text-gray-600 mb-4">
                No tienes los permisos necesarios para acceder a esta sección.
              </p>
              <p className="text-sm text-gray-500">
                Roles requeridos: {requiredRoles.join(', ')}
              </p>
            </div>
          </div>
        )
      );
    }
  }

  // Verificar permisos
  if (requiredPermissions.length > 0) {
    const tienePermisoRequerido = requiredPermissions.some((perm) => tienePermiso(perm));
    if (!tienePermisoRequerido) {
      return (
        fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
              <Lock size={48} className="mx-auto text-red-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
              <p className="text-gray-600 mb-4">
                No tienes los permisos necesarios para acceder a esta sección.
              </p>
            </div>
          </div>
        )
      );
    }
  }

  return <>{children}</>;
};

