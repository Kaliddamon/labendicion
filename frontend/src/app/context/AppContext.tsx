import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';

// === MODELOS (Entidades) ===

export interface Producto {
  id: string;
  nombre: string;
  cantidad: number;
  empresa: string;
  ganancia: number;
  fechaAsignacion: string;
  fechaTerminacion: string;
  estado: 'Pendiente' | 'En proceso' | 'Terminado';
  pasos?: { descripcion: string; orden: number; completado?: boolean }[];
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

/** Aporte del empleado vinculado a una orden creada en Producción (`Producto`). */
export interface ProduccionRegistro {
  productoId: string;
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

  // Registros de Empleados
  registros: RegistroDiario[];
  agregarRegistro: (reg: Omit<RegistroDiario, 'id'>) => void;
  eliminarRegistro: (id: string) => void;

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
    const snapshotRegistros = [...registros];

    // Optimistic update: reflect the deletion immediately in the UI
    setEmpleados((prev) => prev.filter((e) => e.id !== id));
    setRegistros((prev) => prev.filter((r) => r.empleadoId !== id));

    // Perform the server request; if it fails, revert the optimistic update
    request<void>(`/empleados/${id}`, { method: 'DELETE' })
      .catch((err) => {
        console.error('Error eliminando empleado (revirtiendo estado):', err);
        // Revert to previous snapshots
        setEmpleados(snapshotEmpleados);
        setRegistros(snapshotRegistros);
      });
  };

  // Registros
  const agregarRegistro = (reg: Omit<RegistroDiario, 'id'>) => {
    const tmpId = `tmp-reg-${Date.now()}`;
    const tmpReg: RegistroDiario = { id: tmpId, ...reg } as RegistroDiario;
    setRegistros((prev) => [tmpReg, ...prev]);

    request<RegistroDiario>('/registros', {
      method: 'POST',
      body: JSON.stringify(reg),
    })
      .then((nuevo) => setRegistros((prev) => prev.map((r) => (r.id === tmpId ? nuevo : r))))
      .catch((err) => {
        console.error('Error creando registro (revirtiendo):', err);
        setRegistros((prev) => prev.filter((r) => r.id !== tmpId));
      });
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

    request<RegistroAseo>('/registros-aseo', {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    })
      .then((nuevo) => setRegistrosAseo((prev) => prev.map((r) => (r.id === tmpId ? nuevo : r))))
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

   return (
     <AppContext.Provider value={{
       productos, agregarProducto, editarProducto, eliminarProducto,
       empleados, agregarEmpleado, editarEmpleado, eliminarEmpleado,
       registros, agregarRegistro, eliminarRegistro,
       registrosAseo, crearRegistroAseo, toggleRegistroAseoEntry, actualizarRegistroAseoEntry, eliminarRegistroAseo,
       empresas, agregarEmpresa, editarEmpresa, eliminarEmpresa
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
