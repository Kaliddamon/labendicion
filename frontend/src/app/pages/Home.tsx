import React from 'react';
import { useNavigate } from 'react-router';
import { Scissors, Users, Sparkles, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Home = () => {
  const navigate = useNavigate();
  const { productos, tareasAseo, empleados } = useAppContext();

  // Datos rápidos para el dashboard
  const productosEnProceso = productos.filter(p => p.estado === 'En proceso').length;
  const tareasPendientes = tareasAseo.filter(t => !t.completada).length;
  const empleadosActivos = empleados.filter(e => e.estado === 'Activo').length;

  const modules = [
    { 
      path: '/produccion', 
      title: 'Producción', 
      desc: `${productosEnProceso} órdenes en proceso`,
      icon: Scissors,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50 text-blue-700'
    },
    { 
      path: '/empleados', 
      title: 'Empleados', 
      desc: `${empleadosActivos} activos trabajando`,
      icon: Users,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50 text-emerald-700'
    },
    { 
      path: '/aseo', 
      title: 'Gestión de Aseo', 
      desc: `${tareasPendientes} tareas pendientes`,
      icon: Sparkles,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50 text-amber-700'
    },
    { 
      path: '/rendimiento', 
      title: 'Desempeño', 
      desc: 'Ver estadísticas',
      icon: TrendingUp,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50 text-purple-700'
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 mt-4 md:mt-0 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-teal-900 mb-2">¡Hola, Equipo! 👋</h1>
        <p className="text-lg text-slate-500 font-medium">¿Qué vamos a hacer hoy en el taller?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => (
          <button
            key={mod.path}
            onClick={() => navigate(mod.path)}
            className={`${mod.lightColor} border-2 border-transparent hover:border-current flex items-center p-6 rounded-3xl shadow-sm hover:shadow-md transition-all active:scale-95 group text-left`}
          >
            <div className={`${mod.color} text-white p-5 rounded-2xl shadow-inner group-hover:scale-110 transition-transform`}>
              <mod.icon size={40} />
            </div>
            <div className="ml-6 flex-1">
              <h2 className="text-2xl font-bold mb-1">{mod.title}</h2>
              <p className="text-sm font-medium opacity-80">{mod.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-10 p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Aviso sobre los datos 💡</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Ya he reemplazado la sección de Facturación por "Empleados". Ahora puedes llevar el registro 
          de cada persona y evaluar su desempeño. También se ha mejorado la Producción con las fechas y ganancias que pediste.
        </p>
      </div>
    </div>
  );
};
