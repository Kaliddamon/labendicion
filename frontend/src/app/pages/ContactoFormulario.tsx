import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Send, Edit2, Trash2, CheckCircle2, Clock } from 'lucide-react';

interface MiMensaje {
  id: number;
  asunto: string;
  mensaje: string;
  fecha: string;
  leido: boolean;
}

export const ContactoFormulario = () => {
  const { user } = useAuth();
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [miMensaje, setMiMensaje] = useState<MiMensaje | null>(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fromEnv = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const API_BASE = fromEnv && fromEnv.trim() !== '' ? `${fromEnv.trim()}/api/frontend` : '/api/frontend';

  const cargarMiMensaje = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`${API_BASE}/contacto-mensajes/mi-mensaje?email=${encodeURIComponent(user.email)}`);
      if (res.status === 200) {
        const data = await res.json();
        setMiMensaje(data);
      } else {
        setMiMensaje(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMiMensaje();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim() || !asunto.trim() || mensaje.length > 200) return;

    setEnviando(true);
    setErrorMsg('');
    try {
      const url = miMensaje && editando 
        ? `${API_BASE}/contacto-mensajes/${miMensaje.id}`
        : `${API_BASE}/contacto-mensajes`;
      
      const method = miMensaje && editando ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioEmail: user?.email,
          usuarioNombre: user?.name,
          asunto: asunto,
          mensaje: mensaje
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMiMensaje(data);
        setEditando(false);
      } else {
        const errText = await res.text();
        setErrorMsg(errText || 'Ocurrió un error al enviar el mensaje.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error de conexión.');
    } finally {
      setEnviando(false);
    }
  };

  const handleDelete = async () => {
    if (!miMensaje) return;
    if (!window.confirm('¿Estás seguro de eliminar tu mensaje de contacto?')) return;
    
    try {
      const res = await fetch(`${API_BASE}/contacto-mensajes/${miMensaje.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMiMensaje(null);
        setAsunto('');
        setMensaje('');
        setEditando(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error al eliminar.');
    }
  };

  const iniciarEdicion = () => {
    if (miMensaje) {
      setAsunto(miMensaje.asunto);
      setMensaje(miMensaje.mensaje);
      setEditando(true);
    }
  };

  if (cargando) {
    return <div className="flex items-center justify-center min-h-[60vh] text-slate-500">Cargando...</div>;
  }

  // Vista de Lectura
  if (miMensaje && !editando) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-up">
        <div className="card-premium-static p-8 rounded-2xl max-w-lg w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: miMensaje.leido ? 'var(--surface-linen)' : '#dbeafe', color: miMensaje.leido ? 'var(--carbon)' : '#2563eb' }}>
                {miMensaje.leido ? <CheckCircle2 size={20} /> : <Mail size={20} />}
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>Tu Mensaje</h2>
                <p className="text-xs text-slate-500">{miMensaje.leido ? 'Ya fue revisado' : 'Pendiente de revisión'}</p>
              </div>
            </div>
            {!miMensaje.leido && (
              <div className="flex gap-2">
                <button onClick={iniciarEdicion} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Editar mensaje">
                  <Edit2 size={18} />
                </button>
                <button onClick={handleDelete} className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors" title="Eliminar mensaje">
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
          
          <div className="p-4 rounded-xl mb-4" style={{ background: 'var(--surface-linen)', border: '1px solid var(--border-fiber)' }}>
            <h4 className="font-bold text-sm mb-2" style={{ color: 'var(--carbon)' }}>{miMensaje.asunto}</h4>
            <p className="text-sm text-slate-600 leading-relaxed break-words">{miMensaje.mensaje}</p>
            <div className="flex items-center gap-1 mt-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              <Clock size={12} /> Enviado: {new Date(miMensaje.fecha).toLocaleString()}
            </div>
          </div>
          
          {miMensaje.leido && (
            <p className="text-xs text-center text-slate-500 mt-4">Un administrador ya leyó tu mensaje. Pronto se pondrán en contacto contigo.</p>
          )}
        </div>
      </div>
    );
  }

  // Vista de Formulario (Creación o Edición)
  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-up">
      <div className="card-premium-static p-8 rounded-2xl max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Mail size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>
              {editando ? 'Editar Mensaje' : 'Contacto'}
            </h2>
            <p className="text-xs text-slate-500">{editando ? 'Modifica tu solicitud' : 'Aún no tienes un rol asignado'}</p>
          </div>
        </div>
        
        {!editando && (
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Hola <strong>{user?.name}</strong>. Actualmente tu cuenta no tiene permisos para acceder a las secciones del sistema. Por favor, envía un mensaje al administrador para solicitar acceso.
          </p>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5" style={{ fontFamily: 'var(--font-heading)' }}>Asunto</label>
            <input 
              type="text"
              value={asunto}
              onChange={e => setAsunto(e.target.value)}
              maxLength={100}
              className="w-full rounded-xl px-4 py-2.5 text-sm"
              style={{ background: 'var(--surface-linen)', border: '1px solid var(--border-fiber)' }}
              placeholder="Ej. Solicitud de acceso"
              required
            />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-500" style={{ fontFamily: 'var(--font-heading)' }}>Tu Mensaje</label>
              <span className={`text-[10px] font-bold ${mensaje.length > 200 ? 'text-rose-500' : 'text-slate-400'}`}>
                {mensaje.length}/200
              </span>
            </div>
            <textarea 
              rows={4}
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              maxLength={200}
              className={`w-full rounded-xl px-4 py-3 text-sm resize-none transition-colors ${mensaje.length >= 200 ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200' : ''}`}
              style={{ background: 'var(--surface-linen)', border: mensaje.length >= 200 ? '1px solid #fda4af' : '1px solid var(--border-fiber)' }}
              placeholder="Ej. Hola, acabo de registrarme. Por favor asígname mi rol en el sistema."
              required
            />
          </div>
          
          <div className="flex gap-3 mt-2">
            {editando && (
              <button 
                type="button"
                onClick={() => setEditando(false)}
                className="px-6 py-3 rounded-xl font-semibold text-sm w-1/3 transition-all active:scale-[0.97]"
                style={{ background: 'var(--surface-linen)', border: '1px solid var(--border-fiber)' }}
              >
                Cancelar
              </button>
            )}
            <button 
              type="submit"
              disabled={enviando || !mensaje.trim() || !asunto.trim() || mensaje.length > 200}
              className={`px-6 py-3 rounded-xl font-semibold text-sm ${editando ? 'w-2/3' : 'w-full'} flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-50`}
              style={{ background: 'var(--accent-copper)', boxShadow: 'var(--shadow-copper)', color: '#1a1a2e' }}
            >
              {enviando ? 'Guardando...' : <><Send size={18} /> {editando ? 'Guardar Cambios' : 'Enviar Mensaje'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
