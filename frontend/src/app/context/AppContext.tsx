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

export interface TareaAseo {
  id: string;
  accion: string; // Ej. Barrer, Trapear...
  area: string;   // Ej. Sala, Cocina...
  encargado: string;
  completada: boolean;
}

interface BootstrapResponse {
  productos: Producto[];
  empleados: Empleado[];
  registros: RegistroDiario[];
  tareasAseo: TareaAseo[];
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

  // Aseo
  tareasAseo: TareaAseo[];
  agregarTareaAseo: (tarea: Omit<TareaAseo, 'id'>) => void;
  editarTareaAseo: (id: string, tarea: Partial<TareaAseo>) => void;
  toggleTareaAseo: (id: string) => void;
  eliminarTareaAseo: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/frontend';

const request = async <T,>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
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
  const [tareasAseo, setTareasAseo] = useState<TareaAseo[]>([]);

  useEffect(() => {
    let mounted = true;
    request<BootstrapResponse>('/bootstrap')
      .then((data) => {
        if (!mounted) return;
        setProductos(data.productos ?? []);
        setEmpleados(data.empleados ?? []);
        setRegistros(data.registros ?? []);
        setTareasAseo(data.tareasAseo ?? []);
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
    request<Producto>('/productos', {
      method: 'POST',
      body: JSON.stringify(prod),
    })
      .then((nuevo) => {
        setProductos((prev) => [nuevo, ...prev]);
      })
      .catch((err) => console.error('Error creando producto:', err));
  };
  const editarProducto = (id: string, prod: Partial<Producto>) => {
    const actual = productos.find((p) => p.id === id);
    if (!actual) return;
    const payload = { ...actual, ...prod };
    request<Producto>(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
      .then((actualizado) => {
        setProductos((prev) => prev.map((p) => (p.id === id ? actualizado : p)));
      })
      .catch((err) => console.error('Error editando producto:', err));
  };
  const eliminarProducto = (id: string) => {
    request<void>(`/productos/${id}`, { method: 'DELETE' })
      .then(() => {
        setProductos((prev) => prev.filter((p) => p.id !== id));
        setRegistros((prev) =>
          prev.map((r) => ({
            ...r,
            producciones: (r.producciones ?? []).filter((p) => p.productoId !== id),
          }))
        );
      })
      .catch((err) => console.error('Error eliminando producto:', err));
  };

  // Empleados
  const agregarEmpleado = (emp: Omit<Empleado, 'id'>) => {
    request<Empleado>('/empleados', {
      method: 'POST',
      body: JSON.stringify(emp),
    })
      .then((nuevo) => {
        setEmpleados((prev) => [nuevo, ...prev]);
      })
      .catch((err) => console.error('Error creando empleado:', err));
  };
  const editarEmpleado = (id: string, emp: Partial<Empleado>) => {
    const actual = empleados.find((e) => e.id === id);
    if (!actual) return;
    const payload = { ...actual, ...emp };
    request<Empleado>(`/empleados/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
      .then((actualizado) => {
        setEmpleados((prev) => prev.map((e) => (e.id === id ? actualizado : e)));
      })
      .catch((err) => console.error('Error editando empleado:', err));
  };
  const eliminarEmpleado = (id: string) => {
    request<void>(`/empleados/${id}`, { method: 'DELETE' })
      .then(() => {
        setEmpleados((prev) => prev.filter((e) => e.id !== id));
        setRegistros((prev) => prev.filter((r) => r.empleadoId !== id));
      })
      .catch((err) => console.error('Error eliminando empleado:', err));
  };

  // Registros
  const agregarRegistro = (reg: Omit<RegistroDiario, 'id'>) => {
    request<RegistroDiario>('/registros', {
      method: 'POST',
      body: JSON.stringify(reg),
    })
      .then((nuevo) => {
        setRegistros((prev) => [nuevo, ...prev]);
      })
      .catch((err) => console.error('Error creando registro:', err));
  };
  const eliminarRegistro = (id: string) => {
    request<void>(`/registros/${id}`, { method: 'DELETE' })
      .then(() => {
        setRegistros((prev) => prev.filter((r) => r.id !== id));
      })
      .catch((err) => console.error('Error eliminando registro:', err));
  };

  // Aseo
  const agregarTareaAseo = (tarea: Omit<TareaAseo, 'id'>) => {
    request<TareaAseo>('/tareas-aseo', {
      method: 'POST',
      body: JSON.stringify(tarea),
    })
      .then((nueva) => {
        setTareasAseo((prev) => [nueva, ...prev]);
      })
      .catch((err) => console.error('Error creando tarea de aseo:', err));
  };
  const editarTareaAseo = (id: string, tarea: Partial<TareaAseo>) => {
    const actual = tareasAseo.find((t) => t.id === id);
    if (!actual) return;
    const payload = { ...actual, ...tarea };
    request<TareaAseo>(`/tareas-aseo/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
      .then((actualizada) => {
        setTareasAseo((prev) => prev.map((t) => (t.id === id ? actualizada : t)));
      })
      .catch((err) => console.error('Error editando tarea de aseo:', err));
  };
  const toggleTareaAseo = (id: string) => {
    request<TareaAseo>(`/tareas-aseo/${id}/toggle`, {
      method: 'PATCH',
    })
      .then((actualizada) => {
        setTareasAseo((prev) => prev.map((t) => (t.id === id ? actualizada : t)));
      })
      .catch((err) => console.error('Error cambiando estado de tarea:', err));
  };
  const eliminarTareaAseo = (id: string) => {
    request<void>(`/tareas-aseo/${id}`, { method: 'DELETE' })
      .then(() => {
        setTareasAseo((prev) => prev.filter((t) => t.id !== id));
      })
      .catch((err) => console.error('Error eliminando tarea de aseo:', err));
  };

  return (
    <AppContext.Provider value={{
      productos, agregarProducto, editarProducto, eliminarProducto,
      empleados, agregarEmpleado, editarEmpleado, eliminarEmpleado,
      registros, agregarRegistro, eliminarRegistro,
      tareasAseo, agregarTareaAseo, editarTareaAseo, toggleTareaAseo, eliminarTareaAseo
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
