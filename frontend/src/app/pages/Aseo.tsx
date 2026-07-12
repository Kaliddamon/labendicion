import React, { useState, useEffect } from 'react';
import { useAppContext, RegistroAseo, RegistroAseoEntry } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Sparkles, CheckCircle2, Circle, Plus, Trash2, Check, X, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirm } from '../context/ConfirmContext';
import { getColombiaDateString } from '../utils/dateUtils';
import { Paginador } from '../components/Paginador';

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

  const { tieneRol } = useAuth();
  const { confirm } = useConfirm();

  const [verHistorico, setVerHistorico] = useState(false);
  const ultimoRegistro: RegistroAseo | null = registrosAseo && registrosAseo.length > 0 ? registrosAseo[0] : null;

  const tareasMostradas = ultimoRegistro
    ? [...ultimoRegistro.entries].sort((a, b) => a.empleadoNombre.localeCompare(b.empleadoNombre))
    : [] as RegistroAseoEntry[];

  const progreso = tareasMostradas.length > 0
    ? Math.round((tareasMostradas.filter(t => t.completada).length / tareasMostradas.length) * 100)
    : 0;

  const [paginaActualTareas, setPaginaActualTareas] = useState(1);
  const itemsPorPagina = 10;
  const totalPaginasTareas = Math.ceil(tareasMostradas.length / itemsPorPagina);
  const tareasPaginadas = tareasMostradas.slice((paginaActualTareas - 1) * itemsPorPagina, paginaActualTareas * itemsPorPagina);

  const [paginaActualHistorico, setPaginaActualHistorico] = useState(1);
  const totalPaginasHistorico = Math.ceil(registrosAseo.length / itemsPorPagina);
  const historicoPaginado = registrosAseo.slice((paginaActualHistorico - 1) * itemsPorPagina, paginaActualHistorico * itemsPorPagina);

  useEffect(() => {
    setPaginaActualTareas(1);
  }, [ultimoRegistro?.id]);

  const hoy = getColombiaDateString();
  const yaExisteHoy = ultimoRegistro ? ultimoRegistro.fecha.startsWith(hoy) : false;
  
  const accionesCatalogo = accionesAseo.filter((a) => a.activa !== false).map((a) => a.nombre);
  const areasCatalogo = areasTrabajo.filter((a) => a.activa !== false).map((a) => a.nombre);

  const handleCrearRegistroHoy = async () => {
    if (accionesCatalogo.length === 0 || areasCatalogo.length === 0) {
      return toast.warning('Configura al menos una acción y un área en Configuración antes de crear el registro.');
    }
    if (await confirm({ 
      title: '¿Crear registro de aseo?', 
      description: '¿Deseas crear el registro de aseo para hoy? Se asignarán automáticamente las mismas tareas del último día.',
      confirmText: 'Crear registro'
    })) {
      crearRegistroAseo(undefined, ultimoRegistro ? ultimoRegistro.entries : []);
    }
  };

  const [editandoEntry, setEditandoEntry] = useState<string | null>(null);
  const [editAcciones, setEditAcciones] = useState<string[]>([]);
  const [editAreas, setEditAreas] = useState<string[]>([]);

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
      return toast.warning('Debes asignar al menos una acción de aseo al empleado.');
    }
    if (editAreas.length === 0) {
      return toast.warning('Debes asignar al menos un área de trabajo al empleado.');
    }
    actualizarRegistroAseoEntry(registroId, entryId, editAcciones, editAreas);
    cancelarEdicion();
  };

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-1 rounded-full" style={{ background: 'var(--accent-copper)' }} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400" style={{ fontFamily: 'var(--font-heading)' }}>
              Limpieza
            </span>
          </div>
          <h1
            className="text-3xl font-bold flex items-center gap-3"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}
          >
            Gestión de Aseo
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
              <Sparkles size={18} className="text-amber-600" />
            </div>
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm">Mantengamos nuestro taller impecable</p>
        </div>

        {(tieneRol('ADMINISTRADOR') || tieneRol('SUPERADMINISTRADOR') || tieneRol('SUPERVISOR')) && (
          <button
            onClick={() => handleCrearRegistroHoy()}
            disabled={yaExisteHoy}
            className={`px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
              yaExisteHoy
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'text-[#1a1a2e] active:scale-[0.97]'
            }`}
            style={yaExisteHoy ? {} : { background: 'var(--accent-copper)', boxShadow: 'var(--shadow-copper)' }}
            title={yaExisteHoy ? 'Ya existe un registro para el día de hoy' : 'Crear nuevo registro'}
          >
            {yaExisteHoy ? <CheckCircle2 size={20} /> : <Plus size={20} />} 
            {yaExisteHoy ? 'Registro creado' : 'Nuevo Registro'}
          </button>
        )}
      </div>

      {/* Progress card */}
      <div
        className="rounded-2xl p-6 text-white mb-6"
        style={{
          background: 'linear-gradient(135deg, var(--indigo-deep) 0%, #0f172a 100%)',
          boxShadow: '0 8px 32px rgba(15, 23, 42, 0.15)',
        }}
      >
        <div className="flex justify-between items-end mb-3">
          <span className="text-sm font-medium text-slate-300" style={{ fontFamily: 'var(--font-heading)' }}>
            Progreso del día
          </span>
          <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            {progreso}<span className="text-lg text-white/50 ml-0.5">%</span>
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full transition-all duration-700"
            style={{
              width: `${progreso}%`,
              background: 'linear-gradient(90deg, var(--accent-copper), var(--accent-copper-bright))',
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>{tareasMostradas.filter(t => t.completada).length} completadas</span>
          <span>{tareasMostradas.length} total</span>
        </div>
      </div>

      {/* Tasks header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>Tareas de hoy</h2>
        <button
          onClick={() => setVerHistorico(!verHistorico)}
          className="text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors"
          style={{
            color: 'var(--accent-copper)',
            background: 'rgba(212,160,18,0.08)',
            border: '1px solid rgba(212,160,18,0.15)',
          }}
        >
          {verHistorico ? 'Ocultar histórico' : 'Ver histórico'}
        </button>
      </div>

      {/* Tasks table */}
      <div className="card-premium-static rounded-2xl overflow-hidden mb-6">
        {(!tareasMostradas || tareasMostradas.length === 0) ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--surface-linen)' }}>
              <Sparkles size={24} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--carbon)' }}>No hay registros de aseo para hoy.</p>
            <p className="text-xs text-slate-400 mt-1">Crea un nuevo registro para empezar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--surface-linen)', borderBottom: '1px solid var(--border-fiber)' }}>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500" style={{ fontFamily: 'var(--font-heading)' }}>Estado</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500" style={{ fontFamily: 'var(--font-heading)' }}>Empleado</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500" style={{ fontFamily: 'var(--font-heading)' }}>Acciones</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500" style={{ fontFamily: 'var(--font-heading)' }}>Áreas</th>
                  {(tieneRol('ADMINISTRADOR') || tieneRol('SUPERADMINISTRADOR') || tieneRol('SUPERVISOR')) && (
                    <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500" style={{ fontFamily: 'var(--font-heading)' }}>Opciones</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {tareasPaginadas.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    className="transition-colors hover:bg-[var(--surface-linen)]/50"
                    style={{
                      borderBottom: idx < tareasMostradas.length - 1 ? '1px solid var(--border-fiber-light)' : 'none',
                      background: entry.completada ? 'var(--surface-linen)' : 'transparent',
                    }}
                  >
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleRegistroAseoEntry(ultimoRegistro!.id, entry.id)}
                        className={`transition-transform ${(!tieneRol('ADMINISTRADOR') && !tieneRol('SUPERADMINISTRADOR') && !tieneRol('SUPERVISOR')) ? 'cursor-default opacity-80' : 'active:scale-[0.92]'}`}
                        disabled={!tieneRol('ADMINISTRADOR') && !tieneRol('SUPERADMINISTRADOR') && !tieneRol('SUPERVISOR')}
                      >
                        {entry.completada ? (
                          <CheckCircle2 size={24} style={{ color: 'var(--status-success)' }} />
                        ) : (
                          <Circle size={24} className="text-slate-300 hover:text-slate-400" />
                        )}
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`font-medium text-sm ${entry.completada ? 'text-slate-400 line-through' : ''}`} style={{ color: entry.completada ? undefined : 'var(--carbon)' }}>
                        {entry.empleadoNombre}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {editandoEntry === entry.id ? (
                        <div className="flex flex-wrap gap-1.5">
                          {accionesCatalogo.map(accion => (
                            <button
                              key={accion}
                              onClick={() => toggleAccion(accion)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
                                editAcciones.includes(accion)
                                  ? 'text-[#1a1a2e] border-transparent'
                                  : 'text-slate-600 border-[var(--border-fiber)] hover:bg-[var(--surface-linen)]'
                              }`}
                              style={editAcciones.includes(accion) ? { background: 'var(--accent-copper)' } : {}}
                            >
                              {accion}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {entry.acciones.length === 0 ? (
                            <span className="text-slate-400 italic text-xs">Sin acciones</span>
                          ) : (
                            entry.acciones.map((accion, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-lg text-[11px] font-medium" style={{ background: 'rgba(212,160,18,0.1)', color: 'var(--accent-copper)' }}>
                                {accion}
                              </span>
                            ))
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {editandoEntry === entry.id ? (
                        <div className="flex flex-wrap gap-1.5">
                          {areasCatalogo.map(area => (
                            <button
                              key={area}
                              onClick={() => toggleArea(area)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
                                editAreas.includes(area)
                                  ? 'bg-blue-600 text-white border-transparent'
                                  : 'text-slate-600 border-[var(--border-fiber)] hover:bg-[var(--surface-linen)]'
                              }`}
                            >
                              {area}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {entry.areas.length === 0 ? (
                            <span className="text-slate-400 italic text-xs">Sin áreas</span>
                          ) : (
                            entry.areas.map((area, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-blue-50 text-blue-700">
                                {area}
                              </span>
                            ))
                          )}
                        </div>
                      )}
                    </td>

                    {(tieneRol('ADMINISTRADOR') || tieneRol('SUPERADMINISTRADOR') || tieneRol('SUPERVISOR')) && (
                      <td className="px-5 py-4 text-center">
                        {editandoEntry === entry.id ? (
                          <div className="flex justify-center gap-1.5">
                            <button
                              onClick={() => guardarEdicion(ultimoRegistro!.id, entry.id)}
                              className="p-2 rounded-lg transition-colors hover:bg-emerald-50"
                              style={{ border: '1px solid rgba(22,163,74,0.2)' }}
                              title="Guardar"
                            >
                              <Check size={16} className="text-emerald-600" />
                            </button>
                            <button
                              onClick={cancelarEdicion}
                              className="p-2 rounded-lg transition-colors hover:bg-rose-50"
                              style={{ border: '1px solid rgba(225,29,72,0.15)' }}
                              title="Cancelar"
                            >
                              <X size={16} className="text-rose-500" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => iniciarEdicion(entry)}
                            className="p-2 rounded-lg transition-colors hover:bg-[var(--surface-linen)]"
                            style={{ border: '1px solid var(--border-fiber)' }}
                            title="Editar"
                          >
                            <Edit2 size={16} className="text-slate-500" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPaginasTareas > 1 && (
              <Paginador
                paginaActual={paginaActualTareas}
                totalPaginas={totalPaginasTareas}
                cambiarPagina={setPaginaActualTareas}
              />
            )}
          </div>
        )}
      </div>

      {/* Historical */}
      {verHistorico && (
        <div className="mt-6 animate-fade-up">
          <h3 className="text-sm font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>Histórico de registros</h3>
          <div className="space-y-2.5">
            {historicoPaginado.map(r => (
              <div key={r.id} className="card-premium-static p-4 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <strong className="text-sm" style={{ color: 'var(--carbon)', fontFamily: 'var(--font-heading)' }}>{r.fecha}</strong>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs text-slate-500">{r.entries.length} empleados</span>
                    {tieneRol('SUPERADMIN') && (
                      <button
                        onClick={async () => { if(await confirm({ title: '¿Eliminar registro?', description: '¿Seguro que deseas eliminar este registro de aseo?', confirmText: 'Eliminar' })) eliminarRegistroAseo(r.id); }}
                        className="text-rose-500 hover:text-rose-600 active:scale-95 transition-transform"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  {r.entries.length === 0 ? (
                    <p className="italic text-slate-400">Sin entrada de datos</p>
                  ) : (
                    r.entries.map(e => (
                      <div key={e.id} className="flex justify-between py-0.5">
                        <span className="font-medium" style={{ color: 'var(--carbon)' }}>{e.empleadoNombre}</span>
                        <span className="text-slate-400">
                          {e.acciones.join(', ') || 'Sin acciones'} • {e.areas.join(', ') || 'Sin áreas'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
          {totalPaginasHistorico > 1 && (
            <Paginador
              paginaActual={paginaActualHistorico}
              totalPaginas={totalPaginasHistorico}
              cambiarPagina={setPaginaActualHistorico}
            />
          )}
        </div>
      )}
    </div>
  );
};
