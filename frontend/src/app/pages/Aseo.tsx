import React, { useState } from 'react';
import { useAppContext, RegistroAseo, RegistroAseoEntry } from '../context/AppContext';
import { Sparkles, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';

export const Aseo = () => {
  const { registrosAseo, crearRegistroAseo, toggleRegistroAseoEntry, eliminarRegistroAseo } = useAppContext();

  // Mostrar el registro más reciente y permitir crear un nuevo registro (se autofillará)
  const [verHistorico, setVerHistorico] = useState(false);
  const ultimoRegistro: RegistroAseo | null = registrosAseo && registrosAseo.length > 0 ? registrosAseo[0] : null;

  const tareasMostradas = ultimoRegistro ? ultimoRegistro.entries : [] as RegistroAseoEntry[];

  const progreso = tareasMostradas.length > 0
    ? Math.round((tareasMostradas.filter(t => t.completada).length / tareasMostradas.length) * 100)
    : 0;

  const crearNuevoRegistro = () => {
    // Backend autorellena con acciones/areas del último registro por trabajador
    crearRegistroAseo();
  };

  const toggleEntry = (registroId: string, entryId: string) => {
    toggleRegistroAseoEntry(registroId, entryId);
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
          onClick={() => crearNuevoRegistro()}
          className={`bg-teal-600 hover:bg-teal-700 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95`}
        >
          <><Plus size={24} /> Nuevo Registro</>
        </button>
      </div>

      {/* No hay formulario libre: los registros se crean y prefills son gestionados por el backend */}

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
        <div className="flex gap-2">
          <button
            onClick={() => setVerHistorico(!verHistorico)}
            className="text-teal-600 font-bold bg-teal-50 px-4 py-2 rounded-xl active:scale-95 transition-transform"
          >
            {verHistorico ? 'Ocultar histórico' : 'Ver histórico'}
          </button>
          <button
            onClick={() => crearNuevoRegistro()}
            className="text-white font-bold bg-amber-500 px-4 py-2 rounded-xl active:scale-95 transition-transform"
          >
            Crear registro (autofill)
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {(!tareasMostradas || tareasMostradas.length === 0) ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300 text-slate-500">
            <p className="text-lg font-medium">No hay registros de aseo para hoy.</p>
          </div>
        ) : (
          tareasMostradas.map((entry) => (
            <div key={entry.id} className={`w-full flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl shadow-sm border transition-all gap-5 ${entry.completada ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-teal-100 hover:border-teal-300'}`}>
              <button onClick={() => toggleEntry(ultimoRegistro!.id, entry.id)} className="flex items-center gap-5 flex-1 text-left active:scale-[0.98] transition-transform w-full md:w-auto">
                <div className={`shrink-0 ${entry.completada ? 'text-teal-500' : 'text-slate-300'}`}>
                  {entry.completada ? <CheckCircle2 size={40} /> : <Circle size={40} />}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold flex flex-wrap gap-2 items-center ${entry.completada ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                    <span>{entry.empleadoNombre}</span>
                    <span className="text-teal-700 bg-teal-50 px-2 py-1 rounded text-sm no-underline">{entry.acciones.join(', ')}</span>
                    <span className="text-slate-500 bg-slate-50 px-2 py-1 rounded text-sm">{entry.areas.join(', ')}</span>
                  </h3>
                </div>
              </button>

              <div className="flex items-center gap-2 justify-end w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                <button onClick={() => { if(window.confirm('¿Eliminar este registro?')) eliminarRegistroAseo(ultimoRegistro!.id); }} className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-transform active:scale-95 flex-1 md:flex-none flex justify-center">
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {verHistorico && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Histórico de registros</h3>
          <div className="space-y-4">
            {registrosAseo.map(r => (
              <div key={r.id} className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="flex justify-between items-center mb-2">
                  <strong>{r.fecha}</strong>
                  <span className="text-sm text-slate-500">{r.entries.length} empleados</span>
                </div>
                <div className="text-sm text-slate-700">{r.entries.map(e => `${e.empleadoNombre}: ${e.acciones.join(', ')} [${e.areas.join(', ')}]`).join(' • ')}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
