import { useState } from 'react';

export default function LoginCard({ onSubmit, loading, error }) {
  const [rut, setRut] = useState('');
  const [clave, setClave] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rut, clave });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f2]">
      {/* TOP-BAR */}
      <div className="bg-[#1a3a5c] p-[10px_16px] flex items-center">
        <div className="flex items-center gap-[10px]">
          <div className="w-[44px] h-[44px] bg-[#ffffff] rounded-[4px] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="#1a3a5c" />
              <text x="18" y="23" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                UCN
              </text>
            </svg>
          </div>
          <div>
            <div className="text-[#ffffff] text-[15px] font-bold leading-[1.2]">iLLAPEL</div>
            <div className="text-[#aac8e8] text-[11px]">Municipalidad · Illapel te ayuda</div>
          </div>
        </div>
      </div>

      {/* PAGE-BG */}
      <div className="bg-[#f5f5f2] min-h-[480px] flex items-center justify-center p-[32px_16px]">
        {/* LOGIN-CARD */}
        <div className="bg-[#ffffff] border border-[#ccc] rounded-[6px] w-full max-w-[380px] overflow-hidden">
          {/* CARD-HEADER */}
          <div className="bg-[#2563a0] p-[18px_24px] text-center">
            <div className="text-[#ffffff] text-[16px] font-bold">Iniciar sesión</div>
            <div className="text-[#aac8e8] text-[12px] mt-[3px]">Sistema de gestión de ayudas sociales</div>
          </div>

          {/* CARD-BODY */}
          <form className="bg-[#ffffff] p-[24px]" onSubmit={handleSubmit}>
            {/* FIELD RUT */}
            <div className="mb-[16px]">
              <label className="block text-[12px] text-[#444444] mb-[5px] font-bold">
                RUT
              </label>
              <input
                type="text"
                className="w-full bg-[#ffffff] border border-[#ccc] rounded-[3px] p-[8px_10px] text-[13px] text-[#333333] outline-none box-border focus:border-[#2563a0]"
                placeholder="Ej: 12.345.678-9"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                required
              />
            </div>

            {/* FIELD CLAVE */}
            <div className="mb-[16px]">
              <label className="block text-[12px] text-[#444444] mb-[5px] font-bold">
                Contraseña
              </label>
              <input
                type="password"
                className="w-full bg-[#ffffff] border border-[#ccc] rounded-[3px] p-[8px_10px] text-[13px] text-[#333333] outline-none box-border focus:border-[#2563a0]"
                placeholder="Ingrese su contraseña"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
              />
            </div>

            {/* BTN-LOGIN */}
            <button
              type="submit"
              className="w-full bg-[#2563a0] text-[#ffffff] border-none rounded-[3px] p-[10px] text-[14px] font-bold mt-[4px] cursor-pointer transition-colors hover:enabled:bg-[#1a4f80] disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>

            {/* FORGOT */}
            <div className="text-center mt-[12px] text-[12px] text-[#2563a0] cursor-pointer">
              ¿Olvidó su contraseña? Contacte a su administrador
            </div>

            {/* DIVIDER */}
            <hr className="border-none border-t border-[#eeeeee] m-[4px_0_16px]" />

            {/* UCN-NOTE */}
            <div className="text-center text-[11px] text-[#aaaaaa] mt-[16px]">
              Acceso exclusivo para funcionarios municipales
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="text-center text-[11px] text-[#d32f2f] mt-[12px] p-[8px] bg-[#ffebee] rounded-[3px]">
                {error}
              </div>
            )}
          </form>

          {/* FOOTER */}
          <div className="text-center p-[12px] text-[11px] text-[#999999] bg-[#f5f5f2] border-t border-[#eeeeee]">
            Universidad Católica del Norte · Escuela de Ingeniería
          </div>
        </div>
      </div>
    </div>
  );
}