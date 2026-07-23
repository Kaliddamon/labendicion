import React, { useMemo, useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, Gauge, ShieldCheck, Clock, Activity } from 'lucide-react';
import { getColombiaDateString, calcularHorasTrabajadasRedondeadas as horasTrabajadas } from '../utils/dateUtils';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

type Periodo = '7d' | '30d';

const HORAS_PLAN_DIA = 9;

const formatearPorcentaje = (valor: number) => `${valor.toFixed(1)}%`;

const getSemaforoClasses = (estado: 'verde' | 'amarillo' | 'rojo') => {
  if (estado === 'verde') return { bg: 'rgba(22,163,74,0.06)', border: 'rgba(22,163,74,0.2)', text: '#15803d' };
  if (estado === 'amarillo') return { bg: 'rgba(217,119,6,0.06)', border: 'rgba(217,119,6,0.2)', text: '#b45309' };
  return { bg: 'rgba(225,29,72,0.06)', border: 'rgba(225,29,72,0.2)', text: '#be123c' };
};

const getEstadoByThreshold = (
  value: number,
  goodMin: number,
  warnMin: number
): 'verde' | 'amarillo' | 'rojo' => {
  if (value >= goodMin) return 'verde';
  if (value >= warnMin) return 'amarillo';
  return 'rojo';
};

const getEstadoByThresholdInverse = (
  value: number,
  goodMax: number,
  warnMax: number
): 'verde' | 'amarillo' | 'rojo' => {
  if (value <= goodMax) return 'verde';
  if (value <= warnMax) return 'amarillo';
  return 'rojo';
};



const fechaHaceDias = (dias: number) => {
  const date = new Date();
  date.setDate(date.getDate() - dias);
  return getColombiaDateString(date);
};

const PIE_COLORS = ['#d4a012', '#2563eb', '#16a34a', '#d97706', '#7c3aed', '#e11d48'];

