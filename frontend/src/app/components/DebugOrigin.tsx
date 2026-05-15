import React from 'react';

export const DebugOrigin = () => {
  const currentOrigin = window.location.origin;
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port;

  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      background: '#1a1a1a',
      color: '#00ff00',
      padding: '15px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '400px',
      border: '2px solid #00ff00',
      boxShadow: '0 0 10px rgba(0,255,0,0.5)'
    }}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>🔍 DEBUG: Origin Actual</div>
      <div style={{ marginBottom: '5px' }}>
        <strong>window.location.origin:</strong><br/>
        <code style={{
          background: '#0a0a0a',
          padding: '5px',
          borderRadius: '4px',
          display: 'block',
          marginTop: '2px',
          wordBreak: 'break-all'
        }}>
          {currentOrigin}
        </code>
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong>Protocolo:</strong> {protocol}
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong>Hostname:</strong> {hostname}
      </div>
      {port && (
        <div style={{ marginBottom: '5px' }}>
          <strong>Puerto:</strong> {port}
        </div>
      )}
      <div style={{
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid #00ff00',
        fontSize: '11px',
        color: '#ffff00'
      }}>
        ⚠️ Este es el origen que Google verá.<br/>
        Registra esto en Google Cloud Console.
      </div>
    </div>
  );
};

