import React, { useState } from 'react';
import { useAppContext, Producto } from '../context/AppContext';
import { Search, Plus, Package, Edit2, Trash2 } from 'lucide-react';

export const Produccion = () => {
  const { productos, agregarProducto, editarProducto, eliminarProducto } = useAppContext();
  const [busqueda, setBusqueda] = useState('');
  
  // Estado para el formulario (Crear/Editar)
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEditando, setProductoEditando] = useState<string | null>(null);

  // Campos del formulario
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [ganancia, setGanancia] = useState('');
  const [fechaAsignacion, setFechaAsignacion] = useState(new Date().toISOString().split('T')[0]);
  const [fechaTerminacion, setFechaTerminacion] = useState('');
  const [estado, setEstado] = useState<Producto['estado']>('Pendiente');

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.empresa.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formatMonto = (num: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(num);
  };

  const resetForm = () => {
    setNombre(''); setCantidad(''); setEmpresa(''); setGanancia('');
    setFechaAsignacion(new Date().toISOString().split('T')[0]);
    setFechaTerminacion(''); setEstado('Pendiente');
    setProductoEditando(null); setMostrarForm(false);
  };

  const iniciarEdicion = (prod: Producto) => {
    setNombre(prod.nombre); setCantidad(prod.cantidad.toString());
    setEmpresa(prod.empresa); setGanancia(prod.ganancia.toString());
    setFechaAsignacion(prod.fechaAsignacion); setFechaTerminacion(prod.fechaTerminacion);
    setEstado(prod.estado); setProductoEditando(prod.id); setMostrarForm(true);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !cantidad || !empresa || !ganancia) return alert('Llene los campos obligatorios');
    
    const prodData = {
      nombre, cantidad: Number(cantidad), empresa, ganancia: Number(ganancia),
      fechaAsignacion, fechaTerminacion, estado
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
              <input type="number" placeholder="Ej. 50" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg" value={cantidad} onChange={e=>setCantidad(e.target.value)} required />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Empresa / Cliente</label>
              <input type="text" placeholder="Ej. Hotel El Sol" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg" value={empresa} onChange={e=>setEmpresa(e.target.value)} required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Ganancia por este trabajo</label>
              <input type="number" placeholder="Ej. 150000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg" value={ganancia} onChange={e=>setGanancia(e.target.value)} required />
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
                  {prod.cantidad}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-xl">{prod.nombre}</h3>
                  <p className="text-slate-500 font-medium mt-1">{prod.empresa}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getEstadoBadge(prod.estado)}`}>
                      {prod.estado}
                    </span>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {formatMonto(prod.ganancia)}
                    </span>
                  </div>
                  
                  <div className="text-xs text-slate-400 mt-3 font-semibold">
                    Asignado: {prod.fechaAsignacion} {prod.fechaTerminacion ? `| Terminado: ${prod.fechaTerminacion}` : ''}
                  </div>
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
    </div>
  );
};
