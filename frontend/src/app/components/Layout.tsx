import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import { Home, Scissors, Users, Sparkles, TrendingUp, LogOut, Shield, Settings, Mail, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
  const navigate = useNavigate();
  const { logout, user, roles } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { category: 'General', items: [
      { path: '/', icon: Home, label: 'Inicio' },
    ]},
    { category: 'Operación', items: [
      { path: '/produccion', icon: Scissors, label: 'Producción', requiredRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] },
      { path: '/empleados', icon: Users, label: 'Empleados', requiredRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] },
      { path: '/aseo', icon: Sparkles, label: 'Aseo', requiredRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR', 'TRABAJADOR'] },
      { path: '/rendimiento', icon: TrendingUp, label: 'Desempeño', requiredRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR', 'TRABAJADOR'] },
    ]},
    { category: 'Sistema', items: [
      { path: '/configuracion', icon: Settings, label: 'Configuración', requiredRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] },
      { path: '/mensajes', icon: Mail, label: 'Mensajes', requiredRoles: ['SUPERADMINISTRADOR', 'ADMINISTRADOR'] },
    ]}
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-800 font-sans md:flex-row">
      <main className="order-1 flex min-h-0 min-w-0 flex-1 flex-col pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:order-2 md:pb-0 md:pl-[5.5rem]">
        <div className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Floating Desktop Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setShowProfileMenu(false); }}
        className={`
          hidden md:flex flex-col fixed left-4 top-4 bottom-4 z-50 rounded-2xl
          bg-[#1a3a5c]/85 backdrop-blur-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]
          transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-visible
          ${isHovered ? 'w-64' : 'w-16'}
        `}
      >
        {/* Logo Section */}
        <div className={`flex items-center pt-6 pb-4 px-3 ${isHovered ? 'justify-start' : 'justify-center'} overflow-hidden whitespace-nowrap`}>
          <div className={`shrink-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'w-14 h-14' : 'w-10 h-10'}`}>
            <img 
              src="/logo.png" 
              alt="Logo Taller" 
              className="w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] transition-transform duration-300"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <div className={`ml-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 w-0'}`}>
            <span className="block text-base font-bold tracking-widest text-white uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
              Taller
            </span>
            <span className="block text-xs text-blue-200 tracking-wider">La Bendición</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 custom-scrollbar">
          {navItems.map((group, idx) => {
            const visibleItems = group.items.filter(item => !item.requiredRoles || item.requiredRoles.some(rol => roles.includes(rol)));
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="mb-6">
                <div className={`mb-2 px-1 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                  <span className="text-[10px] font-bold text-blue-300/60 uppercase tracking-widest">
                    {group.category}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {visibleItems.map(({ path, icon: Icon, label }) => (
                    <NavLink
                      key={path}
                      to={path}
                      end={path === '/'}
                      className={({ isActive }) => `
                        relative flex items-center shrink-0 rounded-xl transition-all duration-300 group
                        ${isHovered ? 'px-3 py-3' : 'justify-center h-10 w-10 mx-auto'}
                        ${isActive 
                          ? 'bg-white/10 text-white shadow-inner' 
                          : 'text-blue-100/70 hover:bg-white/5 hover:text-white'
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-amber-400 rounded-r-full" />
                          )}
                          <Icon size={isHovered ? 18 : 20} strokeWidth={isActive ? 2.5 : 2} className={`shrink-0 transition-colors ${isActive ? 'text-amber-400' : ''}`} />
                          <span className={`
                            ml-3 text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-300
                            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute pointer-events-none'}
                          `}>
                            {label}
                          </span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Profile Section */}
        {user && (
          <div className="relative mt-auto p-3">
            {/* Popover */}
            <div className={`
              absolute bottom-full left-4 mb-2 w-48 rounded-2xl bg-white shadow-2xl border border-slate-100 p-2
              transition-all duration-300 origin-bottom-left
              ${showProfileMenu && isHovered ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}
            `}>
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
              >
                <LogOut size={14} />
                Cerrar Sesión
              </button>
            </div>

            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`
                w-full flex items-center rounded-xl transition-all duration-300 border
                ${showProfileMenu ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent hover:bg-white/5'}
                ${isHovered ? 'p-2' : 'p-1 justify-center h-10 w-10 mx-auto'}
              `}
            >
              <div className="relative shrink-0">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className={`rounded-full object-cover transition-all ${isHovered ? 'w-8 h-8' : 'w-7 h-7'}`} />
                ) : (
                  <div className={`bg-blue-600 rounded-full flex items-center justify-center transition-all ${isHovered ? 'w-8 h-8' : 'w-7 h-7'}`}>
                    <UserCircle size={18} className="text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#1a3a5c] rounded-full" />
              </div>
              
              <div className={`ml-3 text-left overflow-hidden whitespace-nowrap transition-all duration-300 ${isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[9px] text-blue-200/70 truncate">{roles[0] || 'Sin Rol'}</p>
              </div>
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Bottom Bar */}
      <aside className="md:hidden fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] z-50 flex shrink-0 justify-center">
        <div className="w-full max-w-md rounded-2xl border border-slate-200/50 bg-white/90 p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl flex justify-around items-center">
          {navItems.flatMap(g => g.items)
            .filter(item => !item.requiredRoles || item.requiredRoles.some(rol => roles.includes(rol)))
            .map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) => `
                flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-200 relative
                ${isActive ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'}
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute top-0 inset-x-4 h-0.5 bg-amber-400 rounded-b-full shadow-[0_2px_8px_rgba(251,191,36,0.8)]" />
                  )}
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="mb-0.5" />
                  <span className="text-[8px] font-semibold tracking-wide truncate max-w-full px-1">{label}</span>
                </>
              )}
            </NavLink>
          ))}
          {user && (
            <button onClick={handleLogout} className="flex flex-col items-center justify-center w-14 h-12 rounded-xl text-slate-400 hover:text-rose-500 transition-colors">
              <LogOut size={20} />
              <span className="text-[8px] font-semibold tracking-wide mt-0.5">Salir</span>
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};

