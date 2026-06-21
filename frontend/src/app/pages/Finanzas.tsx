import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext, MovimientoFinanciero } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Wallet, Plus, Trash2, X, TrendingUp, TrendingDown, BarChart3, DollarSign, Calendar, Edit2, Save, CheckCircle, Paperclip, Loader2, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirm } from '../context/ConfirmContext';
import { getColombiaDateString, getQuincenaInfo, getQuincenaOfDate, Quincena } from '../utils/dateUtils';
import { uploadEvidencia } from '../utils/supabaseClient';

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
    nominasPagadas,
    marcarNominaComoPagada,
    desmarcarNominaComoPagada,
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
  const [fArchivo, setFArchivo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [evidenciaPreview, setEvidenciaPreview] = useState<MovimientoFinanciero | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (zoom <= 1) setPosition({ x: 0, y: 0 });
  }, [zoom]);

  const resetForm = () => {
    setFNombre(''); setFDescripcion(''); setFMontoStr(''); setFTipo('GASTO');
    setFArchivo(null); setSubiendo(false);
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
      for (const q of ['Q1', 'Q2'] as Quincena[]) {
        const qInfo = getQuincenaInfo(mesSel, q);
        const regsEmp = registros.filter(
          r => r.empleadoId === emp.id && r.fecha?.startsWith(mesSel) && getQuincenaOfDate(r.fecha) === q
        );
        if (regsEmp.length === 0) continue;

        const modalidad: TipoPago = (emp.tipoPago as TipoPago) || 'AMBOS';
        let pagoHoras = 0;
        let pagoProduccion = 0;

        for (const reg of regsEmp) {
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

        const idNomina = `nomina-${emp.id}-${mesSel}-${q}`;

        rows.push({
          id: idNomina,
          mes: mesSel,
          nombre: `Nómina ${q}: ${emp.nombre}`,
          descripcion: `${qInfo.label} | ${modalidadLabel} | ${descripcionParts.join(' | ')}`,
          monto: total,
          tipo: 'GASTO',
          origen: 'NOMINA',
          empleadoId: emp.id,
          fecha: qInfo.fin,
          quincena: q,
          estadoPago: nominasPagadas.has(idNomina) ? 'PAGADO' : 'PENDIENTE',
        });
      }
    }
    return rows;
  }, [mesSel, empleados, registros, productos, nominasPagadas]);

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
      setSubiendo(true);
      let evidenciaUrl = editandoId ? movimientosFinancieros.find(m => m.id === editandoId)?.evidenciaUrl : undefined;
      
      if (fArchivo) {
        evidenciaUrl = await uploadEvidencia(fArchivo);
      }

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
          evidenciaUrl,
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
          evidenciaUrl,
        });
        toast.success('Movimiento añadido.');
      }
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar el movimiento.');
      setSubiendo(false);
    }
  };

  const handleEliminarEvidencia = async (mv: MovimientoFinanciero) => {
    if (!await confirm('¿Seguro que deseas eliminar la evidencia de este movimiento?')) return;
    try {
      await eliminarMovimiento(mv.id);
      await agregarMovimiento({
        mes: mv.mes,
        nombre: mv.nombre,
        descripcion: mv.descripcion,
        monto: mv.monto,
        tipo: mv.tipo as 'GASTO' | 'INGRESO',
        origen: 'MANUAL',
        fecha: mv.fecha,
        evidenciaUrl: undefined,
      });
      toast.success('Evidencia eliminada correctamente.');
      setEvidenciaPreview(null);
    } catch {
      toast.error('Error al eliminar evidencia.');
    }
  };

  const handleDownload = async (url: string, nombre: string) => {
    try {
      const toastId = toast.loading('Descargando...');
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const extension = url.split('.').pop() || 'png';
      a.download = `Evidencia_${nombre.replace(/\s+/g, '_')}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      toast.dismiss(toastId);
    } catch (error) {
      toast.error('Error al descargar el archivo.');
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
                    {['Nombre', 'Descripción', 'Monto', '%', 'Origen', 'Evidencia', ''].map(h => (
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
                        <div className="flex items-center gap-2">
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
                          {mv.origen === 'NOMINA' && (
                            <span
                              className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide"
                              style={mv.estadoPago === 'PAGADO'
                                ? { background: '#dcfce7', color: '#166534' }
                                : { background: '#fef3c7', color: '#92400e' }
                              }
                            >
                              {mv.estadoPago === 'PAGADO' ? 'Pagada' : 'Pendiente'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {mv.evidenciaUrl ? (
                          <button
                            onClick={() => { setZoom(1); setEvidenciaPreview(mv); }}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                            title="Ver evidencia adjunta"
                          >
                            <Paperclip size={14} />
                          </button>
                        ) : (
                          <span className="text-slate-300 pl-3">—</span>
                        )}
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
                        {mv.origen === 'NOMINA' && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => mv.estadoPago === 'PAGADO' ? desmarcarNominaComoPagada(mv.id) : marcarNominaComoPagada(mv.id)}
                              className="px-2 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                              style={mv.estadoPago === 'PAGADO'
                                ? { background: 'var(--surface-linen)', color: 'var(--carbon)', border: '1px solid var(--border-fiber)' }
                                : { background: 'var(--accent-copper)', color: '#1a1a2e', boxShadow: 'var(--shadow-copper)' }
                              }
                            >
                              <CheckCircle size={14} /> {mv.estadoPago === 'PAGADO' ? 'Desmarcar' : 'Marcar Pagada'}
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

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Evidencia (opcional)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={e => setFArchivo(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-xl file:border-0
                      file:text-xs file:font-bold
                      file:bg-slate-100 file:text-slate-600
                      hover:file:bg-slate-200 transition-colors cursor-pointer"
                  />
                </div>
                {editandoId && movimientosFinancieros.find(m => m.id === editandoId)?.evidenciaUrl && (
                  <p className="text-[10px] text-emerald-600 mt-1.5 flex items-center gap-1">
                    <CheckCircle size={12} /> Ya tiene una evidencia adjunta.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={resetForm} className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={subiendo}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-[#1a1a2e] active:scale-[0.97] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                style={{ background: 'var(--accent-copper)', boxShadow: 'var(--shadow-copper)' }}
              >
                {subiendo ? <><Loader2 size={15} className="animate-spin" /> Subiendo...</> : (editandoId ? <><Save size={15} /> Actualizar</> : 'Guardar')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de previsualización de evidencia */}
      {evidenciaPreview && evidenciaPreview.evidenciaUrl && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setEvidenciaPreview(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-fade-up"
            style={{ background: 'var(--surface-silk)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b gap-3" style={{ borderColor: 'var(--border-fiber)' }}>
              <div>
                <h3 className="font-bold text-lg leading-none" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>
                  Vista Previa de Evidencia
                </h3>
                <p className="text-xs text-slate-500 mt-1">Movimiento: {evidenciaPreview.nombre}</p>
              </div>
              <div className="flex items-center gap-2">
                {!evidenciaPreview.evidenciaUrl.toLowerCase().endsWith('.pdf') && (
                  <>
                    <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-600" title="Alejar">
                      <ZoomOut size={16} />
                    </button>
                    <span className="text-xs font-bold text-slate-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-600" title="Acercar">
                      <ZoomIn size={16} />
                    </button>
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                  </>
                )}
                <button
                  onClick={() => handleDownload(evidenciaPreview.evidenciaUrl!, evidenciaPreview.nombre)}
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors"
                  title="Descargar archivo"
                >
                  <Download size={16} />
                </button>
                <button 
                  onClick={() => handleEliminarEvidencia(evidenciaPreview)}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                  title="Eliminar evidencia"
                >
                  <Trash2 size={16} />
                </button>
                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                <button onClick={() => setEvidenciaPreview(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-500">
                  <X size={18} />
                </button>
              </div>
            </div>
            <div 
              className={`flex-1 overflow-hidden p-4 flex items-center justify-center bg-slate-50/50 relative ${zoom > 1 ? 'cursor-grab active:cursor-grabbing select-none' : ''}`}
              onMouseDown={(e) => {
                if (zoom <= 1) return;
                e.preventDefault();
                setIsDragging(true);
                setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
              }}
              onMouseMove={(e) => {
                if (!isDragging || zoom <= 1) return;
                e.preventDefault();
                setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              {evidenciaPreview.evidenciaUrl.toLowerCase().endsWith('.pdf') ? (
                <iframe src={evidenciaPreview.evidenciaUrl} className="w-full h-[75vh] rounded-xl shadow-sm border border-slate-200" title="Evidencia PDF" />
              ) : (
                <img 
                  src={evidenciaPreview.evidenciaUrl} 
                  alt="Evidencia" 
                  className="rounded-xl shadow-sm transition-transform origin-center select-none pointer-events-none" 
                  style={{ 
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    maxHeight: '75vh',
                    maxWidth: '100%',
                    transitionDuration: isDragging ? '0ms' : '200ms'
                  }} 
                  draggable={false}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
