import React, { useState, useMemo } from 'react';
import { useAppContext, MovimientoFinanciero } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Wallet, Plus, Trash2, X, TrendingUp, TrendingDown, BarChart3, RefreshCw, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirm } from '../context/ConfirmContext';
import { getColombiaDateString } from '../utils/dateUtils';

const MES_ACTUAL = getColombiaDateString().substring(0, 7);

const NOMBRE_MES: Record<string, string> = {
  '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
  '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
  '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre',
};

const formatCOP = (n: number) =>
  `$${Math.round(n).toLocaleString('es-CO')}`;

const labelMes = (mes: string) => {
  const [year, m] = mes.split('-');
  return `${NOMBRE_MES[m] || m} ${year}`;
};

export const Finanzas = () => {
  const { movimientosFinancieros, agregarMovimiento, eliminarMovimiento, registrarNomina } = useAppContext();
  const { tieneRol } = useAuth();
  const { confirm } = useConfirm();

  const [mesSel, setMesSel] = useState(MES_ACTUAL);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [cargandoNomina, setCargandoNomina] = useState(false);

  // Form state
  const [fNombre, setFNombre] = useState('');
  const [fDescripcion, setFDescripcion] = useState('');
  const [fMonto, setFMonto] = useState('');
  const [fPorcentaje, setFPorcentaje] = useState('');
  const [fTipo, setFTipo] = useState<'GASTO' | 'INGRESO'>('GASTO');

  // Meses disponibles (del bootstrap + mes actual)
  const mesesDisponibles = useMemo(() => {
    const set = new Set(movimientosFinancieros.map(m => m.mes));
    set.add(MES_ACTUAL);
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [movimientosFinancieros]);

  const movimientosMes = useMemo(
    () => movimientosFinancieros.filter(m => m.mes === mesSel),
    [movimientosFinancieros, mesSel]
  );

  const totalIngresos = movimientosMes.filter(m => m.tipo === 'INGRESO').reduce((s, m) => s + m.monto, 0);
  const totalGastos = movimientosMes.filter(m => m.tipo === 'GASTO').reduce((s, m) => s + m.monto, 0);
  const balance = totalIngresos - totalGastos;

  const resetForm = () => {
    setFNombre(''); setFDescripcion(''); setFMonto(''); setFPorcentaje(''); setFTipo('GASTO');
    setMostrarForm(false);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fNombre.trim()) return toast.warning('El nombre es obligatorio.');
    const monto = parseFloat(fMonto.replace(/[^0-9.]/g, ''));
    if (isNaN(monto) || monto <= 0) return toast.warning('El monto debe ser mayor a cero.');
    try {
      await agregarMovimiento({
        mes: mesSel,
        nombre: fNombre.trim(),
        descripcion: fDescripcion.trim() || undefined,
        monto,
        porcentaje: fPorcentaje ? parseFloat(fPorcentaje) : undefined,
        tipo: fTipo,
        origen: 'MANUAL',
        fecha: getColombiaDateString(),
      });
      toast.success('Movimiento añadido.');
      resetForm();
    } catch {
      toast.error('Error al guardar el movimiento.');
    }
  };

  const handleNomina = async () => {
    const ok = await confirm({
      title: '¿Registrar nómina?',
      description: `Se calculará la nómina de ${labelMes(mesSel)} para todos los empleados con horas y/o producción registrada. Reemplazará la nómina previa de ese mes.`,
      confirmText: 'Registrar',
    });
    if (!ok) return;
    setCargandoNomina(true);
    try {
      await registrarNomina(mesSel);
      toast.success(`Nómina de ${labelMes(mesSel)} registrada correctamente.`);
    } catch {
      toast.error('Error al registrar la nómina.');
    } finally {
      setCargandoNomina(false);
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

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleNomina}
            disabled={cargandoNomina}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
            style={{ background: 'var(--surface-linen)', border: '1px solid var(--border-fiber)', color: 'var(--carbon)' }}
          >
            <RefreshCw size={16} className={cargandoNomina ? 'animate-spin' : ''} />
            {cargandoNomina ? 'Registrando...' : 'Registrar Nómina'}
          </button>
          <button
            onClick={() => setMostrarForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#1a1a2e] transition-all active:scale-[0.97]"
            style={{ background: 'var(--accent-copper)', boxShadow: 'var(--shadow-copper)' }}
          >
            <Plus size={18} /> Añadir movimiento
          </button>
        </div>
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
                mesSel === mes
                  ? 'text-[#1a1a2e]'
                  : 'text-slate-500 hover:text-slate-800'
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
        <div className={`card-premium p-5 rounded-2xl flex items-center gap-4 ${balance >= 0 ? '' : 'border-rose-200'}`}>
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

      {/* Modal form */}
      {mostrarForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-up">
          <form
            onSubmit={handleGuardar}
            className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style={{ background: 'var(--surface-silk)', border: '1px solid var(--border-fiber)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>
                Nuevo Movimiento
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Monto ($) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      className="w-full rounded-xl pl-8 pr-3 py-3 text-sm"
                      style={{ background: 'var(--surface-linen)', border: '1px solid var(--border-fiber)' }}
                      placeholder="0.00"
                      value={fMonto}
                      onChange={e => setFMonto(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Porcentaje (%) <span className="font-normal text-slate-400">(opc.)</span></label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    className="w-full rounded-xl px-4 py-3 text-sm"
                    style={{ background: 'var(--surface-linen)', border: '1px solid var(--border-fiber)' }}
                    placeholder="0"
                    value={fPorcentaje}
                    onChange={e => setFPorcentaje(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={resetForm} className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl text-sm font-bold text-[#1a1a2e] active:scale-[0.97] transition-all"
                style={{ background: 'var(--accent-copper)', boxShadow: 'var(--shadow-copper)' }}
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card-premium rounded-2xl overflow-hidden">
        {movimientosMes.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Wallet size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-sm">Sin movimientos en {labelMes(mesSel)}</p>
            <p className="text-xs mt-1">Añade un movimiento o registra la nómina del mes.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--surface-linen)', borderBottom: '1px solid var(--border-fiber)' }}>
                  {['Nombre', 'Descripción', 'Monto', 'Porcentaje', 'Origen', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {movimientosMes.map((mv, idx) => (
                  <tr
                    key={mv.id}
                    className="transition-colors hover:bg-slate-50/50"
                    style={{ borderBottom: idx < movimientosMes.length - 1 ? '1px solid var(--border-fiber-light)' : 'none' }}
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
                    <td className="px-5 py-3.5 text-slate-500 max-w-[220px] truncate">{mv.descripcion || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className="font-bold"
                        style={{ color: mv.tipo === 'INGRESO' ? '#16a34a' : '#dc2626' }}
                      >
                        {mv.tipo === 'GASTO' ? '- ' : '+ '}
                        {formatCOP(mv.monto)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">
                      {mv.porcentaje != null ? `${mv.porcentaje}%` : '—'}
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
                      <button
                        onClick={async () => {
                          if (await confirm({ title: '¿Eliminar movimiento?', description: '¿Seguro que deseas eliminar este movimiento?', confirmText: 'Eliminar' }))
                            eliminarMovimiento(mv.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
