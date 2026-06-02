import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';

// === MODELOS (Entidades) ===

export interface PasoProducto {
  id?: string;
  accionProduccionId?: string;
  descripcion: string;
  orden: number;
  completado?: boolean;
}

export interface Producto {
  id: string;
  nombre: string;
  cantidad: number;
  empresa: string;
  ganancia: number;
  fechaAsignacion: string;
  fechaTerminacion: string;
  estado: 'Pendiente' | 'En proceso' | 'Terminado';
  pasos?: PasoProducto[];
}

export interface CatalogoItem {
  id: string;
  nombre: string;
  activa?: boolean;
  orden?: number;
  descripcion?: string;
}

export interface Empleado {
  id: string;
  nombre: string;
  cargo: string;
  documento: string;
  telefono: string;
  fechaIngreso: string;
  estado: 'Activo' | 'Inactivo';
}

export interface Empresa {
  id: string;
  razonSocial: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  estado?: string; // Sin ordenes, Ordenes pendientes, Inactiva
}

export interface RegistroDiario {
  id: string;
  empleadoId: string;
  fecha: string;
  horaEntrada: string;
  horaSalida: string;
  unidadesTotales: number;
  unidadesBuenas: number; // Reemplaza la calificación 1-5 por número entero
  producciones?: ProduccionRegistro[];
}

/** Aporte del empleado vinculado a una orden y acción (paso) de producción. */
export interface ProduccionRegistro {
  productoId: string;
  pasoId: string;
  unidadesTotales: number;
  unidadesBuenas: number;
}

export interface RegistroAseoEntry {
  id: string;
  empleadoId: string;
  empleadoNombre: string;
  acciones: string[];
  areas: string[];
  completada: boolean;
}

export interface RegistroAseo {
  id: string;
  fecha: string;
  entries: RegistroAseoEntry[];
}

interface BootstrapResponse {
  productos: Producto[];
  empleados: Empleado[];
  registros: RegistroDiario[];
  registrosAseo: RegistroAseo[];
  accionesProduccion?: CatalogoItem[];
  cargos?: CatalogoItem[];
  areasTrabajo?: CatalogoItem[];
  accionesAseo?: CatalogoItem[];
}

// === TIPO DEL CONTEXTO ===

interface AppContextType {
  // Productos (Producción)
  productos: Producto[];
  agregarProducto: (prod: Omit<Producto, 'id'>) => void;
  editarProducto: (id: string, prod: Partial<Producto>) => void;
  eliminarProducto: (id: string) => void;

  // Empleados
  empleados: Empleado[];
  agregarEmpleado: (emp: Omit<Empleado, 'id'>) => void;
  editarEmpleado: (id: string, emp: Partial<Empleado>) => void;
  eliminarEmpleado: (id: string) => void;

  // Registros de Empleados (evaluaciones)
  registros: RegistroDiario[];
  agregarRegistro: (reg: Omit<RegistroDiario, 'id'>) => Promise<void>;
  editarRegistro: (id: string, reg: Partial<RegistroDiario>) => Promise<void>;
  eliminarRegistro: (id: string) => void;
  unidadesDisponiblesPaso: (productoId: string, pasoId: string, excluirRegistroId?: string) => number;

  // Catálogos
  accionesProduccion: CatalogoItem[];
  cargos: CatalogoItem[];
  areasTrabajo: CatalogoItem[];
  accionesAseo: CatalogoItem[];
  agregarAccionProduccion: (item: Omit<CatalogoItem, 'id'>) => void;
  editarAccionProduccion: (id: string, item: Partial<CatalogoItem>) => void;
  eliminarAccionProduccion: (id: string) => void;
  agregarCargo: (item: Omit<CatalogoItem, 'id'>) => void;
  editarCargo: (id: string, item: Partial<CatalogoItem>) => void;
  eliminarCargo: (id: string) => void;
  agregarArea: (item: Omit<CatalogoItem, 'id'>) => void;
  editarArea: (id: string, item: Partial<CatalogoItem>) => void;
  eliminarArea: (id: string) => void;
  agregarAccionAseo: (item: Omit<CatalogoItem, 'id'>) => void;
  editarAccionAseo: (id: string, item: Partial<CatalogoItem>) => void;
  eliminarAccionAseo: (id: string) => void;

