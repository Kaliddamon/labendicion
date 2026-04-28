import React, { useState } from 'react';
import { useAppContext, TareaAseo } from '../context/AppContext';
import { Sparkles, CheckCircle2, Circle, Plus, Trash2, Edit2 } from 'lucide-react';

export const Aseo = () => {
  const { tareasAseo, toggleTareaAseo, agregarTareaAseo, editarTareaAseo, eliminarTareaAseo } = useAppContext();
  
  // Filtro
  const [verCompletadas, setVerCompletadas] = useState(false);
  
  // Estado para el formulario
  const [mostrarForm, setMostrarForm] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<string | null>(null);

  // Listas Finitas
  const opcionesAccion = ['Barrer', 'Trapear', 'Organizar', 'Limpiar', 'Desinfectar', 'Bañar', 'Asear'];
  const opcionesArea = ['Sala', 'Cocina', 'Baño', 'Oficina', 'Patio', 'Área de corte', 'Almacén'];

  // Formulario
  const [accion, setAccion] = useState(opcionesAccion[0]);
  const [area, setArea] = useState(opcionesArea[0]);
  const [encargado, setEncargado] = useState('');

  const tareasMostradas = tareasAseo.filter(t => verCompletadas ? true : !t.completada);

  const progreso = tareasAseo.length > 0 
    ? Math.round((tareasAseo.filter(t => t.completada).length / tareasAseo.length) * 100) 
    : 0;

  const resetForm = () => {
    setAccion(opcionesAccion[0]);
    setArea(opcionesArea[0]);
    setEncargado('');
    setTareaEditando(null);
    setMostrarForm(false);
  };

  const iniciarEdicion = (tarea: TareaAseo) => {
    setAccion(opcionesAccion.includes(tarea.accion) ? tarea.accion : opcionesAccion[0]);
    setArea(opcionesArea.includes(tarea.area) ? tarea.area : opcionesArea[0]);
    setEncargado(tarea.encargado);
    setTareaEditando(tarea.id);
    setMostrarForm(true);
  };

  const guardarTarea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!encargado) return alert('Por favor, indica quién es el encargado.');

    if (tareaEditando) {
      editarTareaAseo(tareaEditando, { accion, area, encargado });
    } else {
      agregarTareaAseo({ accion, area, encargado, completada: false });
    }

    resetForm();
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-teal-900 flex items-center gap-3">
            Gestión de Aseo <Sparkles className="text-amber-500" />
          </h1>
          <p className="text-slate-500 mt-2">Mantengamos nuestro taller impecable</p>
        </div>
        
        <button 
          onClick={() => { resetForm(); setMostrarForm(!mostrarForm); }}
          className={`${mostrarForm ? 'bg-slate-200 text-slate-800' : 'bg-teal-600 hover:bg-teal-700 text-white'} px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95`}
        >
          {mostrarForm ? 'Cancelar' : <><Plus size={24} /> Nueva Tarea</>}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={guardarTarea} className="bg-white p-6 rounded-3xl shadow-sm border border-teal-100 mb-8 slide-in-from-top-4 animate-in">
          <h2 className="text-xl font-bold text-slate-800 mb-6">{tareaEditando ? 'Editar Tarea' : 'Añadir tarea de limpieza'}</h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Acción a realizar</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                value={accion}
                onChange={e => setAccion(e.target.value)}
              >
                {opcionesAccion.map(opc => <option key={opc} value={opc}>{opc}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Área del taller</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                value={area}
                onChange={e => setArea(e.target.value)}
              >
                {opcionesArea.map(opc => <option key={opc} value={opc}>{opc}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Encargado</label>
              <input 
                type="text" 
                placeholder="Ej. Carlos" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={encargado}
                onChange={e => setEncargado(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-md active:scale-95 transition-transform">
            Guardar Tarea
          </button>
        </form>
      )}

      {/* Tarjeta de progreso gigante */}
      <div className="bg-teal-700 rounded-3xl p-6 text-white mb-8 shadow-lg">
        <div className="flex justify-between items-end mb-4">
          <span className="text-xl font-semibold">Progreso del día</span>
          <span className="text-4xl font-extrabold">{progreso}%</span>
        </div>
        <div className="w-full bg-teal-900/50 rounded-full h-4">
          <div 
            className="bg-amber-400 h-4 rounded-full transition-all duration-500" 
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Tareas asignadas</h2>
        <button 
          onClick={() => setVerCompletadas(!verCompletadas)}
          className="text-teal-600 font-bold bg-teal-50 px-4 py-2 rounded-xl active:scale-95 transition-transform"
        >
          {verCompletadas ? 'Ocultar completadas' : 'Ver todas'}
        </button>
      </div>

      <div className="grid gap-4">
        {tareasMostradas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300 text-slate-500">
            <p className="text-lg font-medium">¡Todo limpio por ahora! ✨</p>
          </div>
        ) : (
          tareasMostradas.map((tarea) => (
            <div 
              key={tarea.id}
              className={`w-full flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl shadow-sm border transition-all gap-5
                ${tarea.completada 
                  ? 'bg-slate-50 border-slate-200 opacity-60' 
                  : 'bg-white border-teal-100 hover:border-teal-300'}`}
            >
              <button 
                onClick={() => toggleTareaAseo(tarea.id)}
                className="flex items-center gap-5 flex-1 text-left active:scale-[0.98] transition-transform w-full md:w-auto"
              >
                <div className={`shrink-0 ${tarea.completada ? 'text-teal-500' : 'text-slate-300'}`}>
                  {tarea.completada ? <CheckCircle2 size={40} /> : <Circle size={40} />}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold flex flex-wrap gap-2 items-center ${tarea.completada ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                    <span>{tarea.accion}</span>
                    <span className="text-teal-700 bg-teal-50 px-2 py-1 rounded text-sm no-underline">{tarea.area}</span>
                  </h3>
                  <p className="text-slate-500 font-medium mt-2">
                    Encargado: <span className="font-bold text-slate-700">{tarea.encargado}</span>
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-2 justify-end w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                <button 
                  onClick={() => iniciarEdicion(tarea)}
                  className="p-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-transform active:scale-95 flex-1 md:flex-none flex justify-center"
                >
                  <Edit2 size={24} />
                </button>
                <button 
                  onClick={() => { if(window.confirm('¿Eliminar esta tarea?')) eliminarTareaAseo(tarea.id); }}
                  className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-transform active:scale-95 flex-1 md:flex-none flex justify-center"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
