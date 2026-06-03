import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Scissors, Users, Sparkles, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const navigate = useNavigate();
  const { productos, registrosAseo, empleados, registros } = useAppContext();
  const { user } = useAuth();

  // ── Datos rápidos ───────────────────────────────────────
  const productosEnProceso = productos.filter(
    (p) => (p.estado ?? '').toString().trim().toLowerCase() === 'en proceso'
  ).length;
  const ultimoRegistroAseo =
    registrosAseo && registrosAseo.length > 0 ? registrosAseo[0] : null;
  const tareasPendientes = ultimoRegistroAseo
    ? ultimoRegistroAseo.entries.filter((e: any) => !e.completada).length
    : 0;
  const empleadosActivos = empleados.filter(
    (e) => e.estado === 'Activo'
  ).length;

  // ── Progreso global del taller ──────────────────────────
  const totalOrdenes = productos.length;
  const ordenesTerminadas = productos.filter(
    (p) => (p.estado ?? '').toString().trim().toLowerCase() === 'terminado'
  ).length;
  const ordenesPendientes = productos.filter(
    (p) => (p.estado ?? '').toString().trim().toLowerCase() === 'pendiente'
  ).length;
  const porcentajeProgreso =
    totalOrdenes > 0 ? Math.round((ordenesTerminadas / totalOrdenes) * 100) : 0;

  // ── Mini-gráfico semanal ────────────────────────────────
  const dataSemanal = useMemo(() => {
    const hoy = new Date();
    const hace7 = new Date();
    hace7.setDate(hoy.getDate() - 6);
    const fechaMin = hace7.toISOString().slice(0, 10);

    const registrosSemana = registros.filter((r) => r.fecha >= fechaMin);

    // Agrupar por día
    const agrupado = registrosSemana.reduce(
      (acc, reg) => {
        if (!acc[reg.fecha]) {
          acc[reg.fecha] = { fecha: reg.fecha, total: 0, buenas: 0 };
        }
        acc[reg.fecha].total += reg.unidadesTotales;
        acc[reg.fecha].buenas += reg.unidadesBuenas;
        return acc;
      },
      {} as Record<string, { fecha: string; total: number; buenas: number }>
    );

    // Generar los 7 días (para que no haya huecos)
    const dias: { dia: string; total: number; buenas: number }[] = [];
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(hoy.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const entry = agrupado[key];
      dias.push({
        dia: diasSemana[d.getDay()],
        total: entry?.total ?? 0,
        buenas: entry?.buenas ?? 0,
      });
    }
    return dias;
  }, [registros]);

  const totalSemanal = dataSemanal.reduce((acc, d) => acc + d.total, 0);
  const buenasSemanal = dataSemanal.reduce((acc, d) => acc + d.buenas, 0);

  // ── Saludo contextual ───────────────────────────────────
  const hora = new Date().getHours();
  const saludo =
    hora < 12 ? '☀️ Buenos días' : hora < 18 ? '🌤️ Buenas tardes' : '🌙 Buenas noches';
  const nombreUsuario = user?.name?.split(' ')[0] ?? 'Equipo';

  // ── Módulos de navegación ───────────────────────────────
  const modules = [
    {
      path: '/produccion',
      title: 'Producción',
      desc: `${productosEnProceso} órdenes en proceso`,
      icon: Scissors,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50 text-blue-700',
    },
    {
      path: '/empleados',
      title: 'Empleados',
      desc: `${empleadosActivos} activos trabajando`,
      icon: Users,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50 text-emerald-700',
    },
    {
      path: '/aseo',
      title: 'Gestión de Aseo',
      desc: `${tareasPendientes} tareas pendientes`,
      icon: Sparkles,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50 text-amber-700',
    },
    {
      path: '/rendimiento',
      title: 'Desempeño',
      desc: 'Ver estadísticas',
      icon: TrendingUp,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50 text-purple-700',
    },
  ];

  // ── Color de la barra de progreso según porcentaje ──────
  const progresoGradient =
    porcentajeProgreso >= 75
      ? 'from-emerald-400 to-emerald-600'
      : porcentajeProgreso >= 40
        ? 'from-amber-400 to-amber-600'
        : 'from-rose-400 to-rose-600';

  const progresoTextColor =
    porcentajeProgreso >= 75
      ? 'text-emerald-700'
      : porcentajeProgreso >= 40
        ? 'text-amber-700'
        : 'text-rose-700';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* ── Saludo ──────────────────────────────────────── */}
      <header className="mb-8 mt-4 md:mt-0 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-teal-900 mb-2">
          {saludo}, {nombreUsuario}! 👋
        </h1>
        <p className="text-lg text-slate-500 font-medium">
          ¿Qué vamos a hacer hoy en el taller?
        </p>
      </header>

      {/* ── Barra de Progreso Global ────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Progreso Global del Taller
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {ordenesTerminadas} de {totalOrdenes} órdenes completadas
              {ordenesPendientes > 0 && (
                <span className="text-amber-600 ml-2 font-medium">
                  · {ordenesPendientes} pendientes
                </span>
              )}
              {productosEnProceso > 0 && (
                <span className="text-blue-600 ml-2 font-medium">
                  · {productosEnProceso} en proceso
                </span>
              )}
            </p>
          </div>
          <span
            className={`text-3xl font-extrabold tabular-nums ${progresoTextColor}`}
          >
            {porcentajeProgreso}%
          </span>
        </div>

        {/* Barra */}
        <div className="relative h-5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${progresoGradient} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${porcentajeProgreso}%` }}
          />
          {/* Brillo animado */}
          <div
            className={`absolute inset-y-0 left-0 rounded-full overflow-hidden transition-all duration-1000 ease-out`}
            style={{ width: `${porcentajeProgreso}%` }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                animation: 'shimmer 2s infinite',
              }}
            />
          </div>
        </div>

        {/* Mini leyenda debajo de la barra */}
        <div className="flex items-center gap-5 mt-3 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Terminadas ({ordenesTerminadas})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            En proceso ({productosEnProceso})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
            Pendientes ({ordenesPendientes})
          </span>
        </div>
      </div>

      {/* ── Mini Gráfico de Producción Semanal ──────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Producción esta semana
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Últimos 7 días de actividad del taller
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {totalSemanal.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                unidades totales
              </p>
            </div>
            {totalSemanal > 0 && (
              <div className="text-right pl-4 border-l border-slate-200">
                <p className="text-2xl font-extrabold text-emerald-600 tabular-nums">
                  {totalSemanal > 0
                    ? Math.round((buenasSemanal / totalSemanal) * 100)
                    : 0}
                  %
                </p>
                <p className="text-xs text-slate-500 font-medium">calidad</p>
              </div>
            )}
          </div>
        </div>

        <div className="h-52 -mx-2">
          {totalSemanal > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataSemanal}>
                <defs>
                  <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradBuenas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="dia"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke="#14b8a6"
                  strokeWidth={2.5}
                  fill="url(#gradTotal)"
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="buenas"
                  name="Buenas"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#gradBuenas)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <TrendingUp size={40} className="mb-2 opacity-40" />
              <p className="text-sm font-medium">
                Sin registros de producción esta semana
              </p>
              <p className="text-xs mt-1">
                Los datos aparecerán cuando se registre actividad
              </p>
            </div>
          )}
        </div>

        {/* Leyenda del gráfico */}
        {totalSemanal > 0 && (
          <div className="flex items-center gap-5 mt-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
              Total producido
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              Unidades buenas
            </span>
          </div>
        )}
      </div>

      {/* ── Módulos de Navegación ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => (
          <button
            key={mod.path}
            onClick={() => navigate(mod.path)}
            className={`${mod.lightColor} border-2 border-transparent hover:border-current flex items-center p-6 rounded-3xl shadow-sm hover:shadow-md transition-all active:scale-95 group text-left`}
          >
            <div
              className={`${mod.color} text-white p-5 rounded-2xl shadow-inner group-hover:scale-110 transition-transform`}
            >
              <mod.icon size={40} />
            </div>
            <div className="ml-6 flex-1">
              <h2 className="text-2xl font-bold mb-1">{mod.title}</h2>
              <p className="text-sm font-medium opacity-80">{mod.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Keyframes para el shimmer de la barra */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};
