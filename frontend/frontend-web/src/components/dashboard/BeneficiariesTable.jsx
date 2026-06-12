import { useNavigate } from 'react-router-dom';

function BeneficiariesTable({ 
  beneficiarios = [], 
  currentPage = 1, 
  totalPages = 1, 
  totalRecords = 0, 
  recordsPerPage = 8,
  onNextPage = () => {},
  onPrevPage = () => {},
  searchTerm = '',
  onSearchChange = () => {},
  onSearchSubmit = () => {},
  onNavigate
}) {
  const navigate = onNavigate || useNavigate();

  const badgeStyle = (estado) => {
    const estadoUpper = (estado || '').toUpperCase();
    if (estadoUpper === 'ACTIVO') return 'badge activo bg-[#e6f7f4] text-verde border border-[#b2e8de]';
    if (estadoUpper === 'PENDIENTE') return 'badge pendiente bg-[#fff8e0] text-[#a07800] border border-[#f0d970]';
    if (estadoUpper === 'BAJA') return 'badge baja bg-[#fde8e8] text-[#b52b2b] border border-[#f5b8b8]';
    return 'bg-[#e9ecef] text-[#555] border border-[#ddd]';
  };

  const getActionButtons = (estado, beneficiario) => {
    const estadoUpper = (estado || '').toUpperCase();
    const buttons = [];
    buttons.push({ label: 'Ver', style: 'btn-ver bg-azul', action: () => navigate(`/beneficiarios`) });
    if (estadoUpper === 'PENDIENTE') {
      buttons.push({ label: 'Aprobar', style: 'btn-aprobar bg-celeste', action: () => navigate(`/aprobaciones`) });
    } else if (estadoUpper === 'ACTIVO') {
      buttons.push({ label: 'Fondos', style: 'btn-fondos bg-verde', action: () => navigate(`/nueva-carga`) });
    }
    return buttons;
  };

  const startRecord = totalRecords > 0 ? (currentPage - 1) * recordsPerPage + 1 : 0;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden">
      {/* PANEL HEADER */}
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px] flex justify-between items-center">
        <div>
          <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
          Actividad reciente — Beneficiarios
        </div>
        <div className="flex gap-[5px]">
          <button className="bg-azul text-white border-none px-[10px] py-[4px] rounded-[3px] text-[11px] cursor-pointer hover:brightness-110" style={{ background: 'rgba(255,255,255,0.15)', fontFamily: "'Exo 2', Arial, sans-serif" }}>Excel</button>
          <button className="text-white border-none px-[10px] py-[4px] rounded-[3px] text-[11px] cursor-pointer hover:brightness-110" style={{ background: 'rgba(255,255,255,0.15)', fontFamily: "'Exo 2', Arial, sans-serif" }}>CSV</button>
          <button className="text-white border-none px-[10px] py-[4px] rounded-[3px] text-[11px] cursor-pointer hover:brightness-110" style={{ background: 'rgba(255,255,255,0.15)', fontFamily: "'Exo 2', Arial, sans-serif" }}>PDF</button>
        </div>
      </div>

      {/* TABLE CONTROLS */}
      <div className="px-[14px] py-[8px] flex justify-between items-center border-b border-gris-borde bg-[#fafafa]">
        <div className="text-[12px] text-gris-claro">Mostrando últimos registros</div>
        <form 
          onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}
          className="flex items-center gap-[6px] text-[12px] text-gris-texto"
        >
          Buscar:{' '}
          <input
            type="text"
            placeholder="Nombre, RUT..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border border-gris-borde rounded-[3px] px-[9px] py-[4px] text-[12px] w-[160px] outline-none focus:border-verde"
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
          />
          <button
            type="submit"
            className="bg-azul text-white border-none px-[10px] py-[4px] rounded-[3px] text-[11px] cursor-pointer font-bold"
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
          >
            Buscar
          </button>
        </form>
      </div>

      {/* TABLE */}
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[8px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">RUT</th>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[8px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Beneficiario</th>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[8px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Núcleo familiar</th>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[8px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Saldo actual</th>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[8px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Última carga</th>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[8px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Estado</th>
            <th className="bg-[#f0f4f6] text-azul px-[12px] py-[8px] text-left font-semibold text-[11px] tracking-[0.3px] border-b-2 border-celeste">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {beneficiarios.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center px-[12px] py-[16px] text-gris-claro text-[12px]">
                No hay beneficiarios para mostrar
              </td>
            </tr>
          ) : (
            beneficiarios.map((beneficiario, idx) => (
              <tr 
                key={beneficiario.id_familia || idx} 
                className="hover:bg-[#f0f8f6] cursor-pointer"
              >
                <td className="px-[12px] py-[8px] border-b border-[#f0f0f0] text-[#333]">{beneficiario.rut_representante}</td>
                <td className="px-[12px] py-[8px] border-b border-[#f0f0f0] text-[#333]">{beneficiario.nombre_familia}</td>
                <td className="px-[12px] py-[8px] border-b border-[#f0f0f0] text-[#333]">Fam. {beneficiario.nombre_familia?.split(' ')[0]}</td>
                <td className="px-[12px] py-[8px] border-b border-[#f0f0f0] text-[#333]">${(beneficiario.saldo || 0).toLocaleString('es-CL')}</td>
                <td className="px-[12px] py-[8px] border-b border-[#f0f0f0] text-[#333]">—</td>
                <td className="px-[12px] py-[8px] border-b border-[#f0f0f0] text-[#333]">
                  <span className={`inline-block px-[9px] py-[3px] rounded-[12px] text-[11px] font-semibold ${badgeStyle(beneficiario.estado)}`}>
                    {beneficiario.estado?.charAt(0).toUpperCase() + beneficiario.estado?.slice(1).toLowerCase()}
                  </span>
                </td>
                <td className="px-[12px] py-[8px] border-b border-[#f0f0f0] text-[#333]">
                  {getActionButtons(beneficiario.estado, beneficiario).map((btn, i) => (
                    <button
                      key={i}
                      onClick={btn.action}
                      className={`px-[10px] py-[4px] rounded-[3px] text-[11px] border-none cursor-pointer text-white mr-[3px] font-medium ${btn.style}`}
                      style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* PAGER */}
      <div className="px-[14px] py-[8px] text-[12px] text-gris-claro flex justify-between items-center border-t border-gris-borde bg-[#fafafa]">
        <span>Mostrando registros del {startRecord} al {endRecord} de un total de {totalRecords} registros</span>
        <div className="flex gap-[8px] items-center">
          <button
            onClick={onPrevPage}
            disabled={currentPage === 1}
            className={`px-[8px] py-[3px] rounded-[3px] text-[11px] border border-gris-borde ${
              currentPage === 1 ? 'bg-[#e0e0e0] text-gris-claro cursor-not-allowed' : 'bg-white text-[#333] cursor-pointer'
            }`}
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
          >
            Anterior
          </button>
          <span className="text-[11px] font-bold text-[#333]">{currentPage} de {totalPages}</span>
          <button
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            className={`px-[8px] py-[3px] rounded-[3px] text-[11px] border border-gris-borde ${
              currentPage >= totalPages ? 'bg-[#e0e0e0] text-gris-claro cursor-not-allowed' : 'bg-white text-[#333] cursor-pointer'
            }`}
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default BeneficiariesTable;