import React, { useState } from 'react';
import { useAppContext, CatalogoItem, Empresa } from '../context/AppContext';
import { Settings, Plus, Trash2, Edit2 } from 'lucide-react';

type Tab = 'accionesProduccion' | 'cargos' | 'areas' | 'accionesAseo' | 'empresas';

export const Configuracion = () => {
  const {
    accionesProduccion,
    cargos,
    areasTrabajo,
    accionesAseo,
    empresas,
    productos,
    agregarAccionProduccion,
    editarAccionProduccion,
    eliminarAccionProduccion,
    agregarCargo,
    editarCargo,
    eliminarCargo,
    agregarArea,
    editarArea,
    eliminarArea,
    agregarAccionAseo,
    editarAccionAseo,
    eliminarAccionAseo,
    agregarEmpresa,
    editarEmpresa,
    eliminarEmpresa,
  } = useAppContext();

  const [tab, setTab] = useState<Tab>('accionesProduccion');
  const [nombre, setNombre] = useState('');
  const [secuencia, setSecuencia] = useState('');
  const [editando, setEditando] = useState<string | null>(null);
  const [empresaForm, setEmpresaForm] = useState<Omit<Empresa, 'id'>>({
    razonSocial: '',
    telefono: '',
    correo: '',
    direccion: '',
    estado: 'Sin ordenes',
  });
  const [empresaEditando, setEmpresaEditando] = useState<string | null>(null);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'accionesProduccion', label: 'Acciones producción' },
    { id: 'cargos', label: 'Cargos' },
    { id: 'areas', label: 'Áreas de trabajo' },
    { id: 'accionesAseo', label: 'Acciones de aseo' },
    { id: 'empresas', label: 'Empresas' },
  ];

  const listaActual = (): CatalogoItem[] => {
    switch (tab) {
      case 'accionesProduccion':
        return accionesProduccion;
      case 'cargos':
        return cargos;
      case 'areas':
        return areasTrabajo;
      case 'accionesAseo':
        return accionesAseo;
      case 'empresas':
        return [];
    }
  };

  const resetForm = () => {
    setNombre('');
    setSecuencia('');
    setEditando(null);
    setEmpresaForm({
      razonSocial: '',
      telefono: '',
      correo: '',
      direccion: '',
      estado: 'Sin ordenes',
    });
    setEmpresaEditando(null);
  };

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'empresas') {
      if (!empresaForm.razonSocial?.trim()) return alert('La razón social es obligatoria.');
      if (empresaEditando) {
        editarEmpresa(empresaEditando, { ...empresaForm, razonSocial: empresaForm.razonSocial.trim() });
      } else {
        agregarEmpresa({ ...empresaForm, razonSocial: empresaForm.razonSocial.trim() });
      }
      setEmpresaForm({
        razonSocial: '',
        telefono: '',
        correo: '',
        direccion: '',
        estado: 'Sin ordenes',
      });
      setEmpresaEditando(null);
      return;
    }

    if (!nombre.trim()) return alert('El nombre es obligatorio');

    if (editando) {
      if (editando.startsWith('tmp-')) {
        return alert('Este ítem aún se está guardando. Espera un momento.');
      }
      const actual = listaActual().find((i) => i.id === editando);
      if (!actual) {
        resetForm();
        return alert('El ítem ya no existe. Actualiza la página.');
      }

      const updates: Partial<CatalogoItem> = { nombre: nombre.trim() };
      if (tab === 'accionesProduccion') {
        updates.orden = secuencia ? Number(secuencia) : actual.orden;
      }

      switch (tab) {
        case 'accionesProduccion':
          editarAccionProduccion(editando, updates);
          break;
        case 'cargos':
          editarCargo(editando, updates);
          break;
        case 'areas':
          editarArea(editando, updates);
          break;
        case 'accionesAseo':
          editarAccionAseo(editando, updates);
          break;
      }
    } else {
      const nuevo: Omit<CatalogoItem, 'id'> = {
        nombre: nombre.trim(),
        activa: true,
      };
      if (tab === 'accionesProduccion') {
        nuevo.orden = secuencia ? Number(secuencia) : listaActual().length + 1;
      }

      switch (tab) {
        case 'accionesProduccion':
          agregarAccionProduccion(nuevo);
          break;
        case 'cargos':
          agregarCargo(nuevo);
          break;
        case 'areas':
          agregarArea(nuevo);
          break;
        case 'accionesAseo':
          agregarAccionAseo(nuevo);
          break;
      }
    }
    resetForm();
  };

  const iniciarEdicion = (item: CatalogoItem) => {
    if (tab === 'empresas') return;
    if (item.id.startsWith('tmp-')) {
      return alert('Espera a que termine de guardarse este ítem.');
    }
    setEditando(item.id);
    setNombre(item.nombre);
    setSecuencia(item.orden != null ? String(item.orden) : '');
  };

  const eliminar = (id: string) => {
    if (tab === 'empresas') {
      if (!window.confirm('¿Eliminar esta empresa?')) return;
      eliminarEmpresa(id);
      if (empresaEditando === id) {
        setEmpresaEditando(null);
        setEmpresaForm({
          razonSocial: '',
          telefono: '',
          correo: '',
          direccion: '',
          estado: 'Sin ordenes',
        });
      }
      return;
    }

    if (id.startsWith('tmp-')) return;
    if (!window.confirm('¿Eliminar este ítem del catálogo?')) return;
    switch (tab) {
      case 'accionesProduccion':
        eliminarAccionProduccion(id);
        break;
      case 'cargos':
        eliminarCargo(id);
        break;
      case 'areas':
        eliminarArea(id);
        break;
      case 'accionesAseo':
        eliminarAccionAseo(id);
        break;
    }
    if (editando === id) resetForm();
  };

  const iniciarEdicionEmpresa = (empresa: Empresa) => {
    if (empresa.id.startsWith('tmp-')) {
      return alert('Espera a que termine de guardarse esta empresa.');
    }
    setEmpresaEditando(empresa.id);
    setEmpresaForm({
      razonSocial: empresa.razonSocial ?? '',
      telefono: empresa.telefono ?? '',
      correo: empresa.correo ?? '',
      direccion: empresa.direccion ?? '',
      estado: empresa.estado ?? 'Sin ordenes',
    });
  };

  const pendientesEmpresa = (razonSocial: string) =>
    productos.filter((p) => p.empresa === razonSocial && p.estado !== 'Terminado').length;

  return (
    <div className="animate-in fade-in duration-300">
      <h1 className="text-3xl font-extrabold text-teal-900 flex items-center gap-3 mb-2">
        Configuración <Settings className="text-slate-500" />
      </h1>
      <p className="text-slate-500 mb-6">
        Catálogos maestros. Aquí también puedes gestionar empresas y revisar sus órdenes pendientes.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id);
              resetForm();
            }}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
              tab === t.id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={guardar} className="bg-white p-5 rounded-2xl border border-slate-200 mb-6 flex flex-wrap gap-3 items-end">
        {tab === 'empresas' ? (
          <>
            <div className="flex-1 min-w-[220px]">
              <label className="block text-sm font-semibold text-slate-600 mb-1">Razón social</label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2"
                value={empresaForm.razonSocial ?? ''}
                onChange={(e) => setEmpresaForm((p) => ({ ...p, razonSocial: e.target.value }))}
                required
              />
            </div>
            <div className="min-w-[160px]">
              <label className="block text-sm font-semibold text-slate-600 mb-1">Teléfono</label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2"
                value={empresaForm.telefono ?? ''}
                onChange={(e) => setEmpresaForm((p) => ({ ...p, telefono: e.target.value }))}
              />
            </div>
            <div className="min-w-[220px]">
              <label className="block text-sm font-semibold text-slate-600 mb-1">Correo</label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2"
                value={empresaForm.correo ?? ''}
                onChange={(e) => setEmpresaForm((p) => ({ ...p, correo: e.target.value }))}
              />
            </div>
            <div className="min-w-[220px]">
              <label className="block text-sm font-semibold text-slate-600 mb-1">Dirección</label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2"
                value={empresaForm.direccion ?? ''}
                onChange={(e) => setEmpresaForm((p) => ({ ...p, direccion: e.target.value }))}
              />
            </div>
            <div className="min-w-[180px]">
              <label className="block text-sm font-semibold text-slate-600 mb-1">Estado</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2"
                value={empresaForm.estado ?? 'Sin ordenes'}
                onChange={(e) => setEmpresaForm((p) => ({ ...p, estado: e.target.value }))}
              >
                <option value="Sin ordenes">Sin ordenes</option>
                <option value="Ordenes pendientes">Ordenes pendientes</option>
                <option value="Inactiva">Inactiva</option>
              </select>
            </div>
          </>
        ) : (
          <>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-slate-600 mb-1">Nombre</label>
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        {tab === 'accionesProduccion' && (
          <div className="w-28">
            <label className="block text-sm font-semibold text-slate-600 mb-1" title="Orden en que aparecen al asignarlas a una orden (1, 2, 3…)">
              Secuencia
            </label>
            <input
              type="number"
              min={1}
              placeholder="1"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2"
              value={secuencia}
              onChange={(e) => setSecuencia(e.target.value)}
            />
          </div>
        )}
          </>
        )}
        <button type="submit" className="bg-teal-600 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2">
          {editando || empresaEditando ? (
            <>
              <Edit2 size={18} /> Actualizar
            </>
          ) : (
            <>
              <Plus size={18} /> Agregar
            </>
          )}
        </button>
        {(editando || empresaEditando) && (
          <button type="button" onClick={resetForm} className="text-slate-500 px-3 py-2">
            Cancelar
          </button>
        )}
      </form>

      <ul className="space-y-2">
        {tab !== 'empresas' && listaActual().length === 0 ? (
          <li className="text-center py-8 text-slate-500 bg-white rounded-2xl border border-dashed">
            Sin ítems en este catálogo
          </li>
        ) : tab === 'empresas' ? (
          empresas.map((item) => {
            const pendientes = pendientesEmpresa(item.razonSocial);
            return (
              <li
                key={item.id}
                className={`bg-white border rounded-xl px-4 py-3 flex items-center justify-between ${
                  empresaEditando === item.id ? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-200'
                }`}
              >
                <div>
                  <p className="font-semibold text-slate-800">{item.razonSocial}</p>
                  <p className="text-xs text-slate-500">
                    {item.telefono || 'Sin teléfono'} · {item.correo || 'Sin correo'}
                  </p>
                  <p className="text-xs text-slate-500">{item.direccion || 'Sin dirección'}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Estado: {item.estado || 'Sin ordenes'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${pendientes > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'}`}>
                      Pendientes: {pendientes}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => iniciarEdicionEmpresa(item)}
                    disabled={item.id.startsWith('tmp-')}
                    className="p-2 bg-slate-100 rounded-lg text-slate-600 disabled:opacity-40"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminar(item.id)}
                    disabled={item.id.startsWith('tmp-')}
                    className="p-2 bg-red-50 rounded-lg text-red-600 disabled:opacity-40"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            );
          })
        ) : (
          [...listaActual()]
            .sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999) || a.nombre.localeCompare(b.nombre))
            .map((item) => (
              <li
                key={item.id}
                className={`bg-white border rounded-xl px-4 py-3 flex items-center justify-between ${
                  editando === item.id ? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-200'
                }`}
              >
                <span className="font-semibold text-slate-800">
                  {item.nombre}
                  {item.orden != null && tab === 'accionesProduccion' && (
                    <span className="text-slate-400 font-normal ml-2">(paso {item.orden})</span>
                  )}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => iniciarEdicion(item)}
                    disabled={item.id.startsWith('tmp-')}
                    className="p-2 bg-slate-100 rounded-lg text-slate-600 disabled:opacity-40"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminar(item.id)}
                    disabled={item.id.startsWith('tmp-')}
                    className="p-2 bg-red-50 rounded-lg text-red-600 disabled:opacity-40"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))
        )}
      </ul>
    </div>
  );
};
