import React, { useState, useEffect } from 'react';
import { useAppContext, Producto } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Package, Search, Filter, Plus, Edit2, Trash2, CheckCircle, PackageSearch, AlertCircle, TrendingUp, X, Check, Scissors } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirm } from '../context/ConfirmContext';
import { getColombiaDateString } from '../utils/dateUtils';
import { AccessibleButton } from '../components/ui/accessible/AccessibleButton';
import { AccessibleInput } from '../components/ui/accessible/AccessibleInput';
import { AccessibleCardSelector } from '../components/ui/accessible/AccessibleCardSelector';
import { Paginador } from '../components/Paginador';

export const Produccion = () => {
  const { productos, agregarProducto, editarProducto, eliminarProducto, cambiarEstadoProducto, accionesProduccion, empresas } = useAppContext();
  const { tieneRol } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');
  const [filtroEmpresa, setFiltroEmpresa] = useState<string>('Todas');
  const { confirm } = useConfirm();

  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEditando, setProductoEditando] = useState<string | null>(null);

  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [ganancia, setGanancia] = useState('');
  const [pasos, setPasos] = useState<{ id?: string; accionProduccionId?: string; descripcion: string; metaUnidadesHora?: number; valorPorUnidad?: number }[]>([]);
  const [accionSeleccionada, setAccionSeleccionada] = useState('');
  const [metaHoraPaso, setMetaHoraPaso] = useState('');
  const [valorPorUnidadPaso, setValorPorUnidadPaso] = useState('');
  const [fechaAsignacion, setFechaAsignacion] = useState(getColombiaDateString());
  const [fechaTerminacion, setFechaTerminacion] = useState('');
  const [estado, setEstado] = useState<Producto['estado']>('Pendiente');

  const productosFiltrados = productos.filter(p => {
    const cumpleBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.empresa.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleEstado = filtroEstado === 'Todos' || p.estado === filtroEstado;
    const cumpleEmpresa = filtroEmpresa === 'Todas' || p.empresa === filtroEmpresa;
    return cumpleBusqueda && cumpleEstado && cumpleEmpresa;
  });

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;
  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
  const productosPaginados = productosFiltrados.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado, filtroEmpresa, productos.length]);

  const formatMonto = (num: number) => {
    if (num == null) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatInputNumber = (value: string) => {
    const onlyDigits = value.replace(/[^0-9]/g, '');
    if (!onlyDigits) return '';
    return onlyDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseFormattedNumber = (value: string) => {
    if (!value) return 0;
    return Number(value.replace(/[^0-9\-]/g, ''));
  };

  const accionesValidas = accionesProduccion.filter(
    (a) => a.id && a.id.trim() !== '' && !a.id.startsWith('tmp-') && a.activa !== false
  );

  const resetForm = () => {
    setNombre(''); setCantidad(''); setEmpresa(''); setGanancia('');
    setFechaAsignacion(getColombiaDateString());
    setFechaTerminacion(''); setEstado('Pendiente');
    setPasos([]);
    setAccionSeleccionada('');
    setMetaHoraPaso('');
    setValorPorUnidadPaso('');
    setProductoEditando(null); setMostrarForm(false);
  };

  const agregarPasoAOrden = () => {
    if (!accionSeleccionada || !metaHoraPaso) {
      toast.warning('Selecciona una acción del catálogo y asigna una meta de unidades por hora.');
      return;
    }
    const metaNum = Number(metaHoraPaso);
    if (isNaN(metaNum) || metaNum <= 0) {
      toast.warning('La meta debe ser un número mayor a cero.');
      return;
    }
    const accion = accionesValidas.find((a) => a.id === accionSeleccionada);
    if (!accion) {
      toast.error('La acción seleccionada no es válida.');
      return;
    }
    const yaExiste = pasos.some(
      (p) =>
        (p.accionProduccionId && p.accionProduccionId === accion.id) ||
        p.descripcion.toLowerCase() === accion.nombre.toLowerCase()
    );
    if (yaExiste) {
      return toast.warning('Esa acción ya está asignada a esta orden.');
    }
    setPasos((prev) => [
      ...prev,
      {
        accionProduccionId: accion.id,
        descripcion: accion.nombre,
        metaUnidadesHora: metaNum,
        valorPorUnidad: valorPorUnidadPaso ? parseFloat(valorPorUnidadPaso) : undefined,
      },
    ]);
    setAccionSeleccionada('');
    setMetaHoraPaso('');
    setValorPorUnidadPaso('');
  };

  const iniciarEdicion = (prod: Producto) => {
    setNombre(prod.nombre); setCantidad(formatInputNumber(prod.cantidad.toString()));
    setEmpresa(prod.empresa); setGanancia(formatInputNumber(prod.ganancia.toString()));
    try {
      const obj = (prod as any).pasos;
      if (Array.isArray(obj)) {
        setPasos(obj.map((p: any) => ({
          id: p.id,
          accionProduccionId: p.accionProduccionId,
          descripcion: p.descripcion ?? '',
          metaUnidadesHora: p.metaUnidadesHora,
          valorPorUnidad: p.valorPorUnidad ?? undefined,
        })));
      } else if (typeof obj === 'string' && obj.trim() !== '') {
        setPasos(JSON.parse(obj).map((p: any) => ({
          id: p.id,
          descripcion: p.descripcion ?? '',
          metaUnidadesHora: p.metaUnidadesHora,
          valorPorUnidad: p.valorPorUnidad ?? undefined,
        })));
      } else {
        setPasos([]);
      }
    } catch (e) {
      setPasos([]);
    }
    setFechaAsignacion(prod.fechaAsignacion); setFechaTerminacion(prod.fechaTerminacion);
    setEstado(prod.estado); setProductoEditando(prod.id); setMostrarForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !cantidad || !empresa || !ganancia) return toast.warning('Llene todos los campos de información básica');
    if (pasos.length === 0) {
      return toast.warning('Asigna al menos una acción del catálogo a esta orden.');
    }

    const prodData = {
      nombre,
      cantidad: parseFormattedNumber(cantidad),
      empresa,
      ganancia: parseFormattedNumber(ganancia),
      fechaAsignacion,
      fechaTerminacion,
      estado,
      pasos,
    };

    if (productoEditando) {
      editarProducto(productoEditando, prodData);
    } else {
      agregarProducto(prodData);
    }

    resetForm();
  };

  const getEstadoBadge = (estado: Producto['estado']) => {
    switch (estado) {
      case 'Terminado': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'En proceso': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Pendiente': return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  const getEstadoBorderColor = (estado: Producto['estado']) => {
    switch (estado) {
      case 'Terminado': return '#16a34a';
      case 'En proceso': return '#d97706';
      case 'Pendiente': return '#94a3b8';
    }
  };

  const opcionesEstado = [
    { value: 'Pendiente', label: 'Pendiente', colorHint: 'slate' as const },
    { value: 'En proceso', label: 'En proceso', colorHint: 'amber' as const },
    { value: 'Terminado', label: 'Terminado', colorHint: 'emerald' as const },
  ];

  return (
    <div className="animate-fade-up pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-1 rounded-full" style={{ background: 'var(--accent-copper)' }} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400" style={{ fontFamily: 'var(--font-heading)' }}>
              Órdenes
            </span>
          </div>
          <h1
            className="text-3xl font-bold flex items-center gap-3"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}
          >
            Producción
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <Scissors size={18} className="text-blue-600" />
            </div>
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm">Controla lo que estamos confeccionando</p>
        </div>

        <AccessibleButton onClick={() => setMostrarForm(true)}>
          <Plus size={20} /> Nueva orden
        </AccessibleButton>
      </div>

      {/* Form — modal overlay */}
      {mostrarForm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) resetForm(); }}
        >
          <form
            onSubmit={handleGuardar}
            className="card-premium-static p-6 md:p-8 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto animate-fade-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-fiber)' }}>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>
                {productoEditando ? 'Editar Orden' : 'Crear Nueva Orden'}
              </h2>
              <button type="button" onClick={resetForm} className="p-2.5 rounded-xl transition-colors hover:bg-[var(--surface-linen)] text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Left */}
              <div className="space-y-5">
                <div className="px-3 py-2 rounded-xl" style={{ background: 'var(--surface-linen)', fontFamily: 'var(--font-heading)' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--carbon)' }}>1. Información Básica</span>
                </div>

                <AccessibleInput label="¿Qué vamos a confeccionar?" placeholder="Ej. Pantalones, Camisas..." value={nombre} onChange={e => setNombre(e.target.value)} required autoFocus />

                <div className="grid grid-cols-2 gap-4">
                  <AccessibleInput label="Cantidad" inputMode="numeric" placeholder="Ej. 100" value={cantidad} onChange={e => setCantidad(formatInputNumber(e.target.value))} required />
                  <AccessibleInput label="Ganancia ($)" inputMode="numeric" placeholder="Ej. 150000" value={ganancia} onChange={e => setGanancia(formatInputNumber(e.target.value))} required />
                </div>

                <AccessibleInput label="Empresa / Cliente" isSelect options={[{ value: '', label: 'Seleccione una empresa...' }, ...empresas.map(emp => ({ value: emp.razonSocial, label: emp.razonSocial }))]} value={empresa} onChange={e => setEmpresa(e.target.value)} required />
              </div>

              {/* Right */}
              <div className="space-y-5">
                <div className="px-3 py-2 rounded-xl" style={{ background: 'var(--surface-linen)', fontFamily: 'var(--font-heading)' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--carbon)' }}>2. Fechas y Estado</span>
                </div>

                <AccessibleCardSelector label="Estado actual" options={opcionesEstado} value={estado} onChange={(val) => setEstado(val as Producto['estado'])} columns={3} />

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <AccessibleInput type="date" label="Fecha de Inicio" value={fechaAsignacion} onChange={e => setFechaAsignacion(e.target.value)} required />
                  <AccessibleInput type="date" label="Fecha de Entrega" helperText="(Opcional)" value={fechaTerminacion} onChange={e => setFechaTerminacion(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Steps section */}
            <div className="p-6 rounded-2xl mb-8" style={{ background: 'var(--surface-linen)', border: '1px solid var(--border-fiber-light)' }}>
              <div className="px-3 py-2 rounded-xl mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                <span className="text-sm font-semibold" style={{ color: 'var(--carbon)' }}>3. Pasos de Producción</span>
              </div>
              <p className="text-slate-500 mb-4 text-xs px-3">¿Qué procesos se deben realizar para esta orden?</p>

              {accionesValidas.length === 0 ? (
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 font-medium">⚠️ No hay acciones configuradas en el sistema.</p>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 mb-5 items-end">
                  <div className="flex-[2]">
                    <AccessibleInput label="Proceso" isSelect options={[{ value: '', label: 'Seleccione un proceso...' }, ...accionesValidas.map((a) => ({ value: a.id, label: a.nombre }))]} value={accionSeleccionada} onChange={(e) => setAccionSeleccionada(e.target.value)} />
                  </div>
                  <div className="flex-[1]">
                    <AccessibleInput label="Meta Und/Hora" inputMode="numeric" placeholder="Ej. 25" value={metaHoraPaso} onChange={(e) => setMetaHoraPaso(e.target.value)} />
                  </div>
                  <div className="flex-[1]">
                    <AccessibleInput label="Valor/unidad ($) Opcional" inputMode="numeric" placeholder="Ej. 500" value={valorPorUnidadPaso} onChange={(e) => setValorPorUnidadPaso(e.target.value)} />
                  </div>
                  <AccessibleButton type="button" variant="secondary" onClick={agregarPasoAOrden} className="mb-0.5">
                    <Plus size={18} /> Asignar
                  </AccessibleButton>
                </div>
              )}

              <div className="space-y-2">
                {pasos.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed rounded-xl text-slate-400 text-sm" style={{ borderColor: 'var(--border-fiber)' }}>Ningún paso asignado todavía</div>
                )}
                {pasos.map((p, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border rounded-xl px-4 py-3 gap-3" style={{ borderColor: 'var(--border-fiber)' }}>
                    <div className="flex flex-wrap items-center gap-3 text-sm font-semibold flex-1" style={{ color: 'var(--carbon)' }}>
                      <div className="flex items-center gap-2">
                        <input type="number" className="w-16 px-2 py-1.5 text-center rounded-lg text-sm" style={{ background: 'var(--surface-linen)', border: '1px solid var(--border-fiber)' }} value={p.metaUnidadesHora ?? ''} onChange={(e) => { const val = Number(e.target.value); setPasos(prev => prev.map((paso, i) => i === idx ? { ...paso, metaUnidadesHora: val > 0 ? val : undefined } : paso)); }} placeholder="Meta" title="Meta und/hora" />
                        <span className="text-xs text-slate-400 font-normal">und/hr</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-400 font-normal">$</span>
                        <input type="number" min={0} step={0.01} className="w-20 px-2 py-1.5 text-center rounded-lg text-sm" style={{ background: 'rgba(212,160,18,0.05)', border: '1px solid rgba(212,160,18,0.2)' }} value={p.valorPorUnidad ?? ''} onChange={(e) => { const val = parseFloat(e.target.value); setPasos(prev => prev.map((paso, i) => i === idx ? { ...paso, valorPorUnidad: isNaN(val) ? undefined : val } : paso)); }} placeholder="$/und" title="Valor por unidad (opcional)" />
                      </div>
                      <span className="ml-1">{p.descripcion}</span>
                    </div>
                    <button type="button" onClick={() => { setPasos(prev => prev.filter((_, i) => i !== idx)); }} className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-lg active:scale-95 transition-all" title="Eliminar paso">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <AccessibleButton type="button" variant="ghost" onClick={resetForm} className="flex-1 md:flex-none">
                Cancelar
              </AccessibleButton>
              <AccessibleButton type="submit" variant="primary" className="flex-1 text-base text-[#1a1a2e] !min-h-[56px]">
                {productoEditando ? 'Guardar Cambios' : 'Crear Orden'}
              </AccessibleButton>
            </div>
          </form>
        </div>
      )}

      {/* Search & List */}
      <>
          <div className="flex flex-col md:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Buscar órdenes por nombre o empresa..."
                className="w-full rounded-xl pl-12 pr-5 py-3.5 text-sm font-medium transition-all h-full min-h-[50px]"
                style={{
                  background: 'var(--surface-silk)',
                  border: '1px solid var(--border-fiber)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
            </div>
            <div className="flex gap-3 md:w-auto w-full">
              <div className="flex-1 md:w-48 relative">
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select
                  className="w-full rounded-xl pl-10 pr-8 py-3.5 text-sm font-medium transition-all appearance-none bg-no-repeat bg-[right_1rem_center] h-full min-h-[50px]"
                  style={{
                    backgroundColor: 'var(--surface-silk)',
                    border: '1px solid var(--border-fiber)',
                    color: 'var(--carbon)',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundSize: '1.2em'
                  }}
                  value={filtroEstado}
                  onChange={e => setFiltroEstado(e.target.value)}
                >
                  <option value="Todos">Todos los estados</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Terminado">Terminado</option>
                </select>
              </div>
              <div className="flex-1 md:w-48 relative">
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select
                  className="w-full rounded-xl pl-10 pr-8 py-3.5 text-sm font-medium transition-all appearance-none bg-no-repeat bg-[right_1rem_center] h-full min-h-[50px]"
                  style={{
                    backgroundColor: 'var(--surface-silk)',
                    border: '1px solid var(--border-fiber)',
                    color: 'var(--carbon)',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundSize: '1.2em'
                  }}
                  value={filtroEmpresa}
                  onChange={e => setFiltroEmpresa(e.target.value)}
                >
                  <option value="Todas">Todas las empresas</option>
                  {empresas.map(emp => (
                    <option key={emp.id} value={emp.razonSocial}>{emp.razonSocial}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {productosFiltrados.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border-2 border-dashed text-slate-400" style={{ background: 'var(--surface-silk)', borderColor: 'var(--border-fiber)' }}>
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--surface-linen)' }}>
                  <Package size={28} className="opacity-50" />
                </div>
                <p className="text-base font-medium" style={{ color: 'var(--carbon)' }}>No se encontraron órdenes.</p>
                <p className="text-sm mt-1 text-slate-400">Crea una nueva orden para comenzar</p>
              </div>
            ) : (
              productosPaginados.map((prod) => (
                <div
                  key={prod.id}
                  className="card-premium p-5 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                  style={{ borderLeft: `3px solid ${getEstadoBorderColor(prod.estado)}` }}
                >
                  <div className="flex items-start md:items-center gap-5 flex-1">
                    <div
                      className="w-16 h-16 rounded-xl flex flex-col items-center justify-center font-bold text-lg shrink-0"
                      style={{ background: 'var(--surface-linen)', color: 'var(--carbon)', fontFamily: 'var(--font-heading)' }}
                    >
                      <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Cant</span>
                      {formatMonto(prod.cantidad)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>
                        {prod.nombre}
                      </h3>
                      <p className="text-slate-500 font-medium text-sm mt-0.5">{prod.empresa}</p>

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide ${getEstadoBadge(prod.estado)}`}>
                          {prod.estado}
                        </span>
                        <span className="text-xs font-semibold px-3 py-1 rounded-lg" style={{ background: 'var(--surface-linen)', color: 'var(--carbon)', border: '1px solid var(--border-fiber)' }}>
                          ${formatMonto(prod.ganancia)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 lg:w-auto w-full border-t lg:border-t-0 pt-4 lg:pt-0" style={{ borderColor: 'var(--border-fiber)' }}>
                    <AccessibleButton
                      variant="secondary"
                      onClick={() => iniciarEdicion(prod)}
                      className="flex-1 lg:flex-none !px-4 !min-h-[44px] !text-sm"
                    >
                      <Edit2 size={16} /> Editar
                    </AccessibleButton>
                    {tieneRol('SUPERADMINISTRADOR') && (
                      <AccessibleButton
                        variant="danger"
                        onClick={async () => { if (await confirm({ title: '¿Eliminar orden?', description: '¿Seguro que deseas eliminar esta orden permanentemente?', confirmText: 'Eliminar' })) eliminarProducto(prod.id); }}
                        className="flex-1 lg:flex-none !px-4 !min-h-[44px] !text-sm"
                      >
                        <Trash2 size={16} /> Eliminar
                      </AccessibleButton>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {totalPaginas > 1 && (
            <Paginador
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              cambiarPagina={setPaginaActual}
            />
          )}
      </>
    </div>
  );
};
