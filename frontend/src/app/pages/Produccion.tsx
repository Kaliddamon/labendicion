import React, { useState } from 'react';
import { useAppContext, Producto } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Package, Edit2, Trash2 } from 'lucide-react';

const EmpresaForm = ({ onCreate }: { onCreate: (emp: { razonSocial: string; telefono?: string; correo?: string; direccion?: string; estado?: string }) => void }) => {
  const [razonSocial, setRazonSocial] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [estado, setEstado] = useState('Sin ordenes');

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!razonSocial) return alert('Razon social requerida'); onCreate({ razonSocial, telefono, correo, direccion, estado }); setRazonSocial(''); setTelefono(''); setCorreo(''); setDireccion(''); setEstado('Sin ordenes'); }} className="space-y-2">
      <input className="w-full bg-slate-50 border rounded-xl px-3 py-2" placeholder="Razon social" value={razonSocial} onChange={e=>setRazonSocial(e.target.value)} />
      <input className="w-full bg-slate-50 border rounded-xl px-3 py-2" placeholder="Teléfono" value={telefono} onChange={e=>setTelefono(e.target.value)} />
      <input className="w-full bg-slate-50 border rounded-xl px-3 py-2" placeholder="Correo" value={correo} onChange={e=>setCorreo(e.target.value)} />
      <input className="w-full bg-slate-50 border rounded-xl px-3 py-2" placeholder="Dirección" value={direccion} onChange={e=>setDireccion(e.target.value)} />
      <div className="flex gap-2">
        <select className="flex-1 bg-slate-50 border rounded-xl px-3 py-2" value={estado} onChange={e=>setEstado(e.target.value)}>
          <option>Sin ordenes</option>
          <option>Ordenes pendientes</option>
          <option>Inactiva</option>
        </select>
        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-xl">Crear</button>
      </div>
    </form>
  );
};

