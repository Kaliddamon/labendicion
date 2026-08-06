import React, { useEffect, useState } from 'react';
import { Mail, MailOpen, Check, Trash2, Clock } from 'lucide-react';
import { Paginador } from '../components/Paginador';

interface ContactoMensaje {
  id: number;
  usuarioEmail: string;
  usuarioNombre: string;
  asunto: string;
  mensaje: string;
  fecha: string;
  leido: boolean;
}

export const MensajesContacto = () => {
  const [mensajes, setMensajes] = useState<ContactoMensaje[]>([]);
  const [cargando, setCargando] = useState(true);

  const fromEnv = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const API_BASE = fromEnv && fromEnv.trim() !== '' ? `${fromEnv.trim()}/api/frontend` : '/api/frontend';

  const cargarMensajes = async () => {
    try {
      const res = await fetch(`${API_BASE}/contacto-mensajes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setMensajes(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMensajes();
  }, []);

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;
  const totalPaginas = Math.ceil(mensajes.length / itemsPorPagina);
  const mensajesPaginados = mensajes.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  useEffect(() => {
    setPaginaActual(1);
  }, [mensajes.length]);

  const toggleLeido = async (id: number, actual: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/contacto-mensajes/${id}/leido`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ leido: !actual })
      });
      if (res.ok) {
        setMensajes(prev => prev.map(m => m.id === id ? { ...m, leido: !actual } : m));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (cargando) {
    return <div className="p-8 text-center text-slate-500">Cargando mensajes...</div>;
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'var(--accent-copper)' }} />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400" style={{ fontFamily: 'var(--font-heading)' }}>
            Administración
          </span>
        </div>
        <h1
          className="text-3xl font-bold flex items-center gap-3"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}
        >
          Mensajes de Contacto
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
            <Mail size={18} className="text-blue-600" />
          </div>
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm">
          Solicitudes de usuarios que aún no tienen rol asignado.
        </p>
      </div>

      <div className="grid gap-4">
        {cargando ? (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 text-slate-400" style={{ background: 'var(--surface-silk)', borderColor: 'var(--border-fiber)' }}>
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 animate-spin" style={{ borderTopColor: 'var(--accent-copper)' }}></div>
            <p className="text-base font-medium" style={{ color: 'var(--carbon)' }}>Cargando mensajes...</p>
          </div>
        ) : mensajes.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border-2 border-dashed text-slate-400" style={{ background: 'var(--surface-silk)', borderColor: 'var(--border-fiber)' }}>
            <p className="text-base font-medium" style={{ color: 'var(--carbon)' }}>Bandeja vacía</p>
            <p className="text-xs mt-1">No hay mensajes de contacto por el momento.</p>
          </div>
        ) : (
          mensajesPaginados.map((msg) => (
            <div key={msg.id} className={`card-premium-static p-5 rounded-2xl flex flex-col md:flex-row gap-4 justify-between transition-all ${!msg.leido ? 'border-l-4 border-blue-500 bg-blue-50/20' : ''}`}>
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center mt-1" style={{ background: msg.leido ? 'var(--surface-linen)' : '#dbeafe', color: msg.leido ? 'var(--carbon)' : '#2563eb' }}>
                  {msg.leido ? <MailOpen size={18} /> : <Mail size={18} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>{msg.usuarioNombre}</h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-white" style={{ border: '1px solid var(--border-fiber)', color: 'var(--carbon)' }}>
                      {msg.usuarioEmail}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mt-2 mb-1">{msg.asunto}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{msg.mensaje}</p>
                  <div className="flex items-center gap-1 mt-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    <Clock size={12} /> {new Date(msg.fecha).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex md:flex-col justify-end gap-2 shrink-0">
                <button
                  onClick={() => toggleLeido(msg.id, msg.leido)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${msg.leido ? 'bg-white text-slate-500 hover:bg-slate-50' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
                  style={{ borderColor: msg.leido ? 'var(--border-fiber)' : undefined }}
                >
                  <Check size={14} /> {msg.leido ? 'Marcar como no leído' : 'Marcar como leído'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {totalPaginas > 1 && (
        <Paginador
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          cambiarPagina={setPaginaActual}
        />
      )}
    </div>
  );
};
