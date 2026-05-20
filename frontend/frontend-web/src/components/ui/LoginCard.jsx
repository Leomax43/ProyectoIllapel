import { useState } from 'react';

export default function LoginCard({ onSubmit, loading, error }) {
  const [rut, setRut] = useState('');
  const [clave, setClave] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rut, clave });
  };

  return (
    <div style={{ border: '1px solid #bbb', borderRadius: '4px', overflow: 'hidden' }}>
      {/* TOP-BAR */}
      <div style={{ background: '#1a3a5c', padding: '10px 16px', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              background: '#fff',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="#1a3a5c" />
              <text x="18" y="23" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">
                UCN
              </text>
            </svg>
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold', lineHeight: '1.2' }}>iLLAPEL</div>
            <div style={{ color: '#aac8e8', fontSize: '11px' }}>Municipalidad · Illapel te ayuda</div>
          </div>
        </div>
      </div>

      {/* PAGE-BG */}
      <div style={{ background: '#f5f5f2', minHeight: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        {/* LOGIN-CARD */}
        <div style={{ background: '#fff', border: '1px solid #ccc', borderRadius: '6px', width: '100%', maxWidth: '380px', overflow: 'hidden' }}>
          {/* CARD-HEADER */}
          <div style={{ background: '#2563a0', padding: '18px 24px', textAlign: 'center' }}>
            <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>Iniciar sesión</div>
            <div style={{ color: '#aac8e8', fontSize: '12px', marginTop: '3px' }}>Sistema de gestión de ayudas sociales</div>
          </div>

          {/* CARD-BODY */}
          <form style={{ padding: '24px' }} onSubmit={handleSubmit}>
            {/* FIELD RUT */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#444', marginBottom: '5px', fontWeight: 'bold' }}>
                RUT
              </label>
              <input
                type="text"
                style={{
                  width: '100%',
                  border: '1px solid #ccc',
                  borderRadius: '3px',
                  padding: '8px 10px',
                  fontSize: '13px',
                  color: '#333',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563a0')}
                onBlur={(e) => (e.target.style.borderColor = '#ccc')}
                placeholder="Ej: 12.345.678-9"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                required
              />
            </div>

            {/* FIELD CLAVE */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#444', marginBottom: '5px', fontWeight: 'bold' }}>
                Contraseña
              </label>
              <input
                type="password"
                style={{
                  width: '100%',
                  border: '1px solid #ccc',
                  borderRadius: '3px',
                  padding: '8px 10px',
                  fontSize: '13px',
                  color: '#333',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563a0')}
                onBlur={(e) => (e.target.style.borderColor = '#ccc')}
                placeholder="Ingrese su contraseña"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
              />
            </div>

            {/* BTN-LOGIN */}
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#2563a0',
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                padding: '10px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '4px',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseOver={(e) => !loading && (e.target.style.background = '#1a4f80')}
              onMouseOut={(e) => (e.target.style.background = '#2563a0')}
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>

            {/* FORGOT */}
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#2563a0', cursor: 'pointer' }}>
              ¿Olvidó su contraseña? Contacte a su administrador
            </div>

            {/* DIVIDER */}
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '4px 0 16px' }} />

            {/* UCN-NOTE */}
            <div style={{ textAlign: 'center', fontSize: '11px', color: '#aaa', marginTop: '16px' }}>
              Acceso exclusivo para funcionarios municipales
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#d32f2f', marginTop: '12px', padding: '8px', background: '#ffebee', borderRadius: '3px' }}>
                {error}
              </div>
            )}
          </form>

          {/* FOOTER */}
          <div style={{ textAlign: 'center', padding: '12px', fontSize: '11px', color: '#999', background: '#f5f5f2', borderTop: '1px solid #eee' }}>
            Universidad Católica del Norte · Escuela de Ingeniería
          </div>
        </div>
      </div>
    </div>
  );
}

