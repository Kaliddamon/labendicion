import React, { useState } from 'react';
import { useAppContext, Producto } from '../context/AppContext';
import { Search, Plus, Package, Edit2, Trash2, X } from 'lucide-react';
import { AccessibleButton } from '../components/ui/accessible/AccessibleButton';
import { AccessibleInput } from '../components/ui/accessible/AccessibleInput';
import { AccessibleCardSelector } from '../components/ui/accessible/AccessibleCardSelector';

export const Produccion = () => {
  const { productos, agregarProducto, editarProducto, eliminarProducto, cambiarEstadoProducto, accionesProduccion, empresas } = useAppContext();
  const [busqueda, setBusqueda] = useState('');
  
  // Estado para el formulario (Crear/Editar)
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEditando, setProductoEditando] = useState<string | null>(null);

  // Campos del formulario
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [ganancia, setGanancia] = useState('');
  const [pasos, setPasos] = useState<{ accionProduccionId?: string; descripcion: string; orden: number }[]>([]);
  const [accionSeleccionada, setAccionSeleccionada] = useState('');
  const [fechaAsignacion, setFechaAsignacion] = useState(new Date().toISOString().split('T')[0]);
  const [fechaTerminacion, setFechaTerminacion] = useState('');
  const [fechaEntregaReal, setFechaEntregaReal] = useState('');
  const [estado, setEstado] = useState<Producto['estado']>('Pendiente');

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.empresa.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formatMonto = (num: number) => {
    if (num == null) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  };

  const formatInputNumber = (value: string) => {
    const onlyDigits = value.replace(/[^0-9]/g, '');
    if (!onlyDigits) return '';
    return onlyDigits.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
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
    setFechaAsignacion(new Date().toISOString().split('T')[0]);
    setFechaTerminacion(''); setFechaEntregaReal(''); setEstado('Pendiente');
    setPasos([]);
    setAccionSeleccionada('');
    setProductoEditando(null); setMostrarForm(false);
  };

  const agregarPasoAOrden = () => {
    if (!accionSeleccionada) {
      alert('Selecciona una acción del catálogo.');
      return;
    }
    const accion = accionesValidas.find((a) => a.id === accionSeleccionada);
    if (!accion) {
      alert('La acción seleccionada no es válida.');
      return;
    }
    const yaExiste = pasos.some(
      (p) =>
        (p.accionProduccionId && p.accionProduccionId === accion.id) ||
        p.descripcion.toLowerCase() === accion.nombre.toLowerCase()
    );
    if (yaExiste) {
      return alert('Esa acción ya está asignada a esta orden.');
    }
    setPasos((prev) => [
      ...prev,
      {
        accionProduccionId: accion.id,
        descripcion: accion.nombre,
        orden: prev.length + 1,
      },
    ]);
    setAccionSeleccionada('');
  };

  const iniciarEdicion = (prod: Producto) => {
    setNombre(prod.nombre); setCantidad(formatInputNumber(prod.cantidad.toString()));
    setEmpresa(prod.empresa); setGanancia(formatInputNumber(prod.ganancia.toString()));
    try {
      const obj = (prod as any).pasos;
      if (Array.isArray(obj)) {
        setPasos(obj.map((p: any, i: number) => ({
          accionProduccionId: p.accionProduccionId,
          descripcion: p.descripcion ?? '',
          orden: p.orden ?? i + 1
        })));
      } else if (typeof obj === 'string' && obj.trim() !== '') {
        setPasos(JSON.parse(obj).map((p: any, i: number) => ({
          descripcion: p.descripcion ?? '',
          orden: p.orden ?? i + 1
        })));
      } else {
        setPasos([]);
      }
    } catch (e) {
      setPasos([]);
    }
    setFechaAsignacion(prod.fechaAsignacion); 
    setFechaTerminacion(prod.fechaTerminacion);
    setFechaEntregaReal(prod.fechaEntregaReal || '');
    setEstado(prod.estado); 
    setProductoEditando(prod.id); setMostrarForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !cantidad || !empresa || !ganancia) return alert('Llene todos los campos de información básica');
    if (pasos.length === 0) {
      return alert('Asigna al menos una acción del catálogo a esta orden.');
    }

    const prodData = {
      nombre,
      cantidad: parseFormattedNumber(cantidad),
      empresa,
      ganancia: parseFormattedNumber(ganancia),
      fechaAsignacion,
      fechaTerminacion,
      fechaEntregaReal: estado === 'Terminado' ? fechaEntregaReal : undefined,
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
      case 'Terminado': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'En proceso': return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Pendiente': return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  // Opciones para AccesibleCardSelector
  const opcionesEstado = [
    { value: 'Pendiente', label: 'Pendiente', colorHint: 'slate' as const },
    { value: 'En proceso', label: 'En proceso', colorHint: 'amber' as const },
    { value: 'Terminado', label: 'Terminado', colorHint: 'emerald' as const },
  ];

  return (
    <div className="animate-in fade-in duration-300 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            Producción <Package className="text-blue-500" />
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Controla lo que estamos confeccionando</p>
        </div>
        
        {!mostrarForm && (
          <AccessibleButton onClick={() => setMostrarForm(true)}>
            <Plus size={24} /> NUEVA ORDEN
          </AccessibleButton>
        )}
      </div>

      {mostrarForm && (
        <form onSubmit={handleGuardar} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200 mb-8 slide-in-from-top-4 animate-in">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800">
              {productoEditando ? 'Editar Orden' : 'Crear Nueva Orden'}
            </h2>
            <button 
              type="button" 
              onClick={resetForm} 
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Sección Izquierda: Datos Básicos */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-700 bg-slate-50 p-3 rounded-xl">1. Información Básica</h3>
              
              <AccessibleInput 
                label="¿Qué vamos a confeccionar?" 
                placeholder="Ej. Pantalones, Camisas..." 
                value={nombre} 
                onChange={e=>setNombre(e.target.value)} 
                required 
                autoFocus 
              />
              
              <div className="grid grid-cols-2 gap-4">
                <AccessibleInput 
                  label="Cantidad" 
                  inputMode="numeric" 
                  placeholder="Ej. 100" 
                  value={cantidad} 
                  onChange={e=>setCantidad(formatInputNumber(e.target.value))} 
                  required 
                />
                <AccessibleInput 
                  label="Ganancia ($)" 
                  inputMode="numeric" 
                  placeholder="Ej. 150000" 
                  value={ganancia} 
                  onChange={e=>setGanancia(formatInputNumber(e.target.value))} 
                  required 
                />
              </div>

              <AccessibleInput 
                label="Empresa / Cliente" 
                isSelect
                options={[
                  { value: '', label: 'Seleccione una empresa...' },
                  ...empresas.map(emp => ({ value: emp.razonSocial, label: emp.razonSocial }))
                ]}
                value={empresa} 
                onChange={e=>setEmpresa(e.target.value)} 
                required 
              />
            </div>

            {/* Sección Derecha: Estado y Fechas */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-700 bg-slate-50 p-3 rounded-xl">2. Fechas y Estado</h3>
              
              <AccessibleCardSelector
                label="Estado actual"
                options={opcionesEstado}
                value={estado}
                onChange={(val) => {
                  setEstado(val as Producto['estado']);
                  if (val === 'Terminado' && !fechaEntregaReal) {
                    setFechaEntregaReal(new Date().toISOString().split('T')[0]);
                  }
                }}
                columns={3}
              />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <AccessibleInput 
                  type="date"
                  label="Fecha de Inicio" 
                  value={fechaAsignacion} 
                  onChange={e=>setFechaAsignacion(e.target.value)} 
                  required 
                />
                <AccessibleInput 
                  type="date"
                  label="Fecha Límite (Esperada)" 
                  helperText="(Opcional)"
                  value={fechaTerminacion} 
                  onChange={e=>setFechaTerminacion(e.target.value)} 
                />
              </div>

              {estado === 'Terminado' && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <AccessibleInput 
                    type="date"
                    label="Fecha Real de Entrega" 
                    helperText="Esta fecha se usa para medir si hubo atrasos."
                    value={fechaEntregaReal} 
                    onChange={e=>setFechaEntregaReal(e.target.value)} 
                    required 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sección Inferior: Acciones/Pasos */}
          <div className="bg-slate-50 p-6 rounded-[1.5rem] mb-8 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-700 mb-2">3. Pasos de Producción</h3>
            <p className="text-slate-500 mb-4 text-sm">¿Qué procesos se deben realizar para esta orden?</p>
            
            {accionesValidas.length === 0 ? (
              <p className="text-lg text-amber-800 bg-amber-100 border border-amber-200 rounded-xl px-4 py-4 mb-2 font-medium">
                ⚠️ No hay acciones configuradas en el sistema.
              </p>
            ) : (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1">
                <AccessibleInput 
                  label=""
                  isSelect
                  options={[
                    { value: '', label: 'Seleccione un proceso...' },
                    ...accionesValidas.map((a) => ({ value: a.id, label: a.nombre }))
                  ]}
                  value={accionSeleccionada}
                  onChange={(e) => setAccionSeleccionada(e.target.value)}
                />
              </div>
              <AccessibleButton 
                type="button" 
                variant="secondary" 
                onClick={agregarPasoAOrden}
                className="mt-1.5"
              >
                <Plus size={20} /> Asignar Paso
              </AccessibleButton>
            </div>
            )}

            <div className="space-y-3">
              {pasos.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-400">
                  Ningún paso asignado todavía
                </div>
              )}
              {pasos.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-3 text-lg font-bold text-slate-700">
                    <span className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center text-sm">{p.orden}</span>
                    {p.descripcion}
                  </div>
                  <button 
                    type="button" 
                    onClick={()=>{
                      setPasos(prev => prev.filter((_, i) => i !== idx).map((x, i)=> ({...x, orden: i+1})));
                    }} 
                    className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg active:scale-95 transition-all"
                    title="Eliminar paso"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <AccessibleButton type="button" variant="ghost" onClick={resetForm} className="flex-1 md:flex-none hidden md:flex">
              Cancelar
            </AccessibleButton>
            <AccessibleButton type="submit" variant="primary" className="flex-1 !bg-amber-500 hover:!bg-amber-600 !text-white text-xl !h-16">
              {productoEditando ? 'Guardar Cambios' : 'Crear Orden'}
            </AccessibleButton>
          </div>
        </form>
      )}

      {!mostrarForm && (
        <>
          <div className="relative mb-6">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={28} />
            <input 
              type="text" 
              placeholder="Buscar órdenes por nombre o empresa..." 
              className="w-full bg-white border-2 border-slate-200 rounded-[1.5rem] pl-16 pr-6 py-5 text-xl font-medium shadow-sm focus:outline-none focus:border-teal-500 transition-colors"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>

          <div className="grid gap-5">
            {productosFiltrados.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-slate-300 text-slate-500">
                <Package size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-xl font-medium">No se encontraron órdenes.</p>
              </div>
            ) : (
              productosFiltrados.map((prod) => (
                <div key={prod.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                  
                  <div className="flex items-start md:items-center gap-6 flex-1">
                    <div className="bg-slate-50 text-slate-700 w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-extrabold text-2xl border-2 border-slate-100 shrink-0">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Cant</span>
                       {formatMonto(prod.cantidad)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-extrabold text-slate-800 text-2xl">{prod.nombre}</h3>
                      <p className="text-slate-500 font-medium text-lg mt-1">{prod.empresa}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-4">
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide ${getEstadoBadge(prod.estado)}`}>
                          {prod.estado}
                        </span>
                        <span className="text-sm font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                          Ganancia: ${formatMonto(prod.ganancia)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 lg:w-auto w-full border-t lg:border-t-0 pt-5 lg:pt-0">
                    <AccessibleButton 
                      variant="secondary" 
                      onClick={() => iniciarEdicion(prod)} 
                      className="flex-1 lg:flex-none !px-4"
                    >
                      <Edit2 size={24} /> Editar
                    </AccessibleButton>
                    <AccessibleButton 
                      variant="danger" 
                      onClick={() => { if(window.confirm('¿Seguro que deseas eliminar esta orden permanentemente?')) eliminarProducto(prod.id); }} 
                      className="flex-1 lg:flex-none !px-4"
                    >
                      <Trash2 size={24} /> Eliminar
                    </AccessibleButton>
                  </div>

                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
