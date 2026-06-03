import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import { Home, Scissors, Users, Sparkles, TrendingUp, LogOut, Shield, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
  const navigate = useNavigate();
  const { logout, user, roles } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/produccion', icon: Scissors, label: 'Producción', requiredRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] },
    { path: '/empleados', icon: Users, label: 'Empleados', requiredRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] },
    { path: '/aseo', icon: Sparkles, label: 'Aseo', requiredRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR', 'TRABAJADOR'] },
    { path: '/rendimiento', icon: TrendingUp, label: 'Desempeño', requiredRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR', 'TRABAJADOR'] },
    { path: '/roles', icon: Shield, label: 'Roles', requiredRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] },
    { path: '/configuracion', icon: Settings, label: 'Config', requiredRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (!item.requiredRoles) return true;
    return item.requiredRoles.some(rol => roles.includes(rol));
  });

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-800 font-sans md:flex-row">
      <main className="order-1 flex min-h-0 min-w-0 flex-1 flex-col pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:order-2 md:pb-0">
        <div className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      <aside
        className={[
          'order-2 z-50 flex shrink-0 justify-center',
          'fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] max-w-lg mx-auto',
          'rounded-2xl border border-teal-700/20 bg-teal-800/95 p-2 shadow-2xl backdrop-blur-md',
          'md:static md:inset-auto md:mx-0 md:max-w-none md:min-h-dvh md:w-[5.25rem] md:flex-col md:justify-start md:rounded-none md:border-0 md:border-r md:border-slate-200 md:bg-white md:p-3 md:shadow-sm md:backdrop-blur-none lg:w-28',
        ].join(' ')}
      >
        <div className="hidden md:flex md:flex-col md:items-center md:pt-6 md:pb-4 text-teal-600">
          <img src="/logo.png" alt="Logo Taller" className="w-24 h-24 object-contain shrink-0" />
          <span className="mt-2 text-center text-[10px] font-bold uppercase tracking-widest leading-tight">
            Taller
          </span>
        </div>

        <nav className="flex w-full flex-1 items-center justify-around gap-1 px-1 py-1 md:flex md:flex-col md:justify-start md:gap-2 md:px-0 md:py-4">
          {filteredNavItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                [
                  'flex shrink-0 flex-col items-center justify-center rounded-xl transition-all duration-200',
                  'h-14 w-[4.25rem] sm:w-16 md:h-[4.25rem] md:w-full md:max-w-[4.5rem] md:mx-auto',
                  isActive
                    ? 'bg-amber-400 text-teal-900 shadow-inner md:bg-teal-50 md:text-teal-700 md:shadow-md'
                    : 'text-teal-50 hover:bg-teal-700/50 md:text-slate-500 md:hover:bg-slate-100 md:hover:text-teal-700',
                ].join(' ')
              }
            >
              <Icon size={24} strokeWidth={2} className="mb-0.5 md:size-[26px]" />
              <span className="max-w-full truncate px-0.5 text-[9px] font-semibold tracking-wide md:text-[10px]">
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex md:flex-col md:items-center md:gap-2 md:border-t md:border-slate-200 md:pt-3 md:mt-auto">
          {user && (
            <div className="text-center">
              {user.picture && (
                <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full mx-auto mb-2" />
              )}
              <p className="text-xs font-medium text-slate-600 truncate px-2">{user.name}</p>
              {roles.length > 0 && (
                <p className="text-[9px] text-slate-500 mt-1 px-2">
                  {roles.join(', ')}
                </p>
              )}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center rounded-xl transition-all duration-200 h-[4.25rem] w-full max-w-[4.5rem] mx-auto text-slate-500 hover:bg-red-50 hover:text-red-600"
            title="Cerrar sesión"
          >
            <LogOut size={24} strokeWidth={2} className="mb-0.5" />
            <span className="text-[9px] font-semibold tracking-wide">Salir</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
