import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

export const ContactoFormulario = () => {
  const { user } = useAuth();
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const fromEnv = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const API_BASE = fromEnv && fromEnv.trim() !== '' ? `${fromEnv.trim()}/api/frontend` : '/api/frontend';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    setEnviando(true);
    try {
      const res = await fetch(`${API_BASE}/contacto-mensajes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuarioEmail: user?.email,
          usuarioNombre: user?.name,
          mensaje: mensaje
        })
      });

      if (res.ok) {
        setEnviado(true);
        setMensaje('');
      } else {
        alert('Ocurrió un error al enviar el mensaje. Intenta nuevamente.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión.');
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-up">
        <div className="card-premium-static p-8 rounded-2xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>Mensaje Enviado</h2>
          <p className="text-slate-500 mb-6">Hemos recibido tu mensaje. Un administrador lo revisará y se pondrá en contacto pronto.</p>
          <button 
            onClick={() => setEnviado(false)}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm w-full transition-all active:scale-[0.97]"
            style={{ border: '1px solid var(--border-fiber)', color: 'var(--carbon)', background: 'var(--surface-linen)' }}
          >
            Enviar otro mensaje
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-up">
      <div className="card-premium-static p-8 rounded-2xl max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Mail size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--carbon)' }}>Contacto</h2>
            <p className="text-xs text-slate-500">Aún no tienes un rol asignado</p>
          </div>
        </div>
        
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Hola <strong>{user?.name}</strong>. Actualmente tu cuenta no tiene permisos para acceder a las secciones del sistema. Por favor, envía un mensaje al administrador para solicitar acceso.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5" style={{ fontFamily: 'var(--font-heading)' }}>Tu Mensaje</label>
            <textarea 
              rows={4}
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm resize-none"
              style={{ background: 'var(--surface-linen)', border: '1px solid var(--border-fiber)' }}
              placeholder="Ej. Hola, acabo de registrarme. Por favor asígname mi rol en el sistema."
              required
            />
          </div>
          <button 
            type="submit"
            disabled={enviando || !mensaje.trim()}
            className="px-6 py-3 rounded-xl font-semibold text-sm w-full flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-50"
            style={{ background: 'var(--accent-copper)', boxShadow: 'var(--shadow-copper)', color: '#1a1a2e' }}
          >
            {enviando ? 'Enviando...' : <><Send size={18} /> Enviar Mensaje</>}
          </button>
        </form>
      </div>
    </div>
  );
};
