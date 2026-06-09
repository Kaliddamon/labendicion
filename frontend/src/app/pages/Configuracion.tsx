import React, { useState, useEffect } from 'react';
import { useAppContext, CatalogoItem, Empresa } from '../context/AppContext';
import { Settings, Plus, Edit2, Trash2, Search, X, Check, CheckCircle2, Shield, AlertCircle, Eye, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirm } from '../context/ConfirmContext';
import { GestionarRoles } from '../components/GestionarRoles';
import { Paginador } from '../components/Paginador';

type Tab = 'accionesProduccion' | 'cargos' | 'areas' | 'accionesAseo' | 'empresas' | 'roles';

export const Configuracion = () => {
  const {
    accionesProduccion, cargos, areasTrabajo, accionesAseo, empresas, productos,
    agregarAccionProduccion, editarAccionProduccion, eliminarAccionProduccion,
    agregarCargo, editarCargo, eliminarCargo,
    agregarArea, editarArea, eliminarArea,
    agregarAccionAseo, editarAccionAseo, eliminarAccionAseo,
    agregarEmpresa, editarEmpresa, eliminarEmpresa,
  } = useAppContext();

  const [tab, setTab] = useState<Tab>('accionesProduccion');
  const [nombre, setNombre] = useState('');
  const [secuencia, setSecuencia] = useState('');
  const [editando, setEditando] = useState<string | null>(null);
  const { confirm } = useConfirm();
  const [empresaForm, setEmpresaForm] = useState<Omit<Empresa, 'id'>>({
    razonSocial: '', telefono: '', correo: '', direccion: '', estado: 'Sin ordenes',
  });
  const [empresaEditando, setEmpresaEditando] = useState<string | null>(null);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'accionesProduccion', label: 'Acciones producción' },
    { id: 'cargos', label: 'Cargos' },
    { id: 'areas', label: 'Áreas de trabajo' },
    { id: 'accionesAseo', label: 'Acciones de aseo' },
    { id: 'empresas', label: 'Empresas' },
    { id: 'roles', label: 'Gestión de roles' },
  ];

  const listaActual = (): CatalogoItem[] => {
    switch (tab) {
      case 'accionesProduccion': return accionesProduccion;
      case 'cargos': return cargos;
      case 'areas': return areasTrabajo;
      case 'accionesAseo': return accionesAseo;
      case 'empresas': return [];
      case 'roles': return [];
    }
  };

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;
  
  const itemsActualesLength = tab === 'empresas' ? empresas.length : listaActual().length;
  const totalPaginas = Math.ceil(itemsActualesLength / itemsPorPagina);
  
  const empresasPaginadas = empresas.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);
  const catalogoPaginado = [...listaActual()]
    .sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999) || a.nombre.localeCompare(b.nombre))
    .slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  useEffect(() => {
    setPaginaActual(1);
  }, [tab, itemsActualesLength]);

  const resetForm = () => {
    setNombre(''); setSecuencia(''); setEditando(null);
    setEmpresaForm({ razonSocial: '', telefono: '', correo: '', direccion: '', estado: 'Sin ordenes' });
    setEmpresaEditando(null);
  };

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'empresas') {
      if (!empresaForm.razonSocial?.trim()) return toast.warning('La razón social es obligatoria.');
      if (empresaForm.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empresaForm.correo)) return toast.warning('El correo electrónico no tiene un formato válido.');
      if (empresaForm.telefono && !/^[0-9+\- ]{7,15}$/.test(empresaForm.telefono)) return toast.warning('El teléfono tiene un formato inválido.');
      if (empresaEditando) {
        editarEmpresa(empresaEditando, { ...empresaForm, razonSocial: empresaForm.razonSocial.trim() });
      } else {
        agregarEmpresa({ ...empresaForm, razonSocial: empresaForm.razonSocial.trim() });
      }
      setEmpresaForm({ razonSocial: '', telefono: '', correo: '', direccion: '', estado: 'Sin ordenes' });
      setEmpresaEditando(null);
      return;
    }

    if (!nombre.trim()) return toast.warning('El nombre es obligatorio');

    if (editando) {
      if (editando.startsWith('tmp-')) return toast.warning('Este ítem aún se está guardando.');
      const actual = listaActual().find((i) => i.id === editando);
      if (!actual) { resetForm(); return toast.warning('El ítem ya no existe.'); }

      const updates: Partial<CatalogoItem> = { nombre: nombre.trim() };

      switch (tab) {
        case 'accionesProduccion': editarAccionProduccion(editando, updates); break;
        case 'cargos': editarCargo(editando, updates); break;
        case 'areas': editarArea(editando, updates); break;
        case 'accionesAseo': editarAccionAseo(editando, updates); break;
      }
    } else {
      const nuevo: Omit<CatalogoItem, 'id'> = { nombre: nombre.trim(), activa: true };
      switch (tab) {
        case 'accionesProduccion': agregarAccionProduccion(nuevo); break;
        case 'cargos': agregarCargo(nuevo); break;
        case 'areas': agregarArea(nuevo); break;
        case 'accionesAseo': agregarAccionAseo(nuevo); break;
      }
    }
    resetForm();
  };

  const iniciarEdicion = (item: CatalogoItem) => {
    if (tab === 'empresas') return;
    if (item.id.startsWith('tmp-')) return toast.warning('Espera a que termine de guardarse.');
    setEditando(item.id);
    setNombre(item.nombre);
    setSecuencia(item.orden != null ? String(item.orden) : '');
  };

  const eliminar = async (id: string) => {
    if (tab === 'empresas') {
    if (!await confirm({ title: '¿Eliminar empresa?', description: '¿Eliminar esta empresa?', confirmText: 'Eliminar' })) return;
      eliminarEmpresa(id);
      if (empresaEditando === id) {
        setEmpresaEditando(null);
        setEmpresaForm({ razonSocial: '', telefono: '', correo: '', direccion: '', estado: 'Sin ordenes' });
      }
      return;
    }
    if (id.startsWith('tmp-')) return;
    if (!await confirm({ title: '¿Eliminar ítem?', description: '¿Eliminar este ítem del catálogo?', confirmText: 'Eliminar' })) return;
    switch (tab) {
      case 'accionesProduccion': eliminarAccionProduccion(id); break;
      case 'cargos': eliminarCargo(id); break;
      case 'areas': eliminarArea(id); break;
      case 'accionesAseo': eliminarAccionAseo(id); break;
    }
    if (editando === id) resetForm();
  };

  const iniciarEdicionEmpresa = (empresa: Empresa) => {
    if (empresa.id.startsWith('tmp-')) return toast.warning('Espera a que termine de guardarse.');
    setEmpresaEditando(empresa.id);
    setEmpresaForm({
      razonSocial: empresa.razonSocial ?? '', telefono: empresa.telefono ?? '',
      correo: empresa.correo ?? '', direccion: empresa.direccion ?? '',
      estado: empresa.estado ?? 'Sin ordenes',
    });
  };

  const pendientesEmpresa = (razonSocial: string) =>
    productos.filter((p) => p.empresa === razonSocial && p.estado !== 'Terminado').length;

  const inputStyle = {
    background: 'var(--surface-linen)',
    border: '1px solid var(--border-fiber)',
    color: 'var(--carbon)',
  };

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'var(--accent-copper)' }} />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400" style={{ fontFamily: 'var(--font-heading)' }}>
            Sistema
          </span>
        </div>
        <h1
          className="text-3xl font-bold flex items-center gap-3"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}
        >
          Configuración
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--surface-linen)' }}>
            <Settings size={18} className="text-slate-500" />
          </div>
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm">
          Catálogos maestros. Gestiona empresas y revisa sus órdenes pendientes.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6 p-1 rounded-xl" style={{ background: 'var(--surface-linen)' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => { setTab(t.id); resetForm(); }}
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
              tab === t.id
                ? 'text-[#1a1a2e] shadow-sm'
                : 'text-slate-500 hover:text-[var(--carbon)]'
            }`}
            style={tab === t.id ? { background: 'var(--accent-copper)' } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'roles' ? (
        <GestionarRoles />
      ) : (
        <>
          {/* Form */}
          <form onSubmit={guardar} className="card-premium-static p-5 rounded-2xl mb-6 flex flex-wrap gap-3 items-end">
        {tab === 'empresas' ? (
          <>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-slate-500 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Razón social</label>
              <input className="w-full rounded-xl px-4 py-2.5 text-sm" style={inputStyle} value={empresaForm.razonSocial ?? ''} onChange={(e) => setEmpresaForm((p) => ({ ...p, razonSocial: e.target.value }))} required />
            </div>
            <div className="min-w-[150px]">
              <label className="block text-xs font-medium text-slate-500 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Teléfono</label>
              <input type="tel" className="w-full rounded-xl px-4 py-2.5 text-sm" style={inputStyle} value={empresaForm.telefono ?? ''} onChange={(e) => setEmpresaForm((p) => ({ ...p, telefono: e.target.value }))} pattern="[0-9+\- ]{7,15}" title="7-15 caracteres" />
            </div>
            <div className="min-w-[200px]">
              <label className="block text-xs font-medium text-slate-500 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Correo</label>
              <input type="email" className="w-full rounded-xl px-4 py-2.5 text-sm" style={inputStyle} value={empresaForm.correo ?? ''} onChange={(e) => setEmpresaForm((p) => ({ ...p, correo: e.target.value }))} />
            </div>
            <div className="min-w-[200px]">
              <label className="block text-xs font-medium text-slate-500 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Dirección</label>
              <input className="w-full rounded-xl px-4 py-2.5 text-sm" style={inputStyle} value={empresaForm.direccion ?? ''} onChange={(e) => setEmpresaForm((p) => ({ ...p, direccion: e.target.value }))} />
            </div>
            <div className="min-w-[160px]">
              <label className="block text-xs font-medium text-slate-500 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Estado</label>
              <select className="w-full rounded-xl px-4 py-2.5 text-sm" style={inputStyle} value={empresaForm.estado ?? 'Sin ordenes'} onChange={(e) => setEmpresaForm((p) => ({ ...p, estado: e.target.value }))}>
                <option value="Sin ordenes">Sin ordenes</option>
                <option value="Ordenes pendientes">Ordenes pendientes</option>
                <option value="Inactiva">Inactiva</option>
              </select>
            </div>
          </>
        ) : (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Nombre</label>
            <input className="w-full rounded-xl px-4 py-2.5 text-sm" style={inputStyle} value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
        )}
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-[#1a1a2e] flex items-center gap-2 transition-all active:scale-[0.97]"
          style={{ background: 'var(--accent-copper)', boxShadow: 'var(--shadow-copper)' }}
        >
          {editando || empresaEditando ? <><Edit2 size={16} /> Actualizar</> : <><Plus size={16} /> Agregar</>}
        </button>
        {(editando || empresaEditando) && (
          <button type="button" onClick={resetForm} className="text-slate-500 px-3 py-2 text-sm font-medium">
            Cancelar
          </button>
        )}
      </form>

      {/* List */}
      <ul className="space-y-2">
        {tab !== 'empresas' && listaActual().length === 0 ? (
          <li className="text-center py-8 text-slate-400 rounded-2xl border-2 border-dashed text-sm" style={{ background: 'var(--surface-silk)', borderColor: 'var(--border-fiber)' }}>
            Sin ítems en este catálogo
          </li>
        ) : tab === 'empresas' ? (
          empresasPaginadas.map((item) => {
            const pendientes = pendientesEmpresa(item.razonSocial);
            return (
              <li
                key={item.id}
                className={`card-premium-static rounded-xl px-4 py-3 flex items-center justify-between ${
                  empresaEditando === item.id ? 'ring-2 ring-[var(--accent-copper-glow)]' : ''
                }`}
                style={empresaEditando === item.id ? { borderColor: 'var(--accent-copper)' } : {}}
              >
                <div>
                  <p className="font-semibold text-sm" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>{item.razonSocial}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {item.telefono || 'Sin teléfono'} · {item.correo || 'Sin correo'}
                  </p>
                  <p className="text-[11px] text-slate-500">{item.direccion || 'Sin dirección'}</p>
                  <div className="flex gap-2 mt-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-md" style={{ background: 'var(--surface-linen)', color: 'var(--carbon)' }}>
                      {item.estado || 'Sin ordenes'}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md ${pendientes > 0 ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-700'}`}>
                      Pendientes: {pendientes}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => iniciarEdicionEmpresa(item)} disabled={item.id.startsWith('tmp-')} className="p-2 rounded-lg transition-colors hover:bg-[var(--surface-linen)] disabled:opacity-40" style={{ border: '1px solid var(--border-fiber)' }}>
                    <Edit2 size={16} className="text-slate-500" />
                  </button>
                  <button type="button" onClick={() => eliminar(item.id)} disabled={item.id.startsWith('tmp-')} className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 disabled:opacity-40">
                    <Trash2 size={16} className="text-rose-500" />
                  </button>
                </div>
              </li>
            );
          })
        ) : (
          catalogoPaginado.map((item) => (
              <li
                key={item.id}
                className={`card-premium-static rounded-xl px-4 py-3 flex items-center justify-between ${
                  editando === item.id ? 'ring-2 ring-[var(--accent-copper-glow)]' : ''
                }`}
                style={editando === item.id ? { borderColor: 'var(--accent-copper)' } : {}}
              >
                <span className="font-medium text-sm" style={{ color: 'var(--carbon)' }}>
                  {item.nombre}
                </span>
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => iniciarEdicion(item)} disabled={item.id.startsWith('tmp-')} className="p-2 rounded-lg transition-colors hover:bg-[var(--surface-linen)] disabled:opacity-40" style={{ border: '1px solid var(--border-fiber)' }}>
                    <Edit2 size={16} className="text-slate-500" />
                  </button>
                  <button type="button" onClick={() => eliminar(item.id)} disabled={item.id.startsWith('tmp-')} className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 disabled:opacity-40">
                    <Trash2 size={16} className="text-rose-500" />
                  </button>
                </div>
              </li>
            ))
        )}
      </ul>
      {tab !== 'roles' && totalPaginas > 1 && (
        <Paginador
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          cambiarPagina={setPaginaActual}
        />
      )}
        </>
      )}
    </div>
  );
};
