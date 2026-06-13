import React, { useState, useMemo } from 'react';
import { useAppContext, MovimientoFinanciero } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Wallet, Plus, Trash2, X, TrendingUp, TrendingDown, BarChart3, DollarSign, Calendar, Edit2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirm } from '../context/ConfirmContext';
import { getColombiaDateString } from '../utils/dateUtils';

const MES_ACTUAL = getColombiaDateString().substring(0, 7);

const NOMBRE_MES: Record<string, string> = {
  '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
  '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
  '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre',
};

const formatCOP = (n: number) => `$${Math.round(n).toLocaleString('es-CO')}`;

const labelMes = (mes: string) => {
  const [year, m] = mes.split('-');
  return `${NOMBRE_MES[m] || m} ${year}`;
};

/** Formatea un string numérico separando miles con punto (Colombia) */
const formatMiles = (raw: string): string => {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  return Number(digits).toLocaleString('es-CO');
};

/** Convierte el string formateado de vuelta a número */
const parseMiles = (formatted: string): number =>
  Number(formatted.replace(/\./g, '').replace(/,/g, '.'));

type TipoPago = 'HORAS' | 'PRODUCCION' | 'AMBOS';

export const Finanzas = () => {
  const {
    movimientosFinancieros,
    agregarMovimiento,
    eliminarMovimiento,
    registros,
    empleados,
    productos,
  } = useAppContext();
  const { tieneRol } = useAuth();
  const { confirm } = useConfirm();

  const [mesSel, setMesSel] = useState(MES_ACTUAL);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // Form state
  const [fNombre, setFNombre] = useState('');
  const [fDescripcion, setFDescripcion] = useState('');
  const [fMontoStr, setFMontoStr] = useState('');
  const [fTipo, setFTipo] = useState<'GASTO' | 'INGRESO'>('GASTO');

  const resetForm = () => {
    setFNombre(''); setFDescripcion(''); setFMontoStr(''); setFTipo('GASTO');
    setMostrarForm(false); setEditandoId(null);
  };

  const abrirEdicion = (mv: MovimientoFinanciero) => {
    setEditandoId(mv.id);
    setFNombre(mv.nombre);
    setFDescripcion(mv.descripcion || '');
    setFMontoStr(formatMiles(String(Math.round(mv.monto))));
    setFTipo(mv.tipo);
    setMostrarForm(true);
  };

  // Calcular nómina automáticamente del mes seleccionado respetando tipoPago
  const nominaCalculada = useMemo(() => {
    const rows: Array<MovimientoFinanciero> = [];
    for (const emp of empleados) {
      const regsEmp = registros.filter(
        r => r.empleadoId === emp.id && r.fecha?.startsWith(mesSel)
      );
      if (regsEmp.length === 0) continue;

      const modalidad: TipoPago = (emp.tipoPago as TipoPago) || 'AMBOS';
      let pagoHoras = 0;
      let pagoProduccion = 0;

      for (const reg of regsEmp) {
        // Pago por horas (solo si modalidad lo incluye)
        if (
          (modalidad === 'HORAS' || modalidad === 'AMBOS') &&
          emp.valorHora &&
          reg.horaEntrada && reg.horaSalida &&
          reg.horaEntrada !== '--:--' && reg.horaSalida !== '--:--'
        ) {
          try {
            const [hE, mE] = reg.horaEntrada.split(':').map(Number);
            const [hS, mS] = reg.horaSalida.split(':').map(Number);
            const horas = Math.max(0, (hS + mS / 60) - (hE + mE / 60));
            pagoHoras += horas * emp.valorHora;
          } catch {}
        }

        // Pago por producción (solo si modalidad lo incluye)
        if (modalidad === 'PRODUCCION' || modalidad === 'AMBOS') {
          for (const prod of reg.producciones ?? []) {
            const orden = productos.find(p => p.id === prod.productoId);
            if (!orden?.pasos) continue;
            const paso = orden.pasos.find(ps => ps.id === prod.pasoId);
            if (paso?.valorPorUnidad) {
              pagoProduccion += (prod.unidadesTotales ?? 0) * paso.valorPorUnidad;
            }
          }
        }
      }

      const total = pagoHoras + pagoProduccion;
      if (total <= 0) continue;

      const descripcionParts: string[] = [];
      if (pagoHoras > 0) descripcionParts.push(`Horas: ${formatCOP(pagoHoras)}`);
      if (pagoProduccion > 0) descripcionParts.push(`Producción: ${formatCOP(pagoProduccion)}`);
      const modalidadLabel = modalidad === 'HORAS' ? '⏱ Horas' : modalidad === 'PRODUCCION' ? '📦 Producción' : '⚡ Ambos';

      rows.push({
        id: `nomina-${emp.id}-${mesSel}`,
        mes: mesSel,
        nombre: `Nómina: ${emp.nombre}`,
        descripcion: `${modalidadLabel} | ${descripcionParts.join(' | ')}`,
        monto: total,
        tipo: 'GASTO',
        origen: 'NOMINA',
        empleadoId: emp.id,
        fecha: mesSel + '-01',
      });
    }
    return rows;
  }, [mesSel, empleados, registros, productos]);

  // Meses disponibles
  const mesesDisponibles = useMemo(() => {
    const set = new Set(movimientosFinancieros.map(m => m.mes));
    set.add(MES_ACTUAL);
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [movimientosFinancieros]);

  // Movimientos manuales del mes
  const manualesMes = useMemo(
    () => movimientosFinancieros.filter(m => m.mes === mesSel),
    [movimientosFinancieros, mesSel]
  );

  // Combinar nómina + manuales
  const todosLosMov = useMemo(
    () => [...nominaCalculada, ...manualesMes],
    [nominaCalculada, manualesMes]
  );

  const totalIngresos = todosLosMov.filter(m => m.tipo === 'INGRESO').reduce((s, m) => s + m.monto, 0);
  const totalGastos   = todosLosMov.filter(m => m.tipo === 'GASTO').reduce((s, m) => s + m.monto, 0);
  const balance       = totalIngresos - totalGastos;
  const totalAbs      = totalIngresos + totalGastos;

  const getPorcentaje = (monto: number) =>
    totalAbs > 0 ? ((monto / totalAbs) * 100).toFixed(1) + '%' : '—';

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fNombre.trim()) return toast.warning('El nombre es obligatorio.');
    const monto = parseMiles(fMontoStr);
    if (isNaN(monto) || monto <= 0) return toast.warning('El monto debe ser mayor a cero.');

    try {
      if (editandoId) {
        // Para editar, eliminamos el anterior y creamos uno nuevo
        await eliminarMovimiento(editandoId);
        await agregarMovimiento({
          mes: mesSel,
          nombre: fNombre.trim(),
          descripcion: fDescripcion.trim() || undefined,
          monto,
          tipo: fTipo,
          origen: 'MANUAL',
          fecha: getColombiaDateString(),
        });
        toast.success('Movimiento actualizado.');
      } else {
        await agregarMovimiento({
          mes: mesSel,
          nombre: fNombre.trim(),
          descripcion: fDescripcion.trim() || undefined,
          monto,
          tipo: fTipo,
          origen: 'MANUAL',
          fecha: getColombiaDateString(),
        });
        toast.success('Movimiento añadido.');
      }
      resetForm();
    } catch {
      toast.error('Error al guardar el movimiento.');
    }
  };

  if (!tieneRol('ADMINISTRADOR') && !tieneRol('SUPERADMINISTRADOR')) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500 font-medium">No tienes permiso para ver esta sección.</p>
      </div>
    );
  }

  return (
    <>
      <div className="animate-fade-up pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: 'var(--accent-copper)' }} />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400" style={{ fontFamily: 'var(--font-heading)' }}>
                Contabilidad
              </span>
            </div>
            <h1
              className="text-3xl font-bold flex items-center gap-3"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}
            >
              Finanzas
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Wallet size={18} className="text-emerald-600" />
              </div>
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">Movimientos financieros y nómina del taller</p>
          </div>

          <button
            onClick={() => { resetForm(); setMostrarForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#1a1a2e] transition-all active:scale-[0.97] self-start md:self-auto"
            style={{ background: 'var(--accent-copper)', boxShadow: 'var(--shadow-copper)' }}
          >
            <Plus size={18} /> Añadir movimiento
          </button>
        </div>

        {/* Selector de mes */}
        <div className="flex items-center gap-3 mb-6">
          <Calendar size={17} className="text-slate-400 shrink-0" />
          <div className="flex flex-wrap gap-2">
            {mesesDisponibles.map(mes => (
              <button
                key={mes}
                onClick={() => setMesSel(mes)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  mesSel === mes ? 'text-[#1a1a2e]' : 'text-slate-500 hover:text-slate-800'
                }`}
                style={
                  mesSel === mes
                    ? { background: 'var(--accent-copper)', boxShadow: 'var(--shadow-copper)' }
                    : { background: 'var(--surface-silk)', border: '1px solid var(--border-fiber)' }
                }
              >
                {labelMes(mes)}
              </button>
            ))}
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card-premium p-5 rounded-2xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <TrendingUp size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ingresos</p>
              <p className="text-2xl font-bold text-emerald-600" style={{ fontFamily: 'var(--font-heading)' }}>{formatCOP(totalIngresos)}</p>
            </div>
          </div>
          <div className="card-premium p-5 rounded-2xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
              <TrendingDown size={20} className="text-rose-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gastos</p>
              <p className="text-2xl font-bold text-rose-600" style={{ fontFamily: 'var(--font-heading)' }}>{formatCOP(totalGastos)}</p>
            </div>
          </div>
          <div className="card-premium p-5 rounded-2xl flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${balance >= 0 ? 'bg-blue-100' : 'bg-rose-50'}`}>
              <BarChart3 size={20} className={balance >= 0 ? 'text-blue-600' : 'text-rose-600'} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Balance</p>
              <p
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-heading)', color: balance >= 0 ? '#1d4ed8' : '#dc2626' }}
              >
                {balance >= 0 ? '+' : ''}{formatCOP(balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card-premium rounded-2xl overflow-hidden">
          {todosLosMov.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Wallet size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium text-sm">Sin movimientos en {labelMes(mesSel)}</p>
              <p className="text-xs mt-1">Añade un movimiento manualmente o registra trabajo en empleados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--surface-linen)', borderBottom: '1px solid var(--border-fiber)' }}>
                    {['Nombre', 'Descripción', 'Monto', '%', 'Origen', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {todosLosMov.map((mv, idx) => (
                    <tr
                      key={mv.id}
                      className="transition-colors hover:bg-slate-50/50"
                      style={{ borderBottom: idx < todosLosMov.length - 1 ? '1px solid var(--border-fiber-light)' : 'none' }}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: mv.tipo === 'INGRESO' ? '#16a34a' : '#dc2626' }}
                          />
                          <span className="font-semibold" style={{ color: 'var(--carbon)' }}>{mv.nombre}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 max-w-[220px] truncate text-xs" title={mv.descripcion}>{mv.descripcion || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold" style={{ color: mv.tipo === 'INGRESO' ? '#16a34a' : '#dc2626' }}>
                          {mv.tipo === 'GASTO' ? '- ' : '+ '}{formatCOP(mv.monto)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-medium text-xs">
                        {getPorcentaje(mv.monto)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide"
                          style={
                            mv.origen === 'NOMINA'
                              ? { background: 'rgba(37,99,235,0.08)', color: '#1d4ed8' }
                              : { background: 'var(--surface-linen)', color: 'var(--carbon)', border: '1px solid var(--border-fiber)' }
                          }
                        >
                          {mv.origen === 'NOMINA' ? '💼 Nómina' : '✏️ Manual'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {mv.origen !== 'NOMINA' && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => abrirEdicion(mv)}
                              className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={async () => {
                                if (await confirm({ title: '¿Eliminar movimiento?', description: '¿Seguro que deseas eliminar este movimiento?', confirmText: 'Eliminar' }))
                                  eliminarMovimiento(mv.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal — fuera del div animado para que fixed cubra toda la pantalla */}
      {mostrarForm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) resetForm(); }}
        >
          <form
            onSubmit={handleGuardar}
            className="w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-up"
            style={{ background: 'var(--surface-silk)', border: '1px solid var(--border-fiber)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>
                {editandoId ? 'Editar Movimiento' : 'Nuevo Movimiento'}
              </h2>
              <button type="button" onClick={resetForm} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Tipo selector */}
              <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border-fiber)' }}>
                {(['GASTO', 'INGRESO'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFTipo(t)}
                    className={`flex-1 py-2.5 text-sm font-bold transition-all ${fTipo === t ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
                    style={fTipo === t
                      ? { background: t === 'GASTO' ? '#dc2626' : '#16a34a' }
                      : { background: 'white' }
                    }
                  >
                    {t === 'GASTO' ? '📤 Gasto' : '📥 Ingreso'}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nombre *</label>
                <input
                  className="w-full rounded-xl px-4 py-3 text-sm"
                  style={{ background: 'var(--surface-linen)', border: '1px solid var(--border-fiber)' }}
                  placeholder="Ej. Pago proveedor, Venta..."
                  value={fNombre}
                  onChange={e => setFNombre(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Descripción <span className="font-normal text-slate-400">(opcional)</span></label>
                <input
                  className="w-full rounded-xl px-4 py-3 text-sm"
                  style={{ background: 'var(--surface-linen)', border: '1px solid var(--border-fiber)' }}
                  placeholder="Detalles adicionales..."
                  value={fDescripcion}
                  onChange={e => setFDescripcion(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Monto ($) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-full rounded-xl pl-8 pr-3 py-3 text-sm font-semibold"
                    style={{ background: 'var(--surface-linen)', border: '1px solid var(--border-fiber)' }}
                    placeholder="0"
                    value={fMontoStr}
                    onChange={e => setFMontoStr(formatMiles(e.target.value))}
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">
                  El porcentaje se calcula automáticamente como proporción del total del mes.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={resetForm} className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl text-sm font-bold text-[#1a1a2e] active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                style={{ background: 'var(--accent-copper)', boxShadow: 'var(--shadow-copper)' }}
              >
                {editandoId ? <><Save size={15} /> Actualizar</> : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
