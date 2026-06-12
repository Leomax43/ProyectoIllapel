import { useState } from 'react';

export default function LoginCard({ onSubmit, loading, error }) {
  const [rut, setRut] = useState('');
  const [clave, setClave] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rut, clave });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gris-bg">
      {/* TOP-BAR — Igual que DashboardHeader pero sin info de usuario */}
      <div className="bg-azul flex items-center h-[62px] px-[20px]">
        <div className="flex items-center gap-[14px]">
          {/* Logo oficial Municipalidad de Illapel */}
          <img 
            src="https://municipalidadillapel.cl/app/uploads/2023/10/logo-white.png" 
            alt="Municipalidad de Illapel" 
            className="h-[42px] w-auto"
          />

          {/* Separador vertical */}
          <div className="w-[1px] h-[24px] bg-white/25"></div>

          {/* Texto del logo */}
          <div>
            <div className="text-white text-[13px] font-semibold leading-tight">Municipalidad de Illapel</div>
            <div className="text-celeste text-[11px] font-light">Illapel te ayuda · Sistema de ayudas sociales</div>
          </div>
        </div>
      </div>

      {/* ACCENT BAR — Degradado de 4px */}
      <div className="h-[4px] bg-gradient-to-r from-amarillo via-celeste to-verde"></div>

      {/* PAGE-BG */}
      <div className="bg-gris-bg min-h-[480px] flex items-center justify-center p-[32px_16px]">
        {/* LOGIN-CARD */}
        <div className="bg-white border border-gris-borde rounded-[6px] w-full max-w-[380px] overflow-hidden">
          {/* CARD-HEADER */}
          <div className="bg-azul p-[18px_24px] text-center">
            <div className="text-white text-[16px] font-bold">Iniciar sesión</div>
            <div className="text-celeste text-[12px] mt-[3px]">Sistema de gestión de ayudas sociales</div>
          </div>

          {/* CARD-BODY */}
          <form className="bg-white p-[24px]" onSubmit={handleSubmit}>
            {/* FIELD RUT */}
            <div className="mb-[16px]">
              <label className="block text-[12px] text-gris-texto mb-[5px] font-bold">
                RUT
              </label>
              <input
                type="text"
                className="w-full bg-white border border-gris-borde rounded-[3px] px-[10px] py-[8px] text-[13px] outline-none focus:border-verde"
                style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
                placeholder="Ej: 12.345.678-9"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                required
              />
            </div>

            {/* FIELD CLAVE */}
            <div className="mb-[16px]">
              <label className="block text-[12px] text-gris-texto mb-[5px] font-bold">
                Contraseña
              </label>
              <input
                type="password"
                className="w-full bg-white border border-gris-borde rounded-[3px] px-[10px] py-[8px] text-[13px] outline-none focus:border-verde"
                style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
                placeholder="Ingrese su contraseña"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
              />
            </div>

            {/* BTN-LOGIN */}
            <button
              type="submit"
              className="w-full bg-verde text-white border-none rounded-[3px] py-[10px] text-[14px] font-bold mt-[4px] cursor-pointer hover:brightness-110 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>

            {/* FORGOT */}
            <div className="text-center mt-[12px] text-[12px] text-azul cursor-pointer">
              ¿Olvidó su contraseña? Contacte a su administrador
            </div>

            {/* DIVIDER */}
            <hr className="border-none border-t border-[#f0f0f0] m-[4px_0_16px]" />

            {/* UCN-NOTE */}
            <div className="text-center text-[11px] text-gris-claro mt-[16px]">
              Acceso exclusivo para funcionarios municipales
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="text-center text-[11px] text-[#c62828] mt-[12px] p-[8px] bg-[#ffebee] rounded-[3px] border border-[#ffcdd2]">
                {error}
              </div>
            )}
          </form>

          {/* FOOTER */}
          <div className="text-center p-[12px] text-[11px] text-gris-claro bg-gris-bg border-t border-[#f0f0f0]">
            <span className="text-celeste font-semibold">Illapel te ayuda</span> · Municipalidad de Illapel · Universidad Católica del Norte
          </div>
        </div>
      </div>
    </div>
  );
}