export const Rendimiento = () => {
  const { registros, empleados, productos } = useAppContext();
  const { user, tieneRol } = useAuth();
  const [periodo, setPeriodo] = useState<Periodo>('7d');
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<string>('todos');
  const [modoGrafica, setModoGrafica] = useState<'volumen' | 'eficiencia'>('volumen');

  const esAdmin = tieneRol('SUPERADMINISTRADOR') || tieneRol('ADMINISTRADOR') || tieneRol('SUPERVISOR');
  const empleadoUsuarioId = useMemo(() => empleados.find(e => e.email === user?.email)?.id, [empleados, user]);

  useEffect(() => {
    if (!esAdmin && empleadoUsuarioId) {
      setEmpleadoSeleccionado(empleadoUsuarioId);
    }
  }, [esAdmin, empleadoUsuarioId]);

  const diasPeriodo = periodo === '7d' ? 7 : 30;
  const fechaMinima = fechaHaceDias(diasPeriodo - 1);

  const registrosPeriodo = useMemo(
    () => registros.filter((r) => r.fecha >= fechaMinima),
    [registros, fechaMinima]
  );

  const registrosFiltrados = useMemo(() => {
    if (!esAdmin) {
      if (!empleadoUsuarioId) return [];
      return registrosPeriodo.filter((r) => r.empleadoId === empleadoUsuarioId);
    }
    if (empleadoSeleccionado === 'todos') return registrosPeriodo;
    return registrosPeriodo.filter((r) => r.empleadoId === empleadoSeleccionado);
  }, [empleadoSeleccionado, registrosPeriodo, esAdmin, empleadoUsuarioId]);

  const dataDiaria = useMemo(() => {
    const agrupado = registrosFiltrados.reduce((acc, reg) => {
      if (!acc[reg.fecha]) {
        acc[reg.fecha] = { fecha: reg.fecha, total: 0, buenas: 0, horasAsistidas: 0, horasProductivasEstimadas: 0 };
      }
      acc[reg.fecha].total += reg.unidadesTotales;
      acc[reg.fecha].buenas += reg.unidadesBuenas;
      acc[reg.fecha].horasAsistidas += horasTrabajadas(reg.horaEntrada, reg.horaSalida);

      let prodEst = 0;
      for (const prod of (reg.producciones || [])) {
        const producto = productos.find(p => p.id === prod.productoId);
        let paso = producto?.pasos?.find(ps => ps.id === prod.pasoId);
        if (!paso && producto?.pasos?.length === 1) {
          paso = producto.pasos[0];
        }
        const meta = paso?.metaUnidadesHora || 12;
        prodEst += (Number(prod.unidadesBuenas) || 0) / meta;
      }
      acc[reg.fecha].horasProductivasEstimadas += prodEst;

      return acc;
    }, {} as Record<string, { fecha: string; total: number; buenas: number; horasAsistidas: number; horasProductivasEstimadas: number }>);

    return Object.values(agrupado)
      .sort((a, b) => a.fecha.localeCompare(b.fecha))
      .map((d) => {
        const efi = d.horasAsistidas > 0 ? (d.horasProductivasEstimadas / d.horasAsistidas) * 100 : 0;
        return {
          dia: d.fecha.slice(5),
          total: d.total,
          buenas: d.buenas,
          defectos: Math.max(d.total - d.buenas, 0),
          eficiencia: Number(efi.toFixed(1))
        };
      });
  }, [registrosFiltrados, productos]);

  const resumen = useMemo(() => {
    const total = registrosFiltrados.reduce((acc, r) => acc + r.unidadesTotales, 0);
    const buenas = registrosFiltrados.reduce((acc, r) => acc + r.unidadesBuenas, 0);
    const defectos = Math.max(total - buenas, 0);
    const horasAsistidas = registrosFiltrados.reduce((acc, r) => acc + horasTrabajadas(r.horaEntrada, r.horaSalida), 0);
    const horasPlanificadas = registrosFiltrados.length * HORAS_PLAN_DIA;

    let horasProductivasEstimadas = 0;
    for (const r of registrosFiltrados) {
      for (const prod of (r.producciones || [])) {
        const producto = productos.find(p => p.id === prod.productoId);
        let paso = producto?.pasos?.find(ps => ps.id === prod.pasoId);
        if (!paso && producto?.pasos?.length === 1) {
          paso = producto.pasos[0];
        }
        const meta = paso?.metaUnidadesHora || 12;
        horasProductivasEstimadas += (Number(prod.unidadesBuenas) || 0) / meta;
      }
    }

    const eficiencia = horasAsistidas > 0 ? (horasProductivasEstimadas / horasAsistidas) * 100 : 0;
    const fpy = total > 0 ? (buenas / total) * 100 : 0;
    const defectosRate = total > 0 ? (defectos / total) * 100 : 0;
    const retrabajoRate = defectosRate;
    const asistenciaEfectiva = horasAsistidas > 0 ? (horasProductivasEstimadas / horasAsistidas) * 100 : 0;
    const ausentismo = horasPlanificadas > 0 ? ((horasPlanificadas - horasAsistidas) / horasPlanificadas) * 100 : 0;
    const productividadPromedio = horasAsistidas > 0 ? total / horasAsistidas : 0;

    return {
      total, buenas, defectos, horasAsistidas, horasPlanificadas,
      horasProductivasEstimadas, eficiencia, fpy, defectosRate,
      retrabajoRate, asistenciaEfectiva, ausentismo, productividadPromedio
    };
  }, [registrosFiltrados, productos]);

  const productividadPorEmpleado = useMemo(() => {
    const empleadosAMostrar = esAdmin ? empleados : empleados.filter(e => e.id === empleadoUsuarioId);
    return empleadosAMostrar
      .map((emp) => {
        const registrosEmpleado = registrosPeriodo.filter((r) => r.empleadoId === emp.id);
        const total = registrosEmpleado.reduce((acc, r) => acc + r.unidadesTotales, 0);
        const buenas = registrosEmpleado.reduce((acc, r) => acc + r.unidadesBuenas, 0);
        const horas = registrosEmpleado.reduce((acc, r) => acc + horasTrabajadas(r.horaEntrada, r.horaSalida), 0);
        const defectos = Math.max(total - buenas, 0);

        let horasProductivasEmpleado = 0;
        for (const r of registrosEmpleado) {
          for (const prod of (r.producciones || [])) {
            const producto = productos.find(p => p.id === prod.productoId);
            let paso = producto?.pasos?.find(ps => ps.id === prod.pasoId);
            if (!paso && producto?.pasos?.length === 1) {
              paso = producto.pasos[0];
            }
            const meta = paso?.metaUnidadesHora || 12;
            horasProductivasEmpleado += (Number(prod.unidadesBuenas) || 0) / meta;
          }
        }

        const eficiencia = horas > 0 ? (horasProductivasEmpleado / horas) * 100 : 0;

        return {
          nombre: emp.nombre,
          eficiencia,
          buenasHora: horas > 0 ? buenas / horas : 0,
          defectos,
          horas,
        };
      })
      .sort((a, b) => b.eficiencia - a.eficiencia);
  }, [empleados, registrosPeriodo, productos]);

  const defectosPareto = productividadPorEmpleado
    .map((emp) => ({ name: emp.nombre, value: Number(emp.defectos.toFixed(1)) }))
    .filter((emp) => emp.value > 0);

  const aportePorOrdenAccion = useMemo(() => {
    const map: Record<string, { orden: string; accion: string; buenas: number }> = {};
    for (const r of registrosFiltrados) {
      for (const prod of (r.producciones || [])) {
        const producto = productos.find(p => p.id === prod.productoId);
        if (!producto) continue;
        const paso = producto.pasos?.find(ps => ps.id === prod.pasoId);
        const key = `${prod.productoId}::${prod.pasoId}`;
        if (!map[key]) {
          map[key] = {
            orden: producto.nombre,
            accion: paso?.descripcion || 'General',
            buenas: 0,
          };
        }
        map[key].buenas += Number(prod.unidadesBuenas) || 0;
      }
    }
    return Object.values(map)
      .filter(v => v.buenas > 0)
      .sort((a, b) => b.buenas - a.buenas);
  }, [registrosFiltrados, productos]);

  const capacidadDespacho = useMemo(() => {
    const hoy = getColombiaDateString();
    const pedidosConVencimiento = productos.filter((p) => p.fechaTerminacion <= hoy);
    const pedidosTerminados = pedidosConVencimiento.filter((p) => p.estado === 'Terminado').length;
    const cumplimientoDespacho =
      pedidosConVencimiento.length > 0 ? (pedidosTerminados / pedidosConVencimiento.length) * 100 : 100;
    const capacidadDiaria = dataDiaria.length > 0
      ? dataDiaria.reduce((acc, d) => acc + d.total, 0) / dataDiaria.length
      : 0;
    const backlogUnidades = productos
      .filter((p) => p.estado !== 'Terminado')
      .reduce((acc, p) => acc + p.cantidad, 0);
    const backlogDias = capacidadDiaria > 0 ? backlogUnidades / capacidadDiaria : 0;

    return { cumplimientoDespacho, capacidadDiaria, backlogDias, backlogUnidades };
  }, [dataDiaria, productos]);

  const indiceRiesgo = Math.min(
    100,
    Math.max(
      0,
      (100 - resumen.eficiencia) * 0.35 +
      resumen.defectosRate * 0.25 +
      resumen.ausentismo * 0.2 +
      Math.min(capacidadDespacho.backlogDias * 10, 100) * 0.2
    )
  );

  const alertas = [
    {
      metrica: 'Eficiencia global',
      valor: formatearPorcentaje(resumen.eficiencia),
      estado: getEstadoByThreshold(resumen.eficiencia, 90, 80),
      accion: 'Revisar balance de carga y soporte a operarios con menor ratio.',
      icon: Gauge,
    },
    {
      metrica: 'Tasa de defectos',
      valor: formatearPorcentaje(resumen.defectosRate),
      estado: getEstadoByThresholdInverse(resumen.defectosRate, 3, 5),
      accion: 'Aplicar checklist de calidad y auditar causas de retrabajo.',
      icon: ShieldCheck,
    },
    {
      metrica: 'Cumplimiento de despacho (OTD)',
      valor: formatearPorcentaje(capacidadDespacho.cumplimientoDespacho),
      estado: getEstadoByThreshold(capacidadDespacho.cumplimientoDespacho, 95, 90),
      accion: 'Priorizar pedidos vencidos y reasignar capacidad diaria.',
      icon: Clock,
    },
    {
      metrica: 'Ausentismo',
      valor: formatearPorcentaje(resumen.ausentismo),
      estado: getEstadoByThresholdInverse(resumen.ausentismo, 5, 10),
      accion: 'Validar turnos, puntualidad y cobertura de reemplazos.',
      icon: Activity,
    },
  ];

  const metricCards = [
    { label: 'Eficiencia global', value: formatearPorcentaje(resumen.eficiencia), sub: 'Meta sugerida: 90%', icon: Gauge, gradient: 'from-[var(--accent-copper)] to-[var(--accent-copper-bright)]' },
    { label: 'FPY (calidad primera)', value: formatearPorcentaje(resumen.fpy), sub: `${resumen.buenas} buenas de ${resumen.total}`, icon: ShieldCheck, gradient: 'from-emerald-500 to-emerald-600' },
    { label: 'Productividad prom.', value: `${resumen.productividadPromedio.toFixed(1)} und/h`, sub: `${resumen.horasAsistidas.toFixed(1)} h totales trabajadas`, icon: Clock, gradient: 'from-blue-500 to-blue-600' },
    { label: 'Índice de riesgo', value: `${indiceRiesgo.toFixed(0)}/100`, sub: 'Eficiencia + calidad + asistencia', icon: AlertTriangle, gradient: 'from-violet-500 to-violet-600' },
  ];

  const tooltipStyle = {
    borderRadius: '12px',
    border: '1px solid var(--border-fiber)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
  };

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-1 rounded-full" style={{ background: 'var(--accent-copper)' }} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400" style={{ fontFamily: 'var(--font-heading)' }}>
              Analítica
            </span>
          </div>
          <h1
            className="text-3xl font-bold flex items-center gap-3"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}
          >
            Desempeño operativo
            <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">
              <TrendingUp size={18} className="text-violet-600" />
            </div>
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm">
            Vista ejecutiva de productividad, calidad, asistencia y despacho.
          </p>
        </div>

        <div className="flex gap-2">
          {(['7d', '30d'] as Periodo[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                periodo === p
                  ? 'text-[#1a1a2e] shadow-sm'
                  : 'text-slate-500 hover:bg-[var(--surface-linen)]'
              }`}
              style={periodo === p ? { background: 'var(--accent-copper)' } : { border: '1px solid var(--border-fiber)' }}
            >
              {p === '7d' ? '7 días' : '30 días'}
            </button>
          ))}
          {esAdmin && (
            <select
              value={empleadoSeleccionado}
              onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
              className="rounded-lg px-3 py-2 text-xs font-medium"
              style={{ border: '1px solid var(--border-fiber)', background: 'var(--surface-silk)', color: 'var(--carbon)' }}
            >
              <option value="todos">Todo el equipo</option>
              {empleados.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.nombre}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        {metricCards.map((card, i) => (
          <div key={card.label} className={`card-premium-static rounded-2xl p-5 animate-fade-up stagger-${i + 1}`}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium text-slate-500" style={{ fontFamily: 'var(--font-heading)' }}>{card.label}</p>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                <card.icon size={16} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>
              {card.value}
            </p>
            <p className="text-[11px] mt-1 text-slate-400">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <div className="card-premium-static rounded-2xl p-5 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h2 className="text-sm font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>
              {modoGrafica === 'volumen' ? 'Producción diaria y defectos' : 'Eficiencia global diaria (%)'}
            </h2>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setModoGrafica('volumen')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${modoGrafica === 'volumen' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Volumen
              </button>
              <button 
                onClick={() => setModoGrafica('eficiencia')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${modoGrafica === 'eficiencia' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Eficiencia
              </button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataDiaria}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e2d9" />
                <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number, name: string) => name === 'Eficiencia' ? `${value}%` : value} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                {modoGrafica === 'volumen' ? (
                  <>
                    <Line type="monotone" dataKey="total" name="Total" stroke="#d4a012" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="buenas" name="Buenas" stroke="#16a34a" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="defectos" name="Defectos" stroke="#e11d48" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                  </>
                ) : (
                  <Line type="monotone" dataKey="eficiencia" name="Eficiencia" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#7c3aed' }} activeDot={{ r: 6 }} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-premium-static rounded-2xl p-5">
          <h2 className="text-sm font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>
            {esAdmin ? 'Defectos por trabajador' : 'Mi aporte por orden y acción'}
          </h2>
          {!esAdmin && (
            <p className="text-[11px] text-slate-400 mb-3">Unidades buenas que aportaste por orden y acción trabajada</p>
          )}
          <div className="h-64">
            {esAdmin ? (
              defectosPareto.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={defectosPareto} dataKey="value" nameKey="name" innerRadius={45} outerRadius={85} paddingAngle={3}>
                      {defectosPareto.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  No hay defectos registrados en el periodo.
                </div>
              )
            ) : (
              aportePorOrdenAccion.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={aportePorOrdenAccion} layout="vertical" margin={{ left: 4, right: 20, top: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e8e2d9" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="orden"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      width={76}
                      tickFormatter={(v: string) => v.length > 11 ? v.slice(0, 11) + '…' : v}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value: number) => [`${value} uds. buenas`, 'Aporte']}
                      labelFormatter={(_label: string, payload: any[]) => {
                        const item = payload?.[0]?.payload;
                        return item ? `${item.orden} · ${item.accion}` : _label;
                      }}
                    />
                    <Bar dataKey="buenas" name="Uds. buenas" fill="#16a34a" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  No hay registros de producción en el periodo.
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Rankings + Capacity (Only Admins) */}
      {esAdmin && (
        <>
          <div className="grid gap-4 lg:grid-cols-3 mb-6">
            <div className="card-premium-static rounded-2xl p-5 lg:col-span-2">
              <h2 className="text-sm font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>
                Ranking de eficiencia por trabajador
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productividadPorEmpleado}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e2d9" />
                    <XAxis dataKey="nombre" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value.toFixed(1)}%`} />
                    <Bar dataKey="eficiencia" name="Eficiencia %" fill="#d4a012" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-premium-static rounded-2xl p-5">
              <h2 className="text-sm font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>
                Capacidad y despacho
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'OTD (a tiempo)', value: formatearPorcentaje(capacidadDespacho.cumplimientoDespacho) },
                  { label: 'Capacidad diaria', value: `${capacidadDespacho.capacidadDiaria.toFixed(0)} und/día` },
                  { label: 'Backlog pendiente', value: `${capacidadDespacho.backlogDias.toFixed(1)} días`, sub: `${capacidadDespacho.backlogUnidades} unidades en cola` },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl p-4" style={{ background: 'var(--surface-linen)' }}>
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="text-xl font-bold mt-0.5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>{item.value}</p>
                    {item.sub && <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="card-premium-static rounded-2xl p-5">
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>
              <AlertTriangle size={16} style={{ color: 'var(--accent-copper)' }} /> Alertas accionables
            </h2>
            <div className="grid gap-2.5">
              {alertas.map((alerta) => {
                const colors = getSemaforoClasses(alerta.estado);
                return (
                  <div
                    key={alerta.metrica}
                    className="rounded-xl px-4 py-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between"
                    style={{
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderLeft: `3px solid ${colors.text}`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <alerta.icon size={16} style={{ color: colors.text }} />
                      <p className="text-sm font-semibold" style={{ color: colors.text }}>{alerta.metrica}</p>
                    </div>
                    <p className="text-sm font-bold" style={{ color: colors.text }}>{alerta.valor}</p>
                    <p className="text-xs text-slate-500 md:max-w-xs">{alerta.accion}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