export const Produccion = () => {
  const { productos, agregarProducto, editarProducto, eliminarProducto, cambiarEstadoProducto, accionesProduccion } = useAppContext();
  const { empresas, agregarEmpresa, editarEmpresa, eliminarEmpresa } = useAppContext();
  const { tieneRol } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  
  // Estado para el formulario (Crear/Editar)
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEditando, setProductoEditando] = useState<string | null>(null);

  // Campos del formulario
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [ganancia, setGanancia] = useState('');
  const [mostrarModalEmpresas, setMostrarModalEmpresas] = useState(false);
  const [pasos, setPasos] = useState<{ accionProduccionId?: string; descripcion: string; orden: number }[]>([]);
  const [accionSeleccionada, setAccionSeleccionada] = useState('');
  const [fechaAsignacion, setFechaAsignacion] = useState(new Date().toISOString().split('T')[0]);
  const [fechaTerminacion, setFechaTerminacion] = useState('');
  const [estado, setEstado] = useState<Producto['estado']>('Pendiente');

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.empresa.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formatMonto = (num: number) => {
    // Formato simple con apostrofe como separador de miles (ej. 1'000'000)
    if (num == null) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  };

  const formatInputNumber = (value: string) => {
    // Elimina todo excepto dígitos
    const onlyDigits = value.replace(/[^0-9]/g, '');
    if (!onlyDigits) return '';
    return onlyDigits.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  };

  const parseFormattedNumber = (value: string) => {
    if (!value) return 0;
    return Number(value.replace(/[^0-9\-]/g, ''));
  };

  const resetForm = () => {
    setNombre(''); setCantidad(''); setEmpresa(''); setGanancia('');
    setFechaAsignacion(new Date().toISOString().split('T')[0]);
    setFechaTerminacion(''); setEstado('Pendiente');
    setProductoEditando(null); setMostrarForm(false);
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
    setFechaAsignacion(prod.fechaAsignacion); setFechaTerminacion(prod.fechaTerminacion);
    setEstado(prod.estado); setProductoEditando(prod.id); setMostrarForm(true);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !cantidad || !empresa || !ganancia) return alert('Llene los campos obligatorios');

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
      case 'Terminado': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'En proceso': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Pendiente': return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-teal-900 flex items-center gap-3">
            Producción <Package className="text-blue-500" />
          </h1>
          <p className="text-slate-500 mt-2">Controla lo que estamos confeccionando</p>
        </div>
        
        <button 
          onClick={() => { resetForm(); setMostrarForm(!mostrarForm); }}
          className={`${mostrarForm ? 'bg-slate-200 text-slate-800' : 'bg-teal-600 hover:bg-teal-700 text-white'} px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95`}
        >
          {mostrarForm ? 'Cancelar' : <><Plus size={24} /> Nueva Orden</>}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleGuardar} className="bg-white p-6 rounded-3xl shadow-sm border border-teal-100 mb-8 slide-in-from-top-4 animate-in">
          <h2 className="text-xl font-bold text-slate-800 mb-4">{productoEditando ? 'Editar Orden' : 'Agregar Nueva Orden'}</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-600 mb-2">¿Qué vamos a confeccionar?</label>
              <input type="text" placeholder="Ej. Fundas de cojín..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg" value={nombre} onChange={e=>setNombre(e.target.value)} required autoFocus />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Cantidad</label>
              <input type="text" inputMode="numeric" placeholder="Ej. 50" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg" value={cantidad} onChange={e=>setCantidad(formatInputNumber(e.target.value))} required />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Empresa / Cliente</label>
              <div className="flex gap-2">
                <select className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg" value={empresa} onChange={e=>setEmpresa(e.target.value)} required>
                  <option value="">Seleccione una empresa...</option>
                  {empresas.map(emp => (
                    <option key={emp.id} value={emp.razonSocial}>{emp.razonSocial}</option>
                  ))}
                </select>
                {tieneRol('SUPERADMINISTRADOR') && (
                  <button type="button" onClick={()=>setMostrarModalEmpresas(true)} className="bg-slate-100 px-3 rounded-lg">Empresas</button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Ganancia por este trabajo</label>
              <input type="text" inputMode="numeric" placeholder="Ej. 150000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg" value={ganancia} onChange={e=>setGanancia(formatInputNumber(e.target.value))} required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Estado</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-semibold" value={estado} onChange={e=>setEstado(e.target.value as Producto['estado'])}>
                <option value="Pendiente">Pendiente</option>
                <option value="En proceso">En proceso</option>
                <option value="Terminado">Terminado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Fecha Asignación</label>
              <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg" value={fechaAsignacion} onChange={e=>setFechaAsignacion(e.target.value)} required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Fecha Terminación (Opcional)</label>
              <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg" value={fechaTerminacion} onChange={e=>setFechaTerminacion(e.target.value)} />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-600 mb-2">Acciones de la orden</label>
            {accionesProduccion.length === 0 ? (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-2">
                Define acciones en Configuración antes de asignarlas a la orden.
              </p>
            ) : (
            <div className="flex gap-2 mb-2">
              <select
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2"
                value={accionSeleccionada}
                onChange={(e) => setAccionSeleccionada(e.target.value)}
              >
                <option value="">Seleccione una acción…</option>
                {accionesProduccion.filter((a) => a.activa !== false).map((a) => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
              <button type="button" onClick={()=>{
                if (!accionSeleccionada) return;
                const accion = accionesProduccion.find((a) => a.id === accionSeleccionada);
                if (!accion) return;
                if (pasos.some((p) => p.accionProduccionId === accion.id)) {
                  return alert('Esa acción ya está en la orden.');
                }
                setPasos(prev => [...prev, { accionProduccionId: accion.id, descripcion: accion.nombre, orden: prev.length + 1 }]);
                setAccionSeleccionada('');
              }} className="bg-teal-600 text-white px-4 py-2 rounded-xl">Agregar</button>
            </div>
            )}
            <ul className="space-y-2">
              {pasos.map((p, idx) => (
                <li key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                  <div className="flex-1">{p.orden}. {p.descripcion}</div>
                  <div className="flex gap-2">
                    <button type="button" onClick={()=>{
                      setPasos(prev => prev.filter((_, i) => i !== idx).map((x, i)=> ({...x, orden: i+1})));
                    }} className="text-red-600">Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button type="submit" className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-md active:scale-95 transition-transform">
            Guardar Orden
          </button>
        </form>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
        <input 
          type="text" 
          placeholder="Buscar por producto o empresa..." 
          className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300 text-slate-500">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No encontramos órdenes.</p>
          </div>
        ) : (
          productosFiltrados.map((prod) => (
            <div key={prod.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              
              <div className="flex items-start md:items-center gap-4">
                <div className="bg-blue-50 text-blue-600 w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-extrabold text-xl shadow-inner shrink-0">
                  <span className="text-sm font-semibold opacity-70 leading-none mb-1">Cant.</span>
                   {formatMonto(prod.cantidad)}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-xl">{prod.nombre}</h3>
                  <p className="text-slate-500 font-medium mt-1">{prod.empresa}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <select
                      value={prod.estado}
                      onChange={(e) => cambiarEstadoProducto(prod.id, e.target.value as Producto['estado'])}
                      className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${getEstadoBadge(prod.estado)}`}
                      title="Cambiar estado sin editar la orden"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Terminado">Terminado</option>
                    </select>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {formatMonto(prod.ganancia)}
                    </span>
                  </div>
                  
                  <div className="text-xs text-slate-400 mt-3 font-semibold">
                    Asignado: {prod.fechaAsignacion} {prod.fechaTerminacion ? `| Terminado: ${prod.fechaTerminacion}` : ''}
                  </div>
                  {((prod as any).pasos) && (
                    <div className="text-sm text-slate-600 mt-3">
                      <strong>Pasos:</strong> {Array.isArray((prod as any).pasos) ? ((prod as any).pasos as any[]).map((p: any) => p.descripcion || p).join(', ') : ''}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                <button onClick={() => iniciarEdicion(prod)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-xl transition-transform active:scale-95 flex-1 md:flex-none flex justify-center">
                  <Edit2 size={20} />
                </button>
                <button onClick={() => { if(window.confirm('¿Eliminar esta orden?')) eliminarProducto(prod.id); }} className="bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-xl transition-transform active:scale-95 flex-1 md:flex-none flex justify-center">
                  <Trash2 size={20} />
                </button>
              </div>

            </div>
          ))
        )}
      </div>
      {mostrarModalEmpresas && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Administrar Empresas</h3>
              <button onClick={()=>setMostrarModalEmpresas(false)} className="text-slate-600">Cerrar</button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Crear nueva empresa</h4>
                <EmpresaForm onCreate={(emp)=>{
                  agregarEmpresa(emp);
                }} />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Empresas existentes</h4>
                <ul className="space-y-2 max-h-72 overflow-auto">
                  {empresas.map(e => (
                    <li key={e.id} className="border rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{e.razonSocial}</div>
                        <div className="text-xs text-slate-500">{e.telefono} • {e.correo}</div>
                        <div className="text-xs text-slate-400">{e.estado}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={()=>{ const nuevo = { ...e, estado: e.estado === 'Inactiva' ? 'Sin ordenes' : 'Inactiva' }; editarEmpresa(e.id, nuevo); }} className="text-sm bg-slate-100 px-3 rounded">Toggle</button>
                        <button onClick={()=>{ if(window.confirm('Eliminar empresa?')) eliminarEmpresa(e.id); }} className="text-sm text-red-600">Eliminar</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
