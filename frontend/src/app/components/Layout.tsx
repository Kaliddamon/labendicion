import React from 'react';
import { Outlet, NavLink } from 'react-router';
import { Home, Scissors, Users, Sparkles, TrendingUp } from 'lucide-react';

export const Layout = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/produccion', icon: Scissors, label: 'Producción' },
    { path: '/empleados', icon: Users, label: 'Empleados' },
    { path: '/aseo', icon: Sparkles, label: 'Aseo' },
    { path: '/rendimiento', icon: TrendingUp, label: 'Desempeño' },
  ];

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
          <Scissors size={36} strokeWidth={1.5} className="shrink-0" />
          <span className="mt-2 text-center text-[10px] font-bold uppercase tracking-widest leading-tight">
            Taller
          </span>
        </div>

        <nav className="flex w-full flex-1 items-center justify-around gap-1 px-1 py-1 md:flex md:flex-col md:justify-start md:gap-2 md:px-0 md:py-4">
          {navItems.map(({ path, icon: Icon, label }) => (
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
      </aside>
    </div>
  );
};
