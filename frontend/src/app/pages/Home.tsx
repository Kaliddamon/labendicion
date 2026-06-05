import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Scissors, Users, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
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
    hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';
  const nombreUsuario = user?.name?.split(' ')[0] ?? 'Equipo';

  // ── Módulos de navegación ───────────────────────────────
  const modules = [
    {
      path: '/produccion',
      title: 'Producción',
      desc: `${productosEnProceso} órdenes en proceso`,
      icon: Scissors,
      gradient: 'from-blue-600 to-blue-700',
      lightBg: 'bg-blue-50',
      lightText: 'text-blue-700',
      accent: '#2563eb',
    },
    {
      path: '/empleados',
      title: 'Empleados',
      desc: `${empleadosActivos} activos trabajando`,
      icon: Users,
      gradient: 'from-emerald-600 to-emerald-700',
      lightBg: 'bg-emerald-50',
      lightText: 'text-emerald-700',
      accent: '#16a34a',
    },
    {
      path: '/aseo',
      title: 'Gestión de Aseo',
      desc: `${tareasPendientes} tareas pendientes`,
      icon: Sparkles,
      gradient: 'from-amber-500 to-amber-600',
      lightBg: 'bg-amber-50',
      lightText: 'text-amber-700',
      accent: '#d97706',
    },
    {
      path: '/rendimiento',
      title: 'Desempeño',
      desc: 'Ver estadísticas',
      icon: TrendingUp,
      gradient: 'from-violet-600 to-violet-700',
      lightBg: 'bg-violet-50',
      lightText: 'text-violet-700',
      accent: '#7c3aed',
    },
  ];

  // ── Color de la barra de progreso ──────
  const progresoColor =
    porcentajeProgreso >= 75
      ? { gradient: 'from-emerald-400 to-emerald-600', text: 'text-emerald-700', bg: 'rgba(22,163,74,0.1)' }
      : porcentajeProgreso >= 40
        ? { gradient: 'from-amber-400 to-amber-600', text: 'text-amber-700', bg: 'rgba(217,119,6,0.1)' }
        : { gradient: 'from-rose-400 to-rose-600', text: 'text-rose-700', bg: 'rgba(225,29,72,0.1)' };

  return (
    <div className="pb-8">
      {/* ── Saludo ──────────────────────────────────────── */}
      <header className="mb-8 mt-4 md:mt-0 animate-fade-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'var(--accent-copper)' }} />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400" style={{ fontFamily: 'var(--font-heading)' }}>
            Panel de control
          </span>
        </div>
        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)', letterSpacing: '-0.02em' }}
        >
          {saludo}, {nombreUsuario}
        </h1>
        <p className="text-base text-slate-500 font-medium">
          ¿Qué vamos a hacer hoy en el taller?
        </p>
      </header>

      {/* ── Barra de Progreso Global ────────────────────── */}
      <div
        className="rounded-2xl p-6 mb-6 animate-fade-up stagger-1"
        style={{
          background: 'linear-gradient(135deg, var(--indigo-deep) 0%, #1a1a2e 100%)',
          boxShadow: '0 8px 32px rgba(26, 26, 46, 0.15)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2
              className="text-base font-semibold text-white/90 mb-1"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Progreso Global del Taller
            </h2>
            <p className="text-sm text-slate-400">
              {ordenesTerminadas} de {totalOrdenes} órdenes completadas
              {ordenesPendientes > 0 && (
                <span className="text-amber-400/80 ml-2 font-medium">
                  · {ordenesPendientes} pendientes
                </span>
              )}
              {productosEnProceso > 0 && (
                <span className="text-blue-400/80 ml-2 font-medium">
                  · {productosEnProceso} en proceso
                </span>
              )}
            </p>
          </div>
          <span
            className="text-4xl font-bold tabular-nums text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {porcentajeProgreso}
            <span className="text-lg text-white/50 ml-0.5">%</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${progresoColor.gradient} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${porcentajeProgreso}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 rounded-full overflow-hidden transition-all duration-1000 ease-out"
            style={{ width: `${porcentajeProgreso}%` }}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                animation: 'shimmer 2.5s infinite',
              }}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-3 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Terminadas ({ordenesTerminadas})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
            En proceso ({productosEnProceso})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-500 inline-block" />
            Pendientes ({ordenesPendientes})
          </span>
        </div>
      </div>

      {/* ── Mini Gráfico de Producción Semanal ──────────── */}
      <div className="card-premium-static rounded-2xl p-6 mb-6 animate-fade-up stagger-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2
              className="text-base font-semibold mb-0.5"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}
            >
              Producción esta semana
            </h2>
            <p className="text-sm text-slate-500">
              Últimos 7 días de actividad del taller
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p
                className="text-2xl font-bold tabular-nums"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}
              >
                {totalSemanal.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 font-medium">unidades totales</p>
            </div>
            {totalSemanal > 0 && (
              <div className="text-right pl-4" style={{ borderLeft: '1px solid var(--border-fiber)' }}>
                <p
                  className="text-2xl font-bold tabular-nums text-emerald-600"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {totalSemanal > 0 ? Math.round((buenasSemanal / totalSemanal) * 100) : 0}%
                </p>
                <p className="text-xs text-slate-500 font-medium">calidad</p>
              </div>
            )}
          </div>
        </div>

        <div className="h-48 -mx-2">
          {totalSemanal > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataSemanal}>
                <defs>
                  <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4a012" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#d4a012" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradBuenas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e8e2d9"
                />
                <XAxis
                  dataKey="dia"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
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
                    border: '1px solid #e8e2d9',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                    fontFamily: 'var(--font-body)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke="#d4a012"
                  strokeWidth={2.5}
                  fill="url(#gradTotal)"
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, fill: '#d4a012', stroke: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="buenas"
                  name="Buenas"
                  stroke="#16a34a"
                  strokeWidth={2}
                  fill="url(#gradBuenas)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, fill: '#16a34a', stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'var(--surface-linen)' }}>
                <TrendingUp size={28} className="opacity-50" />
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--carbon)' }}>
                Sin registros esta semana
              </p>
              <p className="text-xs mt-1 text-slate-400">
                Los datos aparecerán cuando se registre actividad
              </p>
            </div>
          )}
        </div>

        {/* Legend */}
        {totalSemanal > 0 && (
          <div className="flex items-center gap-5 mt-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--accent-copper)' }} />
              Total producido
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Unidades buenas
            </span>
          </div>
        )}
      </div>

      {/* ── Módulos de Navegación ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod, i) => (
          <button
            key={mod.path}
            onClick={() => navigate(mod.path)}
            className={`animate-fade-up stagger-${i + 3} card-premium group text-left p-5 flex items-center gap-5 rounded-2xl`}
          >
            {/* Icon */}
            <div
              className={`bg-gradient-to-br ${mod.gradient} text-white p-4 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300`}
            >
              <mod.icon size={28} strokeWidth={1.8} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h2
                className="text-lg font-bold mb-0.5"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}
              >
                {mod.title}
              </h2>
              <p className="text-sm text-slate-500 font-medium">{mod.desc}</p>
            </div>

            {/* Arrow */}
            <ArrowRight
              size={20}
              className="text-slate-300 group-hover:text-[var(--accent-copper)] group-hover:translate-x-1 transition-all duration-200 shrink-0"
            />
          </button>
        ))}
      </div>

      {/* Shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};
