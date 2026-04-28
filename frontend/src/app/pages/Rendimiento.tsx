import React, { useMemo, useState } from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAppContext } from '../context/AppContext';

type Periodo = '7d' | '30d';

const HORAS_PLAN_DIA = 9;
const META_UNIDADES_HORA = 12;

const formatearPorcentaje = (valor: number) => `${valor.toFixed(1)}%`;

const getSemaforoClasses = (estado: 'verde' | 'amarillo' | 'rojo') => {
  if (estado === 'verde') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (estado === 'amarillo') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-rose-50 text-rose-700 border-rose-200';
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

const horasTrabajadas = (entrada: string, salida: string) => {
  const [hIn, mIn] = entrada.split(':').map(Number);
  const [hOut, mOut] = salida.split(':').map(Number);
  if ([hIn, mIn, hOut, mOut].some(Number.isNaN)) return 0;
  const minutos = hOut * 60 + mOut - (hIn * 60 + mIn);
  return Math.max(minutos / 60, 0);
};

const fechaHaceDias = (dias: number) => {
  const date = new Date();
  date.setDate(date.getDate() - dias);
  return date.toISOString().slice(0, 10);
};

export const Rendimiento = () => {
  const { registros, empleados, productos } = useAppContext();
  const [periodo, setPeriodo] = useState<Periodo>('7d');
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<string>('todos');

  const diasPeriodo = periodo === '7d' ? 7 : 30;
  const fechaMinima = fechaHaceDias(diasPeriodo - 1);

  const registrosPeriodo = useMemo(
    () => registros.filter((r) => r.fecha >= fechaMinima),
    [registros, fechaMinima]
  );

  const registrosFiltrados = useMemo(() => {
    if (empleadoSeleccionado === 'todos') return registrosPeriodo;
    return registrosPeriodo.filter((r) => r.empleadoId === empleadoSeleccionado);
  }, [empleadoSeleccionado, registrosPeriodo]);

  const dataDiaria = useMemo(() => {
    const agrupado = registrosFiltrados.reduce((acc, reg) => {
      if (!acc[reg.fecha]) {
        acc[reg.fecha] = { fecha: reg.fecha, total: 0, buenas: 0 };
      }
      acc[reg.fecha].total += reg.unidadesTotales;
      acc[reg.fecha].buenas += reg.unidadesBuenas;
      return acc;
    }, {} as Record<string, { fecha: string; total: number; buenas: number }>);

    return Object.values(agrupado)
      .sort((a, b) => a.fecha.localeCompare(b.fecha))
      .map((d) => ({
        dia: d.fecha.slice(5),
        total: d.total,
        buenas: d.buenas,
        defectos: Math.max(d.total - d.buenas, 0),
      }));
  }, [registrosFiltrados]);

  const resumen = useMemo(() => {
    const total = registrosFiltrados.reduce((acc, r) => acc + r.unidadesTotales, 0);
    const buenas = registrosFiltrados.reduce((acc, r) => acc + r.unidadesBuenas, 0);
    const defectos = Math.max(total - buenas, 0);
    const horasAsistidas = registrosFiltrados.reduce((acc, r) => acc + horasTrabajadas(r.horaEntrada, r.horaSalida), 0);
    const horasPlanificadas = registrosFiltrados.length * HORAS_PLAN_DIA;
    const horasProductivasEstimadas = buenas / META_UNIDADES_HORA;
    const eficiencia = horasAsistidas > 0 ? (buenas / horasAsistidas / META_UNIDADES_HORA) * 100 : 0;
    const fpy = total > 0 ? (buenas / total) * 100 : 0;
    const defectosRate = total > 0 ? (defectos / total) * 100 : 0;
    const retrabajoRate = defectosRate;
    const asistenciaEfectiva = horasAsistidas > 0 ? (horasProductivasEstimadas / horasAsistidas) * 100 : 0;
    const ausentismo = horasPlanificadas > 0 ? ((horasPlanificadas - horasAsistidas) / horasPlanificadas) * 100 : 0;

    return {
      total,
      buenas,
      defectos,
      horasAsistidas,
      horasPlanificadas,
      horasProductivasEstimadas,
      eficiencia,
      fpy,
      defectosRate,
      retrabajoRate,
      asistenciaEfectiva,
      ausentismo,
    };
  }, [registrosFiltrados]);

  const productividadPorEmpleado = useMemo(() => {
    return empleados
      .map((emp) => {
        const registrosEmpleado = registrosPeriodo.filter((r) => r.empleadoId === emp.id);
        const total = registrosEmpleado.reduce((acc, r) => acc + r.unidadesTotales, 0);
        const buenas = registrosEmpleado.reduce((acc, r) => acc + r.unidadesBuenas, 0);
        const horas = registrosEmpleado.reduce((acc, r) => acc + horasTrabajadas(r.horaEntrada, r.horaSalida), 0);
        const defectos = Math.max(total - buenas, 0);
        const eficiencia = horas > 0 ? (buenas / horas / META_UNIDADES_HORA) * 100 : 0;

        return {
          nombre: emp.nombre,
          eficiencia,
          buenasHora: horas > 0 ? buenas / horas : 0,
          defectos,
          horas,
        };
      })
      .sort((a, b) => b.eficiencia - a.eficiencia);
  }, [empleados, registrosPeriodo]);

  const defectosPareto = productividadPorEmpleado
    .map((emp) => ({ name: emp.nombre, value: Number(emp.defectos.toFixed(1)) }))
    .filter((emp) => emp.value > 0);

  const capacidadDespacho = useMemo(() => {
    const hoy = new Date().toISOString().slice(0, 10);
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

    return {
      cumplimientoDespacho,
      capacidadDiaria,
      backlogDias,
      backlogUnidades,
    };
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
    },
    {
      metrica: 'Tasa de defectos',
      valor: formatearPorcentaje(resumen.defectosRate),
      estado: getEstadoByThresholdInverse(resumen.defectosRate, 3, 5),
      accion: 'Aplicar checklist de calidad y auditar causas de retrabajo.',
    },
    {
      metrica: 'Cumplimiento de despacho (OTD)',
      valor: formatearPorcentaje(capacidadDespacho.cumplimientoDespacho),
      estado: getEstadoByThreshold(capacidadDespacho.cumplimientoDespacho, 95, 90),
      accion: 'Priorizar pedidos vencidos y reasignar capacidad diaria.',
    },
    {
      metrica: 'Ausentismo',
      valor: formatearPorcentaje(resumen.ausentismo),
      estado: getEstadoByThresholdInverse(resumen.ausentismo, 5, 10),
      accion: 'Validar turnos, puntualidad y cobertura de reemplazos.',
    },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-teal-900 flex items-center gap-3">
            Desempeño operativo <TrendingUp className="text-purple-500" />
          </h1>
          <p className="text-slate-500 mt-2">
            Vista ejecutiva de productividad, calidad, asistencia y despacho.
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value as Periodo)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="7d">Ultimos 7 dias</option>
            <option value="30d">Ultimos 30 dias</option>
          </select>
          <select
            value={empleadoSeleccionado}
            onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="todos">Todo el equipo</option>
            {empleados.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-slate-500 text-sm">Eficiencia global</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{formatearPorcentaje(resumen.eficiencia)}</p>
          <p className="text-xs mt-2 text-slate-500">Meta sugerida: 90%</p>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-slate-500 text-sm">FPY (calidad a la primera)</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{formatearPorcentaje(resumen.fpy)}</p>
          <p className="text-xs mt-2 text-slate-500">{resumen.buenas} buenas de {resumen.total} totales</p>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-slate-500 text-sm">Horas efectivas</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{formatearPorcentaje(resumen.asistenciaEfectiva)}</p>
          <p className="text-xs mt-2 text-slate-500">{resumen.horasAsistidas.toFixed(1)} h asistidas</p>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-slate-500 text-sm">Indice de riesgo de atraso</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{indiceRiesgo.toFixed(0)}/100</p>
          <p className="text-xs mt-2 text-slate-500">Combina eficiencia, calidad, asistencia y backlog</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Produccion diaria y defectos</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataDiaria}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" name="Total" stroke="#14b8a6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="buenas" name="Buenas" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="defectos" name="Defectos" stroke="#f43f5e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Defectos por trabajador</h2>
          <div className="h-72">
            {defectosPareto.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={defectosPareto} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} fill="#f43f5e" />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                No hay defectos registrados en el periodo.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Ranking de eficiencia por trabajador</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productividadPorEmpleado}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="nombre" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Bar dataKey="eficiencia" name="Eficiencia %" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Capacidad y despacho</h2>
          <div className="space-y-4 text-sm">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-slate-500">OTD (despachos a tiempo)</p>
              <p className="text-2xl font-bold text-slate-900">{formatearPorcentaje(capacidadDespacho.cumplimientoDespacho)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-slate-500">Capacidad diaria estimada</p>
              <p className="text-2xl font-bold text-slate-900">{capacidadDespacho.capacidadDiaria.toFixed(0)} und/dia</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-slate-500">Backlog pendiente</p>
              <p className="text-2xl font-bold text-slate-900">{capacidadDespacho.backlogDias.toFixed(1)} dias</p>
              <p className="text-xs text-slate-500 mt-1">{capacidadDespacho.backlogUnidades} unidades en cola</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-600" /> Alertas accionables
        </h2>
        <div className="grid gap-3">
          {alertas.map((alerta) => (
            <div
              key={alerta.metrica}
              className={`rounded-2xl border px-4 py-3 ${getSemaforoClasses(alerta.estado)}`}
            >
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <p className="font-semibold">{alerta.metrica}</p>
                <p className="font-bold">{alerta.valor}</p>
              </div>
              <p className="text-sm mt-1">{alerta.accion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