  cambiarEstadoProducto: (id: string, estado: Producto['estado']) => void;

   // Registros de Aseo
   registrosAseo: RegistroAseo[];
   crearRegistroAseo: (payload?: object) => void;
   toggleRegistroAseoEntry: (registroId: string, entryId: string) => void;
   actualizarRegistroAseoEntry: (registroId: string, entryId: string, acciones: string[], areas: string[]) => void;
   eliminarRegistroAseo: (id: string) => void;

  // Empresas
  empresas: Empresa[];
  agregarEmpresa: (emp: Omit<Empresa, 'id'>) => void;
  editarEmpresa: (id: string, emp: Partial<Empresa>) => void;
  eliminarEmpresa: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/** En dev, Vite reenvía /api → backend (vite.config). En prod, define VITE_API_BASE_URL al desplegar el API. */
const fromEnv = import.meta.env.VITE_API_BASE_URL as string | undefined;
const API_BASE = fromEnv && fromEnv.trim() !== '' ? `${fromEnv.trim()}/api/frontend` : '/api/frontend';

const request = async <T,>(path: string, options?: RequestInit): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`API ${res.status}: ${text || 'Error desconocido'}`);
    throw new Error(`API ${res.status}: ${text || 'Error desconocido'}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // === ESTADOS (Base de datos simulada) ===

  const [productos, setProductos] = useState<Producto[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [registros, setRegistros] = useState<RegistroDiario[]>([]);
  const [registrosAseo, setRegistrosAseo] = useState<RegistroAseo[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [accionesProduccion, setAccionesProduccion] = useState<CatalogoItem[]>([]);
  const [cargos, setCargos] = useState<CatalogoItem[]>([]);
  const [areasTrabajo, setAreasTrabajo] = useState<CatalogoItem[]>([]);
  const [accionesAseo, setAccionesAseo] = useState<CatalogoItem[]>([]);

   useEffect(() => {
     let mounted = true;
     request<BootstrapResponse>('/bootstrap')
       .then((data) => {
         if (!mounted) return;
         setProductos(data.productos ?? []);
         setEmpleados(data.empleados ?? []);
          setRegistros(data.registros ?? []);
          setRegistrosAseo((data as any).registrosAseo ?? []);
         setEmpresas((data as any).empresas ?? []);
         const filtrarCatalogo = (items?: CatalogoItem[]) =>
           (items ?? []).filter((c) => c.id && c.id.trim() !== '' && !c.id.startsWith('tmp-'));
         setAccionesProduccion(filtrarCatalogo(data.accionesProduccion));
         setCargos(filtrarCatalogo(data.cargos));
         setAreasTrabajo(filtrarCatalogo(data.areasTrabajo));
         setAccionesAseo(filtrarCatalogo(data.accionesAseo));
         console.log('Bootstrap cargado:', data.productos);
       })
       .catch((err) => {
         console.warn('No se pudo cargar bootstrap del backend:', err);
       });
     return () => {
       mounted = false;
     };
   }, []);

  // === FUNCIONES CRUD ===

  // Producción
   const agregarProducto = (prod: Omit<Producto, 'id'>) => {
     // Optimistic create: insert a temporary product immediately
     const tmpId = `tmp-prod-${Date.now()}`;
     const tmpProd: Producto = { id: tmpId, pasos: prod.pasos ?? [], ...prod } as Producto;
     setProductos((prev) => [tmpProd, ...prev]);

     request<Producto>('/productos', {
       method: 'POST',
       body: JSON.stringify(prod),
     })
       .then((nuevo) => {
         if (!nuevo || !nuevo.id) {
           // Replace temp with server response (if any) or remove
           setProductos((prev) => prev.filter((p) => p.id !== tmpId));
           return;
         }
         // Fetch pasos and replace tmp
         request<any[]>(`/productos/${nuevo.id}/pasos`)
           .then((pasos) => {
             nuevo.pasos = pasos;
             setProductos((prev) => prev.map((p) => (p.id === tmpId ? nuevo : p)));
           })
           .catch(() => {
             // If pasos fail, still replace the tmp with producto basic
             setProductos((prev) => prev.map((p) => (p.id === tmpId ? nuevo : p)));
           });
       })
       .catch((err) => {
         console.error('Error creando producto (revirtiendo):', err);
         setProductos((prev) => prev.filter((p) => p.id !== tmpId));
       });
   };
  const editarProducto = (id: string, prod: Partial<Producto>) => {
    const actual = productos.find((p) => p.id === id);
    if (!actual) return;
    const snapshot = { ...actual };
    const payload = { ...actual, ...prod };

    // Optimistic apply
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, ...prod } : p)));

    request<Producto>(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
      .then((actualizado) => {
        setProductos((prev) => prev.map((p) => (p.id === id ? actualizado : p)));
      })
      .catch((err) => {
        console.error('Error editando producto (revirtiendo):', err);
        // Revert
        setProductos((prev) => prev.map((p) => (p.id === id ? snapshot : p)));
      });
  };
  const cambiarEstadoProducto = (id: string, estado: Producto['estado']) => {
    const actual = productos.find((p) => p.id === id);
    if (!actual) return;
    const snapshot = { ...actual };
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, estado } : p)));
    request<Producto>(`/productos/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    })
      .then((actualizado) => setProductos((prev) => prev.map((p) => (p.id === id ? actualizado : p))))
      .catch((err) => {
        console.error('Error cambiando estado (revirtiendo):', err);
        setProductos((prev) => prev.map((p) => (p.id === id ? snapshot : p)));
      });
  };

  const eliminarProducto = (id: string) => {
    const snapshotProductos = [...productos];
    const snapshotRegistros = [...registros];

    // Optimistic removal
    setProductos((prev) => prev.filter((p) => p.id !== id));
    setRegistros((prev) =>
      prev.map((r) => ({ ...r, producciones: (r.producciones ?? []).filter((p) => p.productoId !== id) }))
    );

    request<void>(`/productos/${id}`, { method: 'DELETE' }).catch((err) => {
      console.error('Error eliminando producto (revirtiendo):', err);
      setProductos(snapshotProductos);
      setRegistros(snapshotRegistros);
    });
  };

  // Empleados
  const agregarEmpleado = (emp: Omit<Empleado, 'id'>) => {
    const tmpId = `tmp-emp-${Date.now()}`;
    const tmpEmp: Empleado = { id: tmpId, fechaIngreso: new Date().toISOString(), estado: 'Activo', ...emp } as Empleado;
    setEmpleados((prev) => [tmpEmp, ...prev]);

    request<Empleado>('/empleados', {
      method: 'POST',
      body: JSON.stringify(emp),
    })
      .then((nuevo) => {
        setEmpleados((prev) => prev.map((e) => (e.id === tmpId ? nuevo : e)));
      })
      .catch((err) => {
        console.error('Error creando empleado (revirtiendo):', err);
        setEmpleados((prev) => prev.filter((e) => e.id !== tmpId));
      });
  };
  const editarEmpleado = (id: string, emp: Partial<Empleado>) => {
    const actual = empleados.find((e) => e.id === id);
    if (!actual) return;
    const snapshot = { ...actual };
    const payload = { ...actual, ...emp };

    setEmpleados((prev) => prev.map((e) => (e.id === id ? { ...e, ...emp } : e)));

    request<Empleado>(`/empleados/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
      .then((actualizado) => setEmpleados((prev) => prev.map((e) => (e.id === id ? actualizado : e))))
      .catch((err) => {
        console.error('Error editando empleado (revirtiendo):', err);
        setEmpleados((prev) => prev.map((e) => (e.id === id ? snapshot : e)));
      });
  };
  const eliminarEmpleado = (id: string) => {
    // Snapshot current state so we can revert on failure
    const snapshotEmpleados = [...empleados];

    // Optimistic update: reflect the soft deletion immediately in the UI
    setEmpleados((prev) => prev.map((e) => (e.id === id ? { ...e, estado: 'Inactivo' } : e)));

    // Perform the server request; if it fails, revert the optimistic update
    request<void>(`/empleados/${id}`, { method: 'DELETE' })
      .catch((err) => {
        console.error('Error eliminando empleado (revirtiendo estado):', err);
        // Revert to previous snapshots
        setEmpleados(snapshotEmpleados);
      });
  };

  const unidadesDisponiblesPaso = (productoId: string, pasoId: string, excluirRegistroId?: string) => {
    const producto = productos.find((p) => p.id === productoId);
    if (!producto) return 0;
    const meta = producto.cantidad ?? 0;
    let usado = 0;
    for (const r of registros) {
      if (excluirRegistroId && r.id === excluirRegistroId) continue;
      for (const p of r.producciones ?? []) {
        if (p.productoId === productoId && p.pasoId === pasoId) {
          usado += Number(p.unidadesTotales || 0);
        }
      }
    }
    return Math.max(0, meta - usado);
  };

  const agregarRegistro = async (reg: Omit<RegistroDiario, 'id'>) => {
    const tmpId = `tmp-reg-${Date.now()}`;
    const tmpReg: RegistroDiario = { id: tmpId, ...reg } as RegistroDiario;
    setRegistros((prev) => [tmpReg, ...prev]);

    try {
      const nuevo = await request<RegistroDiario>('/registros', {
        method: 'POST',
        body: JSON.stringify(reg),
      });
      setRegistros((prev) => prev.map((r) => (r.id === tmpId ? nuevo : r)));
    } catch (err) {
      console.error('Error creando registro (revirtiendo):', err);
      setRegistros((prev) => prev.filter((r) => r.id !== tmpId));
      throw err;
    }
  };

  const editarRegistro = async (id: string, reg: Partial<RegistroDiario>) => {
    const actual = registros.find((r) => r.id === id);
    if (!actual) return;
    const snapshot = { ...actual };
    const payload = { ...actual, ...reg };
    setRegistros((prev) => prev.map((r) => (r.id === id ? { ...r, ...reg } : r)));

    try {
      const actualizado = await request<RegistroDiario>(`/registros/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setRegistros((prev) => prev.map((r) => (r.id === id ? actualizado : r)));
    } catch (err) {
      console.error('Error editando registro (revirtiendo):', err);
      setRegistros((prev) => prev.map((r) => (r.id === id ? snapshot : r)));
      throw err;
    }
  };

  const eliminarRegistro = (id: string) => {
    const snapshot = [...registros];
    setRegistros((prev) => prev.filter((r) => r.id !== id));
    request<void>(`/registros/${id}`, { method: 'DELETE' }).catch((err) => {
      console.error('Error eliminando registro (revirtiendo):', err);
      setRegistros(snapshot);
    });
  };

  // Registros de Aseo
  const crearRegistroAseo = (payload?: object) => {
    const tmpId = `tmp-aseo-${Date.now()}`;
    const tmp: RegistroAseo = { id: tmpId, fecha: new Date().toISOString(), entries: [], ...(payload as any) } as RegistroAseo;
    setRegistrosAseo((prev) => [tmp, ...prev]);

    fetch(`${API_BASE}/registros-aseo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (res.status === 409 && data.registro) {
          setRegistrosAseo((prev) => {
            const sinDup = prev.filter((r) => r.id !== data.registro.id && r.id !== tmpId);
            return [data.registro, ...sinDup];
          });
          return;
        }
        if (!res.ok) throw new Error(data.mensaje || `API ${res.status}`);
        setRegistrosAseo((prev) => prev.map((r) => (r.id === tmpId ? data : r)));
      })
      .catch((err) => {
        console.error('Error creando registro de aseo (revirtiendo):', err);
        setRegistrosAseo((prev) => prev.filter((r) => r.id !== tmpId));
      });
  };

   const toggleRegistroAseoEntry = (registroId: string, entryId: string) => {
     // Optimistic toggle
     const snapshot = registrosAseo.map((r) => ({ ...r, entries: r.entries.map((e) => ({ ...e })) }));
     setRegistrosAseo((prev) =>
       prev.map((r) =>
         r.id !== registroId
           ? r
           : {
               ...r,
               entries: r.entries.map((e) => (e.id === entryId ? { ...e, completada: !e.completada } : e)),
             }
       )
     );

     request<RegistroAseo>(`/registros-aseo/${registroId}/entries/${entryId}/toggle`, {
       method: 'PATCH',
     })
       .then((actualizado) => setRegistrosAseo((prev) => prev.map((r) => (r.id === actualizado.id ? actualizado : r))))
       .catch((err) => {
         console.error('Error toggle registro aseo entry (revirtiendo):', err);
         setRegistrosAseo(snapshot);
       });
   };

    const actualizarRegistroAseoEntry = (registroId: string, entryId: string, acciones: string[], areas: string[]) => {
      const snapshot = registrosAseo.map((r) => ({ ...r, entries: r.entries.map((e) => ({ ...e })) }));

      setRegistrosAseo((prev) =>
        prev.map((r) =>
          r.id !== registroId
            ? r
            : {
                ...r,
                entries: r.entries.map((e) => (e.id === entryId ? { ...e, acciones: acciones, areas: areas } : e)),
              }
        )
      );

      request<RegistroAseo>(`/registros-aseo/${registroId}/entries/${entryId}`, {
        method: 'PATCH',
        body: JSON.stringify({ acciones, areas }),
      })
        .then((actualizado) => setRegistrosAseo((prev) => prev.map((r) => (r.id === actualizado.id ? actualizado : r))))
        .catch((err) => {
          console.error('Error actualizando acciones/areas de entry (revirtiendo):', err);
          setRegistrosAseo(snapshot);
        });
    };

   const eliminarRegistroAseo = (id: string) => {
     const snapshot = [...registrosAseo];
     setRegistrosAseo((prev) => prev.filter((r) => r.id !== id));
     request<void>(`/registros-aseo/${id}`, { method: 'DELETE' }).catch((err) => {
       console.error('Error eliminando registro de aseo (revirtiendo):', err);
       setRegistrosAseo(snapshot);
     });
   };

  // Empresas
  const agregarEmpresa = (emp: Omit<Empresa, 'id'>) => {
    const tmpId = `tmp-emp-${Date.now()}`;
    const tmp: Empresa = { id: tmpId, estado: 'Sin ordenes', ...emp } as Empresa;
    setEmpresas((prev) => [tmp, ...prev]);

    request<Empresa>('/empresas', {
      method: 'POST',
      body: JSON.stringify(emp),
    })
      .then((nuevo) => setEmpresas((prev) => prev.map((e) => (e.id === tmpId ? nuevo : e))))
      .catch((err) => {
        console.error('Error creando empresa (revirtiendo):', err);
        setEmpresas((prev) => prev.filter((e) => e.id !== tmpId));
      });
  };

  const editarEmpresa = (id: string, emp: Partial<Empresa>) => {
    const actual = empresas.find((e) => e.id === id);
    if (!actual) return;
    const snapshot = { ...actual };
    setEmpresas((prev) => prev.map((e) => (e.id === id ? { ...e, ...emp } : e)));

    const payload = { ...actual, ...emp };
    request<Empresa>(`/empresas/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
      .then((actualizado) => setEmpresas((prev) => prev.map((e) => (e.id === id ? actualizado : e))))
      .catch((err) => {
        console.error('Error editando empresa (revirtiendo):', err);
        setEmpresas((prev) => prev.map((e) => (e.id === id ? snapshot : e)));
      });
  };

  const eliminarEmpresa = (id: string) => {
    const snapshot = [...empresas];
    setEmpresas((prev) => prev.filter((e) => e.id !== id));
    request<void>(`/empresas/${id}`, { method: 'DELETE' }).catch((err) => {
      console.error('Error eliminando empresa (revirtiendo):', err);
      setEmpresas(snapshot);
    });
  };

  const buildCatalogBody = (item: Partial<CatalogoItem>) => {
    const body: Record<string, unknown> = {};
    if (item.nombre != null) body.nombre = item.nombre;
    if (item.activa != null) body.activa = item.activa;
    if (item.orden != null) body.orden = item.orden;
    if (item.descripcion != null) body.descripcion = item.descripcion;
    return body;
  };

  const makeCatalogCrud = (
    path: string,
    setter: React.Dispatch<React.SetStateAction<CatalogoItem[]>>
  ) => ({
    add: (item: Omit<CatalogoItem, 'id'>) => {
      const tmpId = `tmp-cat-${Date.now()}`;
      setter((prev) => [...prev, { id: tmpId, activa: true, ...item }]);
      request<CatalogoItem>(path, { method: 'POST', body: JSON.stringify(buildCatalogBody(item)) })
        .then((nuevo) => setter((prev) => prev.map((c) => (c.id === tmpId ? nuevo : c))))
        .catch(() => {
          setter((prev) => prev.filter((c) => c.id !== tmpId));
          alert('No se pudo guardar el ítem. Verifica que el backend esté en ejecución.');
        });
    },
    edit: (id: string, item: Partial<CatalogoItem>) => {
      if (!id || id.startsWith('tmp-')) {
        alert('Este ítem aún se está guardando. Espera un momento e intenta de nuevo.');
        return;
      }
      let snapshot: CatalogoItem | undefined;
      setter((prev) => {
        snapshot = prev.find((c) => c.id === id);
        return prev.map((c) => (c.id === id ? { ...c, ...item } : c));
      });
      request<CatalogoItem>(`${path}/${id}`, { method: 'PUT', body: JSON.stringify(buildCatalogBody(item)) })
        .then((nuevo) => setter((prev) => prev.map((c) => (c.id === id ? nuevo : c))))
        .catch(() => {
          if (snapshot) setter((prev) => prev.map((c) => (c.id === id ? snapshot! : c)));
          alert('No se pudo actualizar. Si el ítem es antiguo, elimínalo y créalo de nuevo.');
        });
    },
    remove: (id: string) => {
      if (!id || id.startsWith('tmp-')) return;
      let snapshot: CatalogoItem[] = [];
      setter((prev) => {
        snapshot = [...prev];
        return prev.filter((c) => c.id !== id);
      });
      request<void>(`${path}/${id}`, { method: 'DELETE' }).catch(() => setter(snapshot));
    },
  });

  const accionProdCrud = makeCatalogCrud('/acciones-produccion', setAccionesProduccion);
  const cargoCrud = makeCatalogCrud('/cargos', setCargos);
  const areaCrud = makeCatalogCrud('/areas-trabajo', setAreasTrabajo);
  const accionAseoCrud = makeCatalogCrud('/acciones-aseo', setAccionesAseo);

  const agregarAccionProduccion = accionProdCrud.add;
  const editarAccionProduccion = accionProdCrud.edit;
  const eliminarAccionProduccion = accionProdCrud.remove;
  const agregarCargo = cargoCrud.add;
  const editarCargo = cargoCrud.edit;
  const eliminarCargo = cargoCrud.remove;
  const agregarArea = areaCrud.add;
  const editarArea = areaCrud.edit;
  const eliminarArea = areaCrud.remove;
  const agregarAccionAseo = accionAseoCrud.add;
  const editarAccionAseo = accionAseoCrud.edit;
  const eliminarAccionAseo = accionAseoCrud.remove;

   return (
     <AppContext.Provider value={{
       productos, agregarProducto, editarProducto, eliminarProducto,
       empleados, agregarEmpleado, editarEmpleado, eliminarEmpleado,
       registros, agregarRegistro, editarRegistro, eliminarRegistro, unidadesDisponiblesPaso,
       registrosAseo, crearRegistroAseo, toggleRegistroAseoEntry, actualizarRegistroAseoEntry, eliminarRegistroAseo,
       empresas, agregarEmpresa, editarEmpresa, eliminarEmpresa,
       accionesProduccion, cargos, areasTrabajo, accionesAseo,
       agregarAccionProduccion, editarAccionProduccion, eliminarAccionProduccion,
       agregarCargo, editarCargo, eliminarCargo,
       agregarArea, editarArea, eliminarArea,
       agregarAccionAseo, editarAccionAseo, eliminarAccionAseo,
       cambiarEstadoProducto
     }}>
       {children}
     </AppContext.Provider>
   );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext debe usarse dentro de un AppProvider');
  return context;
};
