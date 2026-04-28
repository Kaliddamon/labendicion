import React, { useState } from 'react';
import { useAppContext, Empleado, ProduccionRegistro } from '../context/AppContext';
import { Users, Plus, Star, ClipboardList, Trash2, Edit2, CheckCircle2, History, Clock, MinusCircle, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

export const Empleados = () => {
  const {
    empleados,
    agregarEmpleado,
    editarEmpleado,
    eliminarEmpleado,
    registros,
    agregarRegistro,
    productos,
  } = useAppContext();

  const crearLineaProduccionVacia = (): ProduccionRegistro => ({
    productoId: '',
    unidadesTotales: 0,
    unidadesBuenas: 0,
  });

  const etiquetaOrden = (productoId: string) => {
    const p = productos.find((x) => x.id === productoId);
    if (!p) return 'Orden no encontrada';
    return `${p.nombre} · ${p.empresa}`;
  };

  // Estados para el CRUD de empleados
  const [mostrarFormEmpleado, setMostrarFormEmpleado] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState<string | null>(null);

  // Estados del Formulario de Empleado
  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [estado, setEstado] = useState<'Activo'|'Inactivo'>('Activo');

  // Estados para calificar empleado en un día
  const [empleadoCalificando, setEmpleadoCalificando] = useState<string | null>(null);
  const [calificacionFecha, setCalificacionFecha] = useState(new Date().toISOString().split('T')[0]);
  const [calificacionHoraEntrada, setCalificacionHoraEntrada] = useState('08:00');
  const [calificacionHoraSalida, setCalificacionHoraSalida] = useState('17:00');
  const [calificacionAsistencia, setCalificacionAsistencia] = useState(true);
  const [calificacionProducciones, setCalificacionProducciones] = useState<ProduccionRegistro[]>([
    crearLineaProduccionVacia(),
  ]);

  // Estado para ver el historial
  const [empleadoViendoHistorial, setEmpleadoViendoHistorial] = useState<string | null>(null);

  const [modalOrdenProduccion, setModalOrdenProduccion] = useState<{
    fecha: string;
    indice: number;
    item: ProduccionRegistro;
  } | null>(null);

  const resetFormEmpleado = () => {
    setNombre(''); setCargo(''); setDocumento(''); setTelefono(''); 
    setFechaIngreso(''); setEstado('Activo'); setEmpleadoEditando(null); setMostrarFormEmpleado(false);
  };

  const iniciarEdicion = (emp: Empleado) => {
    setNombre(emp.nombre); setCargo(emp.cargo); setDocumento(emp.documento);
    setTelefono(emp.telefono); setFechaIngreso(emp.fechaIngreso); setEstado(emp.estado);
    setEmpleadoEditando(emp.id); setMostrarFormEmpleado(true);
    setEmpleadoCalificando(null); 
    setEmpleadoViendoHistorial(null);
  };

  const guardarEmpleado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !documento) return alert('El nombre y documento son obligatorios');

    if (empleadoEditando) {
      editarEmpleado(empleadoEditando, { nombre, cargo, documento, telefono, fechaIngreso, estado });
    } else {
      agregarEmpleado({ nombre, cargo, documento, telefono, fechaIngreso, estado });
    }
    resetFormEmpleado();
  };

  const abrirCalificacion = (empId: string) => {
    setEmpleadoViendoHistorial(null);
    setEmpleadoCalificando(empleadoCalificando === empId ? null : empId);
    setCalificacionProducciones([crearLineaProduccionVacia()]);
  };

  const abrirHistorial = (empId: string) => {
    setEmpleadoCalificando(null);
    setEmpleadoViendoHistorial(empleadoViendoHistorial === empId ? null : empId);
  };

  const guardarCalificacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empleadoCalificando) return;

    if (calificacionAsistencia) {
      if (productos.length === 0) {
        return alert('Primero crea al menos una orden en la sección Producción.');
      }
      if (calificacionProducciones.length === 0) {
        return alert('Debes vincular al menos una orden de producción.');
      }

      const ids = calificacionProducciones.map((p) => p.productoId).filter(Boolean);
      if (new Set(ids).size !== ids.length) {
        return alert('No puedes repetir la misma orden en dos líneas distintas.');
      }

      const invalida = calificacionProducciones.some((prod) => {
        const ordenOk = prod.productoId.length > 0 && productos.some((p) => p.id === prod.productoId);
        const subtotalOk = prod.unidadesTotales > 0;
        const calidadOk = prod.unidadesBuenas >= 0 && prod.unidadesBuenas <= prod.unidadesTotales;
        return !ordenOk || !subtotalOk || !calidadOk;
      });

      if (invalida) {
        return alert(
          'Revisa cada línea: elige una orden existente, confeccionadas > 0 y calidad no mayor a confeccionadas.'
        );
      }
    }

    const totalUnidades = calificacionAsistencia
      ? calificacionProducciones.reduce((acc, prod) => acc + Number(prod.unidadesTotales || 0), 0)
      : 0;
    const totalBuenas = calificacionAsistencia
      ? calificacionProducciones.reduce((acc, prod) => acc + Number(prod.unidadesBuenas || 0), 0)
      : 0;

    agregarRegistro({
      empleadoId: empleadoCalificando,
      fecha: calificacionFecha,
      horaEntrada: calificacionAsistencia ? calificacionHoraEntrada : '--:--',
      horaSalida: calificacionAsistencia ? calificacionHoraSalida : '--:--',
      unidadesTotales: totalUnidades,
      unidadesBuenas: totalBuenas,
      producciones: calificacionAsistencia ? calificacionProducciones : []
    });

    setEmpleadoCalificando(null);
    setCalificacionProducciones([crearLineaProduccionVacia()]);
    alert('Desempeño diario registrado correctamente ✅');
  };

  const actualizarProduccion = (
    index: number,
    field: keyof ProduccionRegistro,
    value: string | number
  ) => {
    setCalificacionProducciones((prev) =>
      prev.map((prod, i) => (i === index ? { ...prod, [field]: value } : prod))
    );
  };

  const agregarProduccion = () => {
    setCalificacionProducciones((prev) => [...prev, crearLineaProduccionVacia()]);
  };

  const quitarProduccion = (index: number) => {
    setCalificacionProducciones((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  // Obtener registros de un empleado para el historial
  const getRegistrosEmpleado = (empId: string) => {
    return registros.filter(r => r.empleadoId === empId).sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  };

  return (
    <div className="animate-in fade-in duration-300">
      <Dialog
        open={modalOrdenProduccion !== null}
        onOpenChange={(open) => {
          if (!open) setModalOrdenProduccion(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modalOrdenProduccion
                ? `Orden · ${modalOrdenProduccion.fecha} (línea ${modalOrdenProduccion.indice + 1})`
                : 'Orden de producción'}
            </DialogTitle>
          </DialogHeader>
          {(() => {
            const item = modalOrdenProduccion?.item;
            const orden = item ? productos.find((p) => p.id === item.productoId) : undefined;
            if (!item) return null;
            if (!orden) {
              return (
                <p className="text-sm text-rose-700">
                  Esta orden ya no existe en Producción (pudo haberse eliminado). Subtotales guardados:{' '}
                  {item.unidadesTotales} confeccionadas · {item.unidadesBuenas} calidad.
                </p>
              );
            }
            return (
              <div className="space-y-3 text-sm text-slate-700">
                <p>
                  <span className="font-bold text-slate-900">{orden.nombre}</span>
                </p>
                <p className="text-slate-600">Cliente: {orden.empresa}</p>
                <p className="text-slate-600">
                  Cantidad de la orden: <span className="font-semibold">{orden.cantidad}</span> · Estado:{' '}
                  <span className="font-semibold">{orden.estado}</span>
                </p>
                <p className="text-slate-600">
                  Asignación: {orden.fechaAsignacion}
                  {orden.fechaTerminacion ? ` · Entrega prevista: ${orden.fechaTerminacion}` : ''}
                </p>
                <p className="rounded-lg border border-amber-100 bg-amber-50/80 px-3 py-2 text-slate-800">
                  Aporte registrado este día:{' '}
                  <span className="font-bold">{item.unidadesTotales}</span> confeccionadas ·{' '}
                  <span className="font-bold text-emerald-800">{item.unidadesBuenas}</span> calidad
                </p>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-teal-900 flex items-center gap-3">
            Equipo de Trabajo <Users className="text-emerald-500" />
          </h1>
          <p className="text-slate-500 mt-2">Gestiona el personal y revisa su desempeño</p>
        </div>
        
        <button 
          onClick={() => { resetFormEmpleado(); setMostrarFormEmpleado(!mostrarFormEmpleado); }}
          className={`${mostrarFormEmpleado ? 'bg-slate-200 text-slate-800' : 'bg-emerald-600 hover:bg-emerald-700 text-white'} px-6 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95`}
        >
          {mostrarFormEmpleado ? 'Cancelar' : <><Plus size={24} /> Nuevo Empleado</>}
        </button>
      </div>

      {mostrarFormEmpleado && (
        <form onSubmit={guardarEmpleado} className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 mb-8 slide-in-from-top-4 animate-in">
          <h2 className="text-xl font-bold text-slate-800 mb-6">{empleadoEditando ? 'Editar Empleado' : 'Agregar Empleado'}</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Nombre Completo</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg" value={nombre} onChange={e=>setNombre(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Documento de Identidad</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg" value={documento} onChange={e=>setDocumento(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Cargo / Rol</label>
              <input type="text" placeholder="Ej. Costurera, Cortador..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg" value={cargo} onChange={e=>setCargo(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Teléfono</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg" value={telefono} onChange={e=>setTelefono(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Fecha de Ingreso</label>
              <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg" value={fechaIngreso} onChange={e=>setFechaIngreso(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Estado</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg" value={estado} onChange={e=>setEstado(e.target.value as 'Activo'|'Inactivo')}>
                <option value="Activo">Activo trabajando</option>
                <option value="Inactivo">Inactivo / Retirado</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-md active:scale-95 transition-transform">
            Guardar Empleado
          </button>
        </form>
      )}

      <div className="grid gap-6">
        {empleados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300 text-slate-500">
            <p className="text-lg">No hay empleados registrados aún.</p>
          </div>
        ) : (
          empleados.map(emp => (
            <div key={emp.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              
              {/* Tarjeta del Empleado */}
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-extrabold text-slate-800">{emp.nombre}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${emp.estado === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {emp.estado}
                    </span>
                  </div>
                  <p className="text-slate-500 text-lg font-medium">{emp.cargo}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
                    <span className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">C.C. {emp.documento}</span>
                    <span className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">📞 {emp.telefono || 'Sin teléfono'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <button 
                    onClick={() => abrirCalificacion(emp.id)}
                    className={`flex-1 md:flex-none px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 border-2 
                      ${empleadoCalificando === emp.id ? 'bg-amber-100 border-amber-500 text-amber-800' : 'bg-amber-500 hover:bg-amber-600 border-transparent text-white'}`}
                  >
                    <ClipboardList size={20} /> Evaluar
                  </button>
                  <button 
                    onClick={() => abrirHistorial(emp.id)}
                    className={`flex-1 md:flex-none px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 border-2 
                      ${empleadoViendoHistorial === emp.id ? 'bg-blue-100 border-blue-500 text-blue-800' : 'bg-blue-50 hover:bg-blue-100 border-transparent text-blue-700'}`}
                  >
                    <History size={20} /> Historial
                  </button>
                  <button onClick={() => iniciarEdicion(emp)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-xl transition-transform active:scale-95 border border-transparent">
                    <Edit2 size={20} />
                  </button>
                  <button onClick={() => { if(window.confirm('¿Seguro que deseas eliminar este empleado?')) eliminarEmpleado(emp.id); }} className="bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-xl transition-transform active:scale-95 border border-transparent">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* === HISTORIAL DE DESEMPEÑO === */}
              {empleadoViendoHistorial === emp.id && (
                <div className="bg-blue-50/50 p-6 animate-in slide-in-from-top-2">
                  <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><History size={20} /> Historial de Rendimiento</h4>
                  
                  {getRegistrosEmpleado(emp.id).length === 0 ? (
                    <p className="text-slate-500 bg-white p-4 rounded-xl border border-blue-100 text-center">No hay registros guardados para este empleado.</p>
                  ) : (
                    <div className="grid gap-3">
                      {getRegistrosEmpleado(emp.id).map(reg => (
                        <div key={reg.id} className="bg-white p-4 rounded-xl border border-blue-100 flex flex-col gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="bg-blue-100 text-blue-800 font-bold px-3 py-2 rounded-lg w-28 text-center shrink-0">
                                {reg.fecha}
                              </div>
                              {reg.horaEntrada !== '--:--' ? (
                                <div className="text-slate-600 text-sm font-medium flex items-center gap-1">
                                  <Clock size={16} /> {reg.horaEntrada} - {reg.horaSalida}
                                </div>
                              ) : (
                                <span className="text-rose-600 font-bold text-sm bg-rose-50 px-2 py-1 rounded">No Asistió</span>
                              )}
                            </div>

                            {reg.horaEntrada !== '--:--' && (
                              <div className="flex gap-6 shrink-0">
                                <div className="text-center">
                                  <span className="block text-xs text-slate-400 font-bold uppercase">Totales</span>
                                  <span className="font-extrabold text-slate-700 text-lg">{reg.unidadesTotales}</span>
                                </div>
                                <div className="text-center">
                                  <span className="block text-xs text-slate-400 font-bold uppercase">Con Calidad</span>
                                  <span className="font-extrabold text-emerald-600 text-lg">{reg.unidadesBuenas}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {reg.horaEntrada !== '--:--' && (reg.producciones?.length ?? 0) > 0 && (
                            <div className="border-t border-slate-100 pt-3 space-y-2">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                Órdenes vinculadas este día
                              </p>
                              {reg.producciones!.map((prod, index) => (
                                <div
                                  key={`${reg.id}-p-${index}`}
                                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                                >
                                  <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                                    <span className="font-bold text-slate-600 shrink-0">#{index + 1}</span>
                                    <span className="truncate font-medium text-slate-800" title={etiquetaOrden(prod.productoId)}>
                                      {etiquetaOrden(prod.productoId)}
                                    </span>
                                    <span className="text-slate-600 sm:ml-auto">
                                      <span className="font-semibold">{prod.unidadesTotales}</span> conf. ·{' '}
                                      <span className="font-semibold text-emerald-700">{prod.unidadesBuenas}</span>{' '}
                                      calidad
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setModalOrdenProduccion({ fecha: reg.fecha, indice: index, item: prod })
                                    }
                                    className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50 sm:self-center"
                                  >
                                    <FileText size={14} /> Ver orden
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* === FORMULARIO DE CALIFICACIÓN DIARIA === */}
              {empleadoCalificando === emp.id && (
                <form onSubmit={guardarCalificacion} className="bg-amber-50/50 p-6 animate-in slide-in-from-top-2">
                  <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-2"><Star size={20} /> Registrar trabajo de hoy</h4>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                    
                    <div className="flex flex-col gap-2">
                      <label className="block text-sm font-semibold text-amber-800">Fecha del registro</label>
                      <input type="date" value={calificacionFecha} onChange={e=>setCalificacionFecha(e.target.value)} className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500" required />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="block text-sm font-semibold text-amber-800">¿Asistió a trabajar?</label>
                      <button 
                        type="button" 
                        onClick={() => setCalificacionAsistencia(!calificacionAsistencia)}
                        className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border-2 transition-colors ${calificacionAsistencia ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-rose-100 border-rose-500 text-rose-700'}`}
                      >
                        {calificacionAsistencia ? <><CheckCircle2 size={20} /> Sí asistió</> : 'Faltó hoy'}
                      </button>
                    </div>

                    {calificacionAsistencia && (
                      <div className="lg:col-span-2 grid grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-amber-200">
                        <div className="col-span-2 border-b border-slate-100 pb-3 mb-1">
                          <p className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">⏱️ Asistencia y Horario</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Hora de Entrada</label>
                              <input type="time" value={calificacionHoraEntrada} onChange={e=>setCalificacionHoraEntrada(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-lg" required />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Hora de Salida</label>
                              <input type="time" value={calificacionHoraSalida} onChange={e=>setCalificacionHoraSalida(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-lg" required />
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2 pt-1">
                          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm font-bold uppercase tracking-wider text-slate-500">
                              ✂️ Vincular a órdenes de Producción
                            </p>
                            <button
                              type="button"
                              onClick={agregarProduccion}
                              disabled={productos.length === 0}
                              className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              + Agregar otra orden
                            </button>
                          </div>
                          {productos.length === 0 ? (
                            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                              No hay órdenes en Producción. Crea una orden allí para poder evaluar el trabajo del empleado
                              vinculado a esa confección.
                            </p>
                          ) : (
                          <div className="space-y-3">
                            {calificacionProducciones.map((prod, index) => {
                              const idsOtros = calificacionProducciones
                                .filter((_, i) => i !== index)
                                .map((p) => p.productoId)
                                .filter(Boolean);
                              const opciones = productos.filter(
                                (p) => p.id === prod.productoId || !idsOtros.includes(p.id)
                              );
                              return (
                              <div key={`prod-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <div className="mb-2 flex items-center justify-between">
                                  <p className="text-xs font-bold uppercase text-slate-600">Orden {index + 1}</p>
                                  <button
                                    type="button"
                                    onClick={() => quitarProduccion(index)}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 disabled:opacity-40"
                                    disabled={calificacionProducciones.length === 1}
                                  >
                                    <MinusCircle size={14} /> Quitar línea
                                  </button>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                                      Orden de producción
                                    </label>
                                    <select
                                      value={prod.productoId}
                                      onChange={(e) =>
                                        actualizarProduccion(index, 'productoId', e.target.value)
                                      }
                                      required
                                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium"
                                    >
                                      <option value="">Selecciona una orden…</option>
                                      {opciones.map((p) => (
                                        <option key={p.id} value={p.id}>
                                          {p.nombre} — {p.empresa} ({p.estado}, meta {p.cantidad} u.)
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:items-end">
                                    <div className="flex flex-col">
                                      <label
                                        className="mb-1 block min-h-[2.5rem] text-xs font-semibold leading-snug text-slate-500"
                                        title="Unidades confeccionadas de esta orden en el día"
                                      >
                                        Confeccionadas
                                        <span className="block text-[10px] font-normal normal-case text-slate-400">
                                          (subtotal del día)
                                        </span>
                                      </label>
                                      <input
                                        type="number"
                                        min={0}
                                        value={prod.unidadesTotales || ''}
                                        onChange={(e) =>
                                          actualizarProduccion(index, 'unidadesTotales', Number(e.target.value))
                                        }
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-lg font-bold"
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <label
                                        className="mb-1 block min-h-[2.5rem] text-xs font-semibold leading-snug text-emerald-600"
                                        title="Unidades con calidad aceptada"
                                      >
                                        Calidad
                                        <span className="block text-[10px] font-normal normal-case text-emerald-600/80">
                                          (subtotal del día)
                                        </span>
                                      </label>
                                      <input
                                        type="number"
                                        min={0}
                                        value={prod.unidadesBuenas || ''}
                                        onChange={(e) =>
                                          actualizarProduccion(index, 'unidadesBuenas', Number(e.target.value))
                                        }
                                        required
                                        className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-lg font-bold text-emerald-700"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                            })}
                          </div>
                          )}
                          <div className="mt-3 rounded-xl bg-white border border-amber-200 px-4 py-3 grid grid-cols-2 gap-4">
                            <p className="text-sm text-slate-600">
                              Total confeccionadas:{' '}
                              <span className="font-bold text-slate-800">
                                {calificacionProducciones.reduce((acc, p) => acc + Number(p.unidadesTotales || 0), 0)}
                              </span>
                            </p>
                            <p className="text-sm text-emerald-700">
                              Total calidad:{' '}
                              <span className="font-bold">
                                {calificacionProducciones.reduce((acc, p) => acc + Number(p.unidadesBuenas || 0), 0)}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button type="submit" className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-md active:scale-95 transition-transform">
                      Guardar Evaluación
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
