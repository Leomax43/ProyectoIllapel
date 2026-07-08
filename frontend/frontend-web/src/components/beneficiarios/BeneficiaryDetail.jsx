import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import beneficiariesService from '../../services/beneficiariesService';

const BeneficiaryDetail = ({ beneficiary, onEstadoCambiado }) => {
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('datos-personales');

  useEffect(() => {
    if (beneficiary) {
      fetchDetail();
    }
  }, [beneficiary]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const data = await beneficiariesService.getBeneficiaryDetail(beneficiary.rut_representante);
      setDetail(data);
    } catch (error) {
      console.error('Error loading detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!beneficiary) {
    return (
      <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden p-[20px] text-center text-gris-claro">
        Selecciona un beneficiario para ver detalles
      </div>
    );
  }

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('es-CL');
  };

  const formatBoolean = (value) => {
    if (value === true || value === 'true' || value === 'TRUE' || value === 1) return 'Sí';
    if (value === false || value === 'false' || value === 'FALSE' || value === 0) return 'No';
    return 'N/A';
  };

  const getTotalRecibido = () => {
    const cargas = detail?.historial_cargas || [];
    return cargas.reduce((sum, carga) => sum + (Number(carga.monto) || 0), 0);
  };

  const tabs = [
    { id: 'datos-personales', label: 'Datos personales' },
    { id: 'nucleo-familiar', label: 'Núcleo familiar' },
    { id: 'historial', label: 'Historial' },
    { id: 'documentos', label: 'Documentos' },
  ];

  const representante = detail?.nucleo_familiar?.[0] || {};

  if (loading) {
    return (
      <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden">
        <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">Detalle del beneficiario seleccionado</div>
        <div className="p-[20px] text-center text-gris-claro">Cargando...</div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden">
        <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">Detalle del beneficiario seleccionado</div>
        <div className="p-[20px] text-center text-gris-claro">Error al cargar datos</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden">
      {/* PANEL HEADER */}
      <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
        <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
        Detalle del beneficiario seleccionado
      </div>

      {/* TABS */}
      <div className="flex border-b-2 border-azul">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-[14px] py-[7px] text-[12px] cursor-pointer transition-colors ${
              activeTab === tab.id
                ? 'text-azul border-b-2 border-azul font-bold bg-[#f0f4f6]'
                : 'text-gris-texto border-b-2 border-transparent hover:text-azul'
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="p-[13px_14px]">
        {/* DATOS PERSONALES */}
        {activeTab === 'datos-personales' && (
          <>
            <div className="text-[11px] font-bold text-azul mb-[8px] uppercase tracking-[0.5px]">Información general</div>
            <div className="grid grid-cols-2 gap-[8px] mb-[6px]">
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">Nombre completo</div>
                <div className="text-[12px] text-[#222] font-bold">{representante.nombre_completo || detail.datos_personales?.nombre_representante || 'N/A'}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">RUT</div>
                <div className="text-[12px] text-[#222] font-bold">{detail.datos_personales?.rut_representante || beneficiary.rut_representante}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">Fecha de nacimiento</div>
                <div className="text-[12px] text-[#222] font-bold">
                  {formatDate(representante.fecha_nacimiento)} ({calculateAge(representante.fecha_nacimiento)} años)
                </div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">Sexo</div>
                <div className="text-[12px] text-[#222] font-bold">{detail.datos_personales?.sexo || 'N/A'}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">Teléfono</div>
                <div className="text-[12px] text-[#222] font-bold">{detail.datos_personales?.telefono || 'N/A'}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">Teléfono del hogar</div>
                <div className="text-[12px] text-[#222] font-bold">{detail.datos_personales?.telefono_hogar || 'N/A'}</div>
              </div>
              <div className="col-span-2 text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">Correo electrónico</div>
                <div className="text-[12px] text-[#222] font-bold">{detail.datos_personales?.correo_electronico || 'N/A'}</div>
              </div>
              <div className="col-span-2 text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">Dirección</div>
                <div className="text-[12px] text-[#222] font-bold">{detail.datos_personales?.direccion || 'N/A'}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">Sector / localidad</div>
                <div className="text-[12px] text-[#222] font-bold">{detail.datos_personales?.sector_localidad || 'N/A'}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">¿Tiene discapacidad?</div>
                <div className="text-[12px] text-[#222] font-bold">{formatBoolean(detail.datos_personales?.tiene_discapacidad)}</div>
              </div>
              <div className="col-span-2 text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">Observaciones</div>
                <div className="text-[12px] text-[#222] font-bold">{detail.datos_personales?.observaciones || 'Sin observaciones'}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[0px]">Estado de cuenta</div>
                <div className="text-[12px] text-[#222] font-bold">
                  <span className={`inline-block px-[9px] py-[3px] rounded-[12px] text-[11px] font-semibold ${
                    detail.datos_personales?.estado === 'ACTIVO'
                      ? 'bg-[#e6f7f4] text-verde border border-[#b2e8de]'
                      : 'bg-[#fde8e8] text-[#b52b2b] border border-[#f5b8b8]'
                  }`}>
                    {detail.datos_personales?.estado}
                  </span>
                </div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[1px]">Fecha de registro</div>
                <div className="text-[12px] text-[#222] font-bold">{formatDate(detail.datos_personales?.fecha_creacion)}</div>
              </div>
            </div>

            <div className="text-[11px] font-bold text-azul mb-[8px] uppercase tracking-[0.5px]">Saldos</div>
            <div className="grid grid-cols-2 gap-[8px] mb-[10px]">
              <div className="border border-azul rounded-[4px] p-[8px_12px] text-center bg-[#e0eaf0]">
                <div className="text-[10px] text-gris-claro mb-[3px]">Saldo disponible</div>
                <div className="text-[18px] font-bold text-azul">${beneficiary.saldo.toLocaleString('es-CL')}</div>
              </div>
              <div className="border border-verde rounded-[4px] p-[8px_12px] text-center bg-[#e6f7f4]">
                <div className="text-[10px] text-gris-claro mb-[3px]">Total recibido</div>
                <div className="text-[18px] font-bold text-azul">${getTotalRecibido().toLocaleString('es-CL')}</div>
              </div>
            </div>
          </>
        )}

        {/* NÚCLEO FAMILIAR */}
        {activeTab === 'nucleo-familiar' && (
          <>
            <div className="text-[11px] font-bold text-azul mb-[8px] uppercase tracking-[0.5px]">Miembros del núcleo familiar</div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-[11px]">
                <thead>
                  <tr>
                    <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Nombre</th>
                    <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Parentesco</th>
                    <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">RUT</th>
                    <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Sexo</th>
                    <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Edad</th>
                    <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Teléfono</th>
                    <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Correo</th>
                    <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Discap.</th>
                    <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.nucleo_familiar && detail.nucleo_familiar.map((member, idx) => (
                    <tr key={idx}>
                      <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{member.nombre_completo || 'N/A'}</td>
                      <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{member.parentesco || 'N/A'}</td>
                      <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{member.rut || 'N/A'}</td>
                      <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{member.sexo || 'N/A'}</td>
                      <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{calculateAge(member.fecha_nacimiento)}</td>
                      <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{member.telefono || 'N/A'}</td>
                      <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{member.correo_electronico || 'N/A'}</td>
                      <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{formatBoolean(member.tiene_discapacidad)}</td>
                      <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{member.observaciones || 'Sin observaciones'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* HISTORIAL */}
        {activeTab === 'historial' && (
          <>
            <div className="text-[11px] font-bold text-azul mb-[8px] uppercase tracking-[0.5px]">Historial de cargas</div>
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr>
                  <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Fecha</th>
                  <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Monto</th>
                  <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Motivo</th>
                  <th className="bg-[#f0f4f6] text-azul px-[8px] py-[5px] text-left border border-gris-borde font-semibold">Responsable</th>
                </tr>
              </thead>
              <tbody>
                {detail.historial_cargas && detail.historial_cargas.length > 0 ? (
                  detail.historial_cargas.map((carga, idx) => (
                    <tr key={idx}>
                      <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{formatDate(carga.fecha)}</td>
                      <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">${Number(carga.monto || 0).toLocaleString('es-CL')}</td>
                      <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{carga.motivo || 'N/A'}</td>
                      <td className="px-[8px] py-[5px] border border-[#f0f0f0] text-[#333]">{carga.responsable || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-[8px] py-[5px] border border-[#f0f0f0] text-gris-claro text-center">Sin registros</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {/* DOCUMENTOS */}
        {activeTab === 'documentos' && (
          <>
            <div className="text-[11px] font-bold text-azul mb-[8px] uppercase tracking-[0.5px]">Ficha Social</div>
            {detail.datos_personales?.pdf_ficha_social ? (
              <div className="border border-gris-borde rounded-[4px] p-[12px] bg-[#f9fafb]">
                <div className="flex items-center gap-[10px]">
                  <div className="text-[24px]">📄</div>
                  <div className="flex-1">
                    <div className="text-[12px] font-bold text-azul mb-[3px]">
                      {detail.datos_personales.pdf_ficha_social.split('/').pop()}
                    </div>
                    <div className="text-[11px] text-gris-texto">
                      Ficha Social - Creada el {formatDate(detail.datos_personales?.fecha_creacion)}
                    </div>
                  </div>
                  <a
                    href={`http://localhost:3000${detail.datos_personales.pdf_ficha_social}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-azul text-white border-none rounded-[3px] px-[12px] py-[6px] text-[11px] cursor-pointer font-bold no-underline hover:brightness-110"
                    style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}
                  >
                    Descargar
                  </a>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-gris-borde rounded-[4px] p-[20px] text-center text-gris-claro bg-[#f9fafb]">
                📭 No hay ficha social adjunta para esta familia
              </div>
            )}
          </>
        )}
      </div>

      {/* ACTION BOTTOM */}
      <div className="flex justify-between gap-[8px] px-[14px] py-[12px] border-t border-gris-borde bg-[#f9f9f9]">
        {detail?.datos_personales?.estado === 'ACTIVO' ? (
          <button 
            onClick={() => onEstadoCambiado && onEstadoCambiado(beneficiary.id_familia, 'BAJA')}
            className="bg-[#b52b2b] text-white border-none rounded-[3px] px-[14px] py-[7px] text-[12px] cursor-pointer font-bold hover:brightness-110"
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
            Dar de baja
          </button>
        ) : (
          <button 
            onClick={() => onEstadoCambiado && onEstadoCambiado(beneficiary.id_familia, 'ACTIVO')}
            className="bg-verde text-white border-none rounded-[3px] px-[14px] py-[7px] text-[12px] cursor-pointer font-bold hover:brightness-110"
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
            Activar
          </button>
        )}
        <div className="flex gap-[8px]">
          <button 
            onClick={() => navigate(`/nueva-carga?rut=${detail?.datos_personales?.rut_representante || beneficiary?.rut_representante}`)}
            className="bg-[#c49300] text-white border-none rounded-[3px] px-[14px] py-[7px] text-[12px] cursor-pointer font-bold hover:brightness-110"
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
            Cargar fondos
          </button>
          <button onClick={() => navigate(`/beneficiarios/editar/${detail?.datos_personales?.rut_representante || beneficiary?.rut_representante}`)} className="bg-azul text-white border-none rounded-[3px] px-[14px] py-[7px] text-[12px] cursor-pointer font-bold hover:brightness-110"
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
            Editar datos
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDetail;