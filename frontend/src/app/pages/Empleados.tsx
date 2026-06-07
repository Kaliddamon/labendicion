import React, { useState } from 'react';
import { useAppContext, Empleado, ProduccionRegistro } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
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
    editarRegistro,
    eliminarRegistro,
    unidadesDisponiblesPaso,
    productos,
    cargos,
  } = useAppContext();
  const { tieneRol } = useAuth();

  const crearLineaProduccionVacia = (): ProduccionRegistro => ({
    productoId: '',
    pasoId: '',
    unidadesTotales: 0,
    unidadesBuenas: 0,
  });

  const etiquetaOrden = (productoId: string) => {
    const p = productos.find((x) => x.id === productoId);
    if (!p) return 'Orden no encontrada';
    return `${p.nombre} · ${p.empresa}`;
  };

  const [mostrarFormEmpleado, setMostrarFormEmpleado] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState<string | null>(null);

  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [estado, setEstado] = useState<'Activo'|'Inactivo'>('Activo');

  const [empleadoCalificando, setEmpleadoCalificando] = useState<string | null>(null);
  const [registroEditando, setRegistroEditando] = useState<string | null>(null);
  const [calificacionFecha, setCalificacionFecha] = useState(new Date().toISOString().split('T')[0]);
  const [calificacionHoraEntrada, setCalificacionHoraEntrada] = useState('08:00');
  const [calificacionHoraSalida, setCalificacionHoraSalida] = useState('17:00');
  const [calificacionAsistencia, setCalificacionAsistencia] = useState(true);
  const [calificacionProducciones, setCalificacionProducciones] = useState<ProduccionRegistro[]>([
    crearLineaProduccionVacia(),
  ]);

  const [empleadoViendoHistorial, setEmpleadoViendoHistorial] = useState<string | null>(null);

  const [modalOrdenProduccion, setModalOrdenProduccion] = useState<{
    fecha: string;
    indice: number;
    item: ProduccionRegistro;
  } | null>(null);

  const resetFormEmpleado = () => {
    setNombre(''); setCargo(''); setDocumento(''); setTelefono(''); setEmail('');
    setFechaIngreso(''); setEstado('Activo'); setEmpleadoEditando(null); setMostrarFormEmpleado(false);
  };

  const iniciarEdicion = (emp: Empleado) => {
    setNombre(emp.nombre); setCargo(emp.cargo?.id || ''); setDocumento(emp.documento);
    setTelefono(emp.telefono); setEmail(emp.email || ''); setFechaIngreso(emp.fechaIngreso); setEstado(emp.estado);
    setEmpleadoEditando(emp.id); setMostrarFormEmpleado(true);
    setEmpleadoCalificando(null);
    setEmpleadoViendoHistorial(null);
  };

  const guardarEmpleado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !documento) return alert('El nombre y documento son obligatorios');
    if (!/^[0-9]+$/.test(documento)) return alert('El documento debe contener únicamente números.');
    if (!cargo) return alert('El cargo es obligatorio. Por favor selecciona uno.');

    if (fechaIngreso) {
      const hoy = new Date().toISOString().split('T')[0];
      if (fechaIngreso > hoy) return alert('La fecha de ingreso no puede ser una fecha futura.');
    }

    if (telefono) {
      const telefonoValido = /^[0-9+\- ]{7,15}$/.test(telefono);
      if (!telefonoValido) return alert('El formato del teléfono es inválido. Usa solo números, espacios, + o -, entre 7 y 15 caracteres.');
    }

    const cargoObj = cargo ? { id: cargo, nombre: cargos.find(c => c.id === cargo)?.nombre || '' } : null;
    if (empleadoEditando) {
      editarEmpleado(empleadoEditando, { nombre, cargo: cargoObj, documento, telefono, email, fechaIngreso, estado });
    } else {
      agregarEmpleado({ nombre, cargo: cargoObj, documento, telefono, email, fechaIngreso, estado });
    }
    resetFormEmpleado();
  };

  const cancelarCalificacion = () => {
    setRegistroEditando(null);
    setEmpleadoCalificando(null);
    setCalificacionProducciones([crearLineaProduccionVacia()]);
    setCalificacionAsistencia(true);
    setCalificacionFecha(new Date().toISOString().split('T')[0]);
    setCalificacionHoraEntrada('08:00');
    setCalificacionHoraSalida('17:00');
  };

  const abrirCalificacion = (empId: string) => {
    setEmpleadoViendoHistorial(null);
    if (empleadoCalificando === empId && !registroEditando) {
      cancelarCalificacion();
      return;
    }
    setRegistroEditando(null);
    setEmpleadoCalificando(empId);
    setCalificacionProducciones([crearLineaProduccionVacia()]);
  };

  const abrirHistorial = (empId: string) => {
    setEmpleadoCalificando(null);
    setEmpleadoViendoHistorial(empleadoViendoHistorial === empId ? null : empId);
  };

  const etiquetaPaso = (productoId: string, pasoId: string) => {
    const p = productos.find((x) => x.id === productoId);
    const paso = p?.pasos?.find((ps) => ps.id === pasoId || (ps as { id?: string }).id === pasoId);
    return paso?.descripcion ?? 'Acción';
  };

  const cargarRegistroParaEdicion = (reg: typeof registros[0]) => {
    setRegistroEditando(reg.id);
    setCalificacionFecha(reg.fecha);
    setCalificacionAsistencia(reg.horaEntrada !== '--:--');
    setCalificacionHoraEntrada(reg.horaEntrada !== '--:--' ? reg.horaEntrada : '08:00');
    setCalificacionHoraSalida(reg.horaSalida !== '--:--' ? reg.horaSalida : '17:00');
    setCalificacionProducciones(
      reg.producciones?.length
        ? reg.producciones.map((p) => ({ ...p, pasoId: p.pasoId ?? '' }))
        : [crearLineaProduccionVacia()]
    );
    setEmpleadoCalificando(reg.empleadoId);
    setEmpleadoViendoHistorial(null);
  };

  const guardarCalificacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empleadoCalificando) return;

    if (calificacionAsistencia) {
      const hoy = new Date().toISOString().split('T')[0];
      if (calificacionFecha > hoy) {
        return alert('No se puede registrar una evaluación con fecha futura.');
      }

      if (productos.length === 0) {
        return alert('Primero crea al menos una orden en la sección Producción.');
      }
      if (calificacionProducciones.length === 0) {
        return alert('Debes vincular al menos una orden y acción de producción.');
      }

      const claves = calificacionProducciones
        .filter((p) => p.productoId && p.pasoId)
        .map((p) => `${p.productoId}:${p.pasoId}`);
      if (new Set(claves).size !== claves.length) {
        return alert('No puedes repetir la misma acción de la misma orden en dos líneas.');
      }

      for (const prod of calificacionProducciones) {
        const orden = productos.find((p) => p.id === prod.productoId);
        const pasoOk = orden?.pasos?.some((ps) => ps.id === prod.pasoId);
        if (!orden || !pasoOk) {
          return alert('Cada línea debe tener una orden y una acción válida de esa orden.');
        }
        if (prod.unidadesTotales <= 0) {
          return alert('Las unidades confeccionadas deben ser mayores a cero.');
        }
        if (prod.unidadesBuenas > prod.unidadesTotales) {
          return alert('La calidad no puede superar las unidades confeccionadas.');
        }
        const disponible = unidadesDisponiblesPaso(
          prod.productoId,
          prod.pasoId,
          registroEditando ?? undefined
        );
        if (prod.unidadesTotales > disponible) {
          return alert(
            `Para "${etiquetaPaso(prod.productoId, prod.pasoId)}" en ${orden.nombre} solo quedan ${disponible} unidades disponibles (meta: ${orden.cantidad}).`
          );
        }
      }
    }

    const totalUnidades = calificacionAsistencia
      ? calificacionProducciones.reduce((acc, prod) => acc + Number(prod.unidadesTotales || 0), 0)
      : 0;
    const totalBuenas = calificacionAsistencia
      ? calificacionProducciones.reduce((acc, prod) => acc + Number(prod.unidadesBuenas || 0), 0)
      : 0;

    const payload = {
      empleadoId: empleadoCalificando,
      fecha: calificacionFecha,
      horaEntrada: calificacionAsistencia ? calificacionHoraEntrada : '--:--',
      horaSalida: calificacionAsistencia ? calificacionHoraSalida : '--:--',
      unidadesTotales: totalUnidades,
      unidadesBuenas: totalBuenas,
      producciones: calificacionAsistencia ? calificacionProducciones : [],
    };

    try {
      if (registroEditando) {
        await editarRegistro(registroEditando, payload);
      } else {
        await agregarRegistro(payload);
      }
      setEmpleadoCalificando(null);
      setRegistroEditando(null);
      setCalificacionProducciones([crearLineaProduccionVacia()]);
      alert('Evaluación guardada correctamente ✅');
    } catch {
      alert('No se pudo guardar la evaluación. Revisa los datos o intenta de nuevo.');
    }
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

  const getRegistrosEmpleado = (empId: string) => {
    return registros.filter(r => r.empleadoId === empId).sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  };

  const inputStyle = {
    background: 'var(--surface-linen)',
    border: '1px solid var(--border-fiber)',
  };

  return (
    <div className="animate-fade-up">
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
              <div className="space-y-3 text-sm" style={{ color: 'var(--carbon)' }}>
                <p>
                  <span className="font-bold">{orden.nombre}</span>
                </p>
                <p className="text-slate-500">Cliente: {orden.empresa}</p>
                <p className="text-slate-500">
                  Cantidad: <span className="font-semibold">{orden.cantidad}</span> · Estado:{' '}
                  <span className="font-semibold">{orden.estado}</span>
                </p>
                <p className="text-slate-500">
                  Asignación: {orden.fechaAsignacion}
                  {orden.fechaTerminacion ? ` · Entrega: ${orden.fechaTerminacion}` : ''}
                </p>
                <div className="rounded-xl px-3 py-2" style={{ background: 'var(--surface-linen)', border: '1px solid var(--border-fiber)' }}>
                  Aporte este día:{' '}
                  <span className="font-bold">{item.unidadesTotales}</span> confeccionadas ·{' '}
                  <span className="font-bold text-emerald-700">{item.unidadesBuenas}</span> calidad
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-1 rounded-full" style={{ background: 'var(--accent-copper)' }} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400" style={{ fontFamily: 'var(--font-heading)' }}>
              Personal
            </span>
          </div>
          <h1
            className="text-3xl font-bold flex items-center gap-3"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}
          >
            Equipo de Trabajo
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Users size={18} className="text-emerald-600" />
            </div>
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm">Gestiona el personal y revisa su desempeño</p>
        </div>

        <button
          onClick={() => { resetFormEmpleado(); setMostrarFormEmpleado(!mostrarFormEmpleado); }}
          className={`px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all active:scale-[0.97] ${
            mostrarFormEmpleado
              ? 'bg-[var(--surface-linen)] text-[var(--carbon)] border border-[var(--border-fiber)]'
              : 'bg-[var(--accent-copper)] hover:bg-[var(--accent-copper-bright)] text-[#1a1a2e] shadow-[0_2px_8px_rgba(212,160,18,0.3)]'
          }`}
        >
          {mostrarFormEmpleado ? 'Cancelar' : <><Plus size={20} /> Nuevo Empleado</>}
        </button>
      </div>

      {/* Employee form */}
      {mostrarFormEmpleado && (
        <form onSubmit={guardarEmpleado} className="card-premium-static p-6 rounded-2xl mb-8 animate-fade-up">
          <h2 className="text-lg font-bold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>
            {empleadoEditando ? 'Editar Empleado' : 'Agregar Empleado'}
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5" style={{ fontFamily: 'var(--font-heading)' }}>Nombre Completo</label>
              <input type="text" className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle} value={nombre} onChange={e=>setNombre(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5" style={{ fontFamily: 'var(--font-heading)' }}>Documento de Identidad</label>
              <input type="text" className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle} value={documento} onChange={e=>setDocumento(e.target.value)} pattern="[0-9]+" title="Solo se permiten números" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5" style={{ fontFamily: 'var(--font-heading)' }}>Cargo / Rol</label>
              <select className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle} value={cargo} onChange={(e) => setCargo(e.target.value)} required>
                <option value="">Seleccione un cargo…</option>
                {cargos.filter((c) => c.activa !== false).map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5" style={{ fontFamily: 'var(--font-heading)' }}>Teléfono</label>
              <input type="tel" className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle} value={telefono} onChange={e=>setTelefono(e.target.value)} pattern="[0-9+\- ]{7,15}" title="Entre 7 y 15 caracteres" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5" style={{ fontFamily: 'var(--font-heading)' }}>Correo Electrónico</label>
              <input type="email" className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle} value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5" style={{ fontFamily: 'var(--font-heading)' }}>Fecha de Ingreso</label>
              <input type="date" className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle} value={fechaIngreso} onChange={e=>setFechaIngreso(e.target.value)} max={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5" style={{ fontFamily: 'var(--font-heading)' }}>Estado</label>
              <select className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle} value={estado} onChange={e=>setEstado(e.target.value as 'Activo'|'Inactivo')}>
                <option value="Activo">Activo trabajando</option>
                <option value="Inactivo">Inactivo / Retirado</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full md:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-[#1a1a2e] active:scale-[0.97] transition-all" style={{ background: 'var(--accent-copper)', boxShadow: 'var(--shadow-copper)' }}>
            Guardar Empleado
          </button>
        </form>
      )}

      {/* Employee list */}
      <div className="grid gap-4">
        {empleados.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border-2 border-dashed text-slate-400" style={{ background: 'var(--surface-silk)', borderColor: 'var(--border-fiber)' }}>
            <p className="text-base font-medium" style={{ color: 'var(--carbon)' }}>No hay empleados registrados aún.</p>
          </div>
        ) : (
          empleados.map(emp => (
            <div key={emp.id} className="card-premium-static rounded-2xl overflow-hidden">

              {/* Employee card header */}
              <div className="p-5 md:p-6 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between" style={{ borderBottom: '1px solid var(--border-fiber-light)' }}>
                <div className="flex items-center gap-4">
                  {/* Avatar placeholder */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold shrink-0"
                    style={{
                      background: emp.estado === 'Activo' ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'var(--surface-linen)',
                      color: emp.estado === 'Activo' ? '#fff' : 'var(--carbon)',
                    }}
                  >
                    {emp.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>{emp.nombre}</h3>
                      <span className={`status-dot ${emp.estado === 'Activo' ? 'status-dot-active' : 'status-dot-neutral'}`} title={emp.estado} />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">{emp.cargo?.nombre || 'Sin cargo'}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'var(--surface-linen)', color: 'var(--carbon)', border: '1px solid var(--border-fiber)' }}>
                        C.C. {emp.documento}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'var(--surface-linen)', color: 'var(--carbon)', border: '1px solid var(--border-fiber)' }}>
                        📞 {emp.telefono || 'Sin teléfono'}
                      </span>
                      {emp.email && (
                        <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'var(--surface-linen)', color: 'var(--carbon)', border: '1px solid var(--border-fiber)' }}>
                          📧 {emp.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <button
                    onClick={() => abrirCalificacion(emp.id)}
                    className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.97] border ${
                      empleadoCalificando === emp.id
                        ? 'bg-amber-50 border-amber-400 text-amber-800'
                        : 'border-[var(--accent-copper)] text-[var(--accent-copper)] bg-white hover:bg-[var(--accent-copper-glow)]'
                    }`}
                  >
                    <ClipboardList size={16} /> Evaluar
                  </button>
                  <button
                    onClick={() => abrirHistorial(emp.id)}
                    className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.97] border ${
                      empleadoViendoHistorial === emp.id
                        ? 'bg-blue-50 border-blue-400 text-blue-800'
                        : 'border-blue-300 text-blue-600 bg-white hover:bg-blue-50'
                    }`}
                  >
                    <History size={16} /> Historial
                  </button>
                  <button onClick={() => iniciarEdicion(emp)} className="p-2.5 rounded-xl transition-all active:scale-[0.97] hover:bg-[var(--surface-linen)]" style={{ border: '1px solid var(--border-fiber)' }}>
                    <Edit2 size={16} className="text-slate-500" />
                  </button>
                  {tieneRol('SUPERADMINISTRADOR') && (
                    <button onClick={() => { if(window.confirm('¿Seguro que deseas eliminar este empleado?')) eliminarEmpleado(emp.id); }} className="p-2.5 rounded-xl transition-all active:scale-[0.97] bg-rose-50 hover:bg-rose-100 border border-rose-200">
                      <Trash2 size={16} className="text-rose-500" />
                    </button>
                  )}
                </div>
              </div>

              {/* History panel */}
              {empleadoViendoHistorial === emp.id && (
                <div className="p-5 animate-fade-up" style={{ background: 'var(--surface-linen)' }}>
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>
                    <History size={16} className="text-blue-600" /> Historial de Rendimiento
                  </h4>

                  {getRegistrosEmpleado(emp.id).length === 0 ? (
                    <p className="text-slate-500 bg-white p-4 rounded-xl text-center text-sm" style={{ border: '1px solid var(--border-fiber)' }}>
                      No hay registros guardados para este empleado.
                    </p>
                  ) : (
                    <div className="grid gap-2.5">
                      {getRegistrosEmpleado(emp.id).map(reg => (
                        <div key={reg.id} className="bg-white p-4 rounded-xl flex flex-col gap-3" style={{ border: '1px solid var(--border-fiber)' }}>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="font-bold text-xs px-3 py-1.5 rounded-lg text-blue-800" style={{ background: 'rgba(37,99,235,0.08)' }}>
                                {reg.fecha}
                              </div>
                              {reg.horaEntrada !== '--:--' ? (
                                <div className="text-slate-500 text-xs font-medium flex items-center gap-1">
                                  <Clock size={14} /> {reg.horaEntrada} - {reg.horaSalida}
                                </div>
                              ) : (
                                <span className="text-rose-600 font-semibold text-xs bg-rose-50 px-2 py-1 rounded-lg">No Asistió</span>
                              )}
                            </div>

                            {reg.horaEntrada !== '--:--' && (
                              <div className="flex gap-4 shrink-0">
                                <div className="text-center">
                                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Totales</span>
                                  <span className="font-bold text-base" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>{reg.unidadesTotales}</span>
                                </div>
                                <div className="text-center">
                                  <span className="block text-[10px] text-emerald-600 font-semibold uppercase">Calidad</span>
                                  <span className="font-bold text-base text-emerald-600" style={{ fontFamily: 'var(--font-heading)' }}>{reg.unidadesBuenas}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {reg.horaEntrada !== '--:--' && (reg.producciones?.length ?? 0) > 0 && (
                            <div className="pt-2 space-y-1.5" style={{ borderTop: '1px solid var(--border-fiber-light)' }}>
                              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                Órdenes vinculadas este día
                              </p>
                              {reg.producciones!.map((prod, index) => (
                                <div
                                  key={`${reg.id}-p-${index}`}
                                  className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between rounded-lg px-3 py-2 text-xs"
                                  style={{ background: 'var(--surface-linen)', border: '1px solid var(--border-fiber-light)' }}
                                >
                                  <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                                    <span className="font-bold text-slate-500 shrink-0">#{index + 1}</span>
                                    <span className="truncate font-medium" style={{ color: 'var(--carbon)' }} title={etiquetaOrden(prod.productoId)}>
                                      {etiquetaOrden(prod.productoId)}
                                      {prod.pasoId ? ` · ${etiquetaPaso(prod.productoId, prod.pasoId)}` : ''}
                                    </span>
                                    <span className="text-slate-500 sm:ml-auto">
                                      <span className="font-semibold">{prod.unidadesTotales}</span> conf. ·{' '}
                                      <span className="font-semibold text-emerald-700">{prod.unidadesBuenas}</span>{' '}
                                      calidad
                                    </span>
                                  </div>
                                  <div className="flex gap-1.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setModalOrdenProduccion({ fecha: reg.fecha, indice: index, item: prod })}
                                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-semibold text-blue-700 hover:bg-blue-50 border border-blue-200 bg-white"
                                    >
                                      <FileText size={12} /> Ver
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => cargarRegistroParaEdicion(reg)}
                                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-semibold border bg-white"
                                      style={{ color: 'var(--accent-copper)', borderColor: 'rgba(212,160,18,0.3)' }}
                                    >
                                      <Edit2 size={12} /> Editar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => { if (window.confirm('¿Eliminar esta evaluación?')) eliminarRegistro(reg.id); }}
                                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-rose-600"
                                    >
                                      <Trash2 size={12} /> Eliminar
                                    </button>
                                  </div>
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

              {/* Evaluation form */}
              {empleadoCalificando === emp.id && (
                <form onSubmit={guardarCalificacion} className="p-5 animate-fade-up" style={{ background: 'rgba(212,160,18,0.04)' }}>
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>
                    <Star size={16} style={{ color: 'var(--accent-copper)' }} />
                    {registroEditando ? 'Editar evaluación' : 'Registrar trabajo de hoy'}
                  </h4>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                    <div className="flex flex-col gap-1.5">
                      <label className="block text-xs font-medium text-slate-500" style={{ fontFamily: 'var(--font-heading)' }}>Fecha del registro</label>
                      <input type="date" value={calificacionFecha} onChange={e=>setCalificacionFecha(e.target.value)} className="w-full bg-white rounded-xl px-3 py-2.5 text-sm" style={{ border: '1px solid var(--border-fiber)' }} required max={new Date().toISOString().split('T')[0]} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="block text-xs font-medium text-slate-500" style={{ fontFamily: 'var(--font-heading)' }}>¿Asistió a trabajar?</label>
                      <button
                        type="button"
                        onClick={() => setCalificacionAsistencia(!calificacionAsistencia)}
                        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border-2 transition-colors ${calificacionAsistencia ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-rose-50 border-rose-400 text-rose-700'}`}
                      >
                        {calificacionAsistencia ? <><CheckCircle2 size={18} /> Sí asistió</> : 'Faltó hoy'}
                      </button>
                    </div>

                    {calificacionAsistencia && (
                      <div className="lg:col-span-2 grid grid-cols-2 gap-4 bg-white p-4 rounded-2xl" style={{ border: '1px solid var(--border-fiber)' }}>
                        <div className="col-span-2 pb-3 mb-1" style={{ borderBottom: '1px solid var(--border-fiber-light)' }}>
                          <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">⏱️ Horario</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-medium text-slate-400 mb-1">Entrada</label>
                              <input type="time" value={calificacionHoraEntrada} onChange={e=>setCalificacionHoraEntrada(e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm" style={inputStyle} required />
                            </div>
                            <div>
                              <label className="block text-[10px] font-medium text-slate-400 mb-1">Salida</label>
                              <input type="time" value={calificacionHoraSalida} onChange={e=>setCalificacionHoraSalida(e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm" style={inputStyle} required />
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2 pt-1">
                          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">✂️ Vincular a orden</p>
                            <button
                              type="button"
                              onClick={agregarProduccion}
                              disabled={productos.length === 0}
                              className="rounded-lg px-3 py-1.5 text-[10px] font-semibold disabled:opacity-50 transition-colors"
                              style={{ color: 'var(--accent-copper)', border: '1px solid rgba(212,160,18,0.25)', background: 'rgba(212,160,18,0.06)' }}
                            >
                              + Agregar otra orden
                            </button>
                          </div>
                          {productos.length === 0 ? (
                            <p className="rounded-xl px-4 py-3 text-xs" style={{ background: 'var(--surface-linen)', border: '1px solid var(--border-fiber)', color: 'var(--carbon)' }}>
                              No hay órdenes en Producción. Crea una orden allí primero.
                            </p>
                          ) : (
                          <div className="space-y-2.5">
                            {calificacionProducciones.map((prod, index) => {
                              const clavesOtros = calificacionProducciones
                                .filter((_, i) => i !== index)
                                .map((p) => `${p.productoId}:${p.pasoId}`)
                                .filter((k) => k !== ':');
                              const ordenSel = productos.find((p) => p.id === prod.productoId);
                              const pasosOrden = (ordenSel?.pasos ?? []).filter((ps) => ps.id);
                              const disponible = prod.productoId && prod.pasoId
                                ? unidadesDisponiblesPaso(prod.productoId, prod.pasoId, registroEditando ?? undefined)
                                : null;
                              return (
                              <div key={`prod-${index}`} className="rounded-xl p-3" style={{ background: 'var(--surface-linen)', border: '1px solid var(--border-fiber-light)' }}>
                                <div className="mb-2 flex items-center justify-between">
                                  <p className="text-[10px] font-semibold uppercase text-slate-500">Línea {index + 1}</p>
                                  <button
                                    type="button"
                                    onClick={() => quitarProduccion(index)}
                                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-500 disabled:opacity-40"
                                    disabled={calificacionProducciones.length === 1}
                                  >
                                    <MinusCircle size={12} /> Quitar
                                  </button>
                                </div>
                                <div className="space-y-2.5">
                                  <div>
                                    <label className="mb-1 block text-[10px] font-medium text-slate-400">Orden de producción</label>
                                    <select
                                      value={prod.productoId}
                                      onChange={(e) => {
                                        actualizarProduccion(index, 'productoId', e.target.value);
                                        actualizarProduccion(index, 'pasoId', '');
                                      }}
                                      required
                                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium"
                                      style={{ border: '1px solid var(--border-fiber)' }}
                                    >
                                      <option value="">Selecciona una orden…</option>
                                      {productos.map((p) => (
                                        <option key={p.id} value={p.id}>
                                          {p.nombre} — {p.empresa} ({p.estado}, meta {p.cantidad} u.)
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="mb-1 block text-[10px] font-medium text-slate-400">Acción de la orden</label>
                                    {prod.productoId && pasosOrden.length === 0 && (
                                      <p className="mb-2 text-[10px] text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5">
                                        Esta orden no tiene acciones. Edítala en Producción.
                                      </p>
                                    )}
                                    <select
                                      value={prod.pasoId}
                                      onChange={(e) => actualizarProduccion(index, 'pasoId', e.target.value)}
                                      required
                                      disabled={!prod.productoId || pasosOrden.length === 0}
                                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium disabled:opacity-50"
                                      style={{ border: '1px solid var(--border-fiber)' }}
                                    >
                                      <option value="">Selecciona la acción…</option>
                                      {pasosOrden.map((ps, pi) => {
                                        const pasoKey = ps.id || `paso-${pi}`;
                                        const clave = `${prod.productoId}:${pasoKey}`;
                                        const ocupada = clavesOtros.includes(clave);
                                        if (!ps.id) return null;
                                        if (ocupada && ps.id !== prod.pasoId) return null;
                                        return (
                                          <option key={pasoKey} value={ps.id}>
                                            {ps.descripcion}
                                          </option>
                                        );
                                      })}
                                    </select>
                                    {disponible != null && prod.pasoId && (
                                      <p className="mt-1 text-[10px]" style={{ color: 'var(--accent-copper)' }}>
                                        Disponibles: <strong>{disponible}</strong> de {ordenSel?.cantidad ?? 0}
                                      </p>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-2.5">
                                    <div className="flex flex-col">
                                      <label className="mb-1 block text-[10px] font-medium text-slate-400">Confeccionadas</label>
                                      <input
                                        type="number"
                                        min={0}
                                        max={disponible ?? undefined}
                                        value={prod.unidadesTotales || ''}
                                        onChange={(e) => actualizarProduccion(index, 'unidadesTotales', Number(e.target.value))}
                                        required
                                        className="w-full rounded-xl bg-white px-3 py-2 text-sm font-bold"
                                        style={{ border: '1px solid var(--border-fiber)' }}
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <label className="mb-1 block text-[10px] font-medium text-emerald-600">Calidad</label>
                                      <input
                                        type="number"
                                        min={0}
                                        value={prod.unidadesBuenas || ''}
                                        onChange={(e) => actualizarProduccion(index, 'unidadesBuenas', Number(e.target.value))}
                                        required
                                        className="w-full rounded-xl bg-emerald-50/50 px-3 py-2 text-sm font-bold text-emerald-700"
                                        style={{ border: '1px solid rgba(22,163,74,0.2)' }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                            })}
                          </div>
                          )}
                          <div className="mt-3 rounded-xl bg-white px-4 py-3 grid grid-cols-2 gap-4 text-xs" style={{ border: '1px solid var(--border-fiber)' }}>
                            <p className="text-slate-600">
                              Total confeccionadas:{' '}
                              <span className="font-bold" style={{ color: 'var(--carbon)' }}>
                                {calificacionProducciones.reduce((acc, p) => acc + Number(p.unidadesTotales || 0), 0)}
                              </span>
                            </p>
                            <p className="text-emerald-700">
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

                  <div className="mt-5 flex justify-end gap-2">
                    {(registroEditando || empleadoCalificando) && (
                      <button
                        type="button"
                        onClick={cancelarCalificacion}
                        className="px-5 py-2.5 rounded-xl font-semibold text-sm"
                        style={{ border: '1px solid var(--border-fiber)', color: 'var(--carbon)' }}
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      type="submit"
                      className="w-full md:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm text-[#1a1a2e] active:scale-[0.97] transition-all"
                      style={{ background: 'var(--accent-copper)', boxShadow: 'var(--shadow-copper)' }}
                    >
                      {registroEditando ? 'Actualizar evaluación' : 'Guardar evaluación'}
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
