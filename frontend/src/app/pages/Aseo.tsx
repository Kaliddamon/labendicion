import React, { useState } from 'react';
import { useAppContext, RegistroAseo, RegistroAseoEntry } from '../context/AppContext';
import { Sparkles, CheckCircle2, Circle, Plus, Trash2, Check, X, Edit2 } from 'lucide-react';

export const Aseo = () => {
  const {
    registrosAseo,
    crearRegistroAseo,
    toggleRegistroAseoEntry,
    actualizarRegistroAseoEntry,
    eliminarRegistroAseo,
    accionesAseo,
    areasTrabajo,
  } = useAppContext();

  // Mostrar el registro más reciente y permitir crear un nuevo registro (se autofillará)
  const [verHistorico, setVerHistorico] = useState(false);
  const ultimoRegistro: RegistroAseo | null = registrosAseo && registrosAseo.length > 0 ? registrosAseo[0] : null;

  const tareasMostradas = ultimoRegistro ? ultimoRegistro.entries : [] as RegistroAseoEntry[];

  const progreso = tareasMostradas.length > 0
    ? Math.round((tareasMostradas.filter(t => t.completada).length / tareasMostradas.length) * 100)
    : 0;

  const crearNuevoRegistro = () => {
    if (accionesCatalogo.length === 0 || areasCatalogo.length === 0) {
      return alert('Configura al menos una acción y un área en Configuración antes de crear el registro.');
    }
    crearRegistroAseo();
  };

  const toggleEntry = (registroId: string, entryId: string) => {
    toggleRegistroAseoEntry(registroId, entryId);
  };

  // --- Estados para edición inline de entry ---
  const [editandoEntry, setEditandoEntry] = useState<string | null>(null);
  const [editAcciones, setEditAcciones] = useState<string[]>([]);
  const [editAreas, setEditAreas] = useState<string[]>([]);

  const accionesCatalogo = accionesAseo.filter((a) => a.activa !== false).map((a) => a.nombre);
  const areasCatalogo = areasTrabajo.filter((a) => a.activa !== false).map((a) => a.nombre);

  const iniciarEdicion = (entry: RegistroAseoEntry) => {
    setEditandoEntry(entry.id);
    setEditAcciones([...entry.acciones]);
    setEditAreas([...entry.areas]);
  };

  const cancelarEdicion = () => {
    setEditandoEntry(null);
    setEditAcciones([]);
    setEditAreas([]);
  };

  const toggleAccion = (accion: string) => {
    setEditAcciones((prev) => (prev.includes(accion) ? prev.filter(a => a !== accion) : [...prev, accion]));
  };

  const toggleArea = (area: string) => {
    setEditAreas((prev) => (prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]));
  };

  const guardarEdicion = (registroId: string, entryId: string) => {
    if (editAcciones.length === 0) {
      return alert('Debes asignar al menos una acción de aseo al empleado.');
    }
    if (editAreas.length === 0) {
      return alert('Debes asignar al menos un área de trabajo al empleado.');
    }
    // Llamar al contexto para actualizar acciones/areas del entry
    actualizarRegistroAseoEntry(registroId, entryId, editAcciones, editAreas);
    cancelarEdicion();
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
          <Plus size={24} /> Nuevo Registro
        </button>
      </div>

      {/* Tarjeta de progreso */}
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
        <h2 className="text-2xl font-bold text-slate-800">Tareas de hoy</h2>
        <button
          onClick={() => setVerHistorico(!verHistorico)}
          className="text-teal-600 font-bold bg-teal-50 px-4 py-2 rounded-xl hover:bg-teal-100 active:scale-95 transition-transform"
        >
          {verHistorico ? 'Ocultar histórico' : 'Ver histórico'}
        </button>
      </div>

      {/* Tabla de tareas */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {(!tareasMostradas || tareasMostradas.length === 0) ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg font-medium">No hay registros de aseo para hoy.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Estado</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Empleado</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Acciones</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Áreas</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tareasMostradas.map((entry) => (
                  <tr key={entry.id} className={`transition-colors ${entry.completada ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                    {/* Estado */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleRegistroAseoEntry(ultimoRegistro!.id, entry.id)}
                        className="text-left active:scale-[0.98] transition-transform"
                      >
                        {entry.completada ? (
                          <CheckCircle2 size={28} className="text-teal-500" />
                        ) : (
                          <Circle size={28} className="text-slate-300" />
                        )}
                      </button>
                    </td>

                    {/* Nombre del empleado */}
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${entry.completada ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {entry.empleadoNombre}
                      </span>
                    </td>

                    {/* Acciones o editor */}
                    <td className="px-6 py-4">
                      {editandoEntry === entry.id ? (
                        <div className="flex flex-wrap gap-2">
                          {accionesCatalogo.map(accion => (
                            <button
                              key={accion}
                              onClick={() => toggleAccion(accion)}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                editAcciones.includes(accion)
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {accion}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {entry.acciones.length === 0 ? (
                            <span className="text-slate-400 italic">Sin acciones</span>
                          ) : (
                            entry.acciones.map((accion, i) => (
                              <span key={i} className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                                {accion}
                              </span>
                            ))
                          )}
                        </div>
                      )}
                    </td>

                    {/* Áreas o editor */}
                    <td className="px-6 py-4">
                      {editandoEntry === entry.id ? (
                        <div className="flex flex-wrap gap-2">
                          {areasCatalogo.map(area => (
                            <button
                              key={area}
                              onClick={() => toggleArea(area)}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                editAreas.includes(area)
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {area}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {entry.areas.length === 0 ? (
                            <span className="text-slate-400 italic">Sin áreas</span>
                          ) : (
                            entry.areas.map((area, i) => (
                              <span key={i} className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                                {area}
                              </span>
                            ))
                          )}
                        </div>
                      )}
                    </td>

                    {/* Botones de acción */}
                    <td className="px-6 py-4 text-center">
                      {editandoEntry === entry.id ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => guardarEdicion(ultimoRegistro!.id, entry.id)}
                            className="p-2 bg-teal-50 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors"
                            title="Guardar"
                          >
                            <Check size={20} />
                          </button>
                          <button
                            onClick={cancelarEdicion}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Cancelar"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => iniciarEdicion(entry)}
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={20} />
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

      {/* Histórico */}
      {verHistorico && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Histórico de registros</h3>
          <div className="space-y-3">
            {registrosAseo.map(r => (
              <div key={r.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <strong className="text-slate-800">{r.fecha}</strong>
                  <div className="text-right">
                    <span className="text-sm text-slate-500">{r.entries.length} empleados</span>
                    {tieneRol('SUPERADMIN') && (
                      <button
                        onClick={() => { if(window.confirm('¿Eliminar este registro?')) eliminarRegistroAseo(r.id); }}
                        className="ml-4 text-red-600 hover:text-red-700 active:scale-95 transition-transform"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  {r.entries.length === 0 ? (
                    <p className="italic text-slate-400">Sin entrada de datos</p>
                  ) : (
                    r.entries.map(e => (
                      <div key={e.id} className="flex justify-between">
                        <span className="font-medium">{e.empleadoNombre}</span>
                        <span className="text-slate-500">
                          {e.acciones.join(', ') || 'Sin acciones'} • {e.areas.join(', ') || 'Sin áreas'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
