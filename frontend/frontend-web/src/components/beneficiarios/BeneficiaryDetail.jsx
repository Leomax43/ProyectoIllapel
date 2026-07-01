import { useState, useEffect } from 'react';
import beneficiariesService from '../../services/beneficiariesService';
import BeneficiarioForm from '../ui/BeneficiarioForm';
import IntegrantesTable from '../ui/IntegrantesTable';

const initialBeneficiarioState = {
  nombre_completo: '',
  rut: '',
  fecha_nacimiento: '',
  sexo: '',
  telefono: '',
  correo_electronico: '',
  direccion: '',
  sector_localidad: '',
  telefono_hogar: '',
  tiene_discapacidad: false,
  observaciones: '',
  rol_en_hogar: 'Jefa de hogar',
  clave_acceso: '',
  confirmar_clave: '',
  quiero_definir_clave: false
};

const initialIntegranteState = {
  nombre_completo: '',
  rut: '',
  parentesco: 'Cónyuge',
  sexo: '',
  fecha_nacimiento: '',
  telefono: '',
  correo_electronico: '',
  tiene_discapacidad: false,
  observaciones: ''
};

const BeneficiaryDetail = ({ beneficiary }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('datos-personales');
  const [isEditing, setIsEditing] = useState(false);
  const [editBeneficiario, setEditBeneficiario] = useState(initialBeneficiarioState);
  const [editIntegrantes, setEditIntegrantes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  useEffect(() => {
    if (beneficiary) {
      setIsEditing(false);
      setFormMessage(null);
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

  const buildEditStateFromDetail = (detailData) => {
    const personal = detailData?.datos_personales || {};
    const representante = detailData?.nucleo_familiar?.[0] || {};

    return {
      nombre_completo: personal.nombre_representante || representante.nombre_completo || '',
      rut: personal.rut_representante || '',
      fecha_nacimiento: representante.fecha_nacimiento || '',
      sexo: personal.sexo || representante.sexo || '',
      telefono: personal.telefono || representante.telefono || '',
      correo_electronico: personal.correo_electronico || representante.correo_electronico || '',
      direccion: personal.direccion || '',
      sector_localidad: personal.sector_localidad || '',
      telefono_hogar: personal.telefono_hogar || '',
      tiene_discapacidad: Boolean(personal.tiene_discapacidad ?? representante.tiene_discapacidad ?? false),
      observaciones: personal.observaciones || representante.observaciones || '',
      rol_en_hogar: representante.parentesco || 'Jefa de hogar',
      clave_acceso: '',
      confirmar_clave: '',
      quiero_definir_clave: false
    };
  };

  const buildEditIntegrantesState = (detailData) => {
    return (detailData?.nucleo_familiar || []).slice(1).map((member, index) => ({
      id: `integrante-${index}`,
      ...initialIntegranteState,
      ...member
    }));
  };

  const startEditing = () => {
    setEditBeneficiario(buildEditStateFromDetail(detail));
    setEditIntegrantes(buildEditIntegrantesState(detail));
    setIsEditing(true);
    setFormMessage(null);
  };

  const handleBeneficiarioChange = (field, value) => {
    setEditBeneficiario(prev => ({ ...prev, [field]: value }));
  };

  const handleIntegranteChange = (id, field, value) => {
    setEditIntegrantes(prev => prev.map(int => (int.id === id ? { ...int, [field]: value } : int)));
  };

  const agregarIntegrante = () => {
    const newId = `integrante-${Date.now()}`;
    setEditIntegrantes(prev => [...prev, { id: newId, ...initialIntegranteState }]);
  };

  const eliminarIntegrante = (id) => {
    setEditIntegrantes(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormMessage(null);

    try {
      const nombreCompleto = editBeneficiario.nombre_completo.trim();
      const rutRepresentante = editBeneficiario.rut.trim();

      if (!nombreCompleto || !rutRepresentante || !editBeneficiario.fecha_nacimiento || !editBeneficiario.direccion || !editBeneficiario.sector_localidad) {
        throw new Error('Faltan campos obligatorios del beneficiario principal');
      }

      if (editBeneficiario.quiero_definir_clave) {
        if (!editBeneficiario.clave_acceso || editBeneficiario.clave_acceso.length < 6) {
          throw new Error('La clave personalizada debe tener al menos 6 caracteres');
        }
        if (editBeneficiario.clave_acceso !== editBeneficiario.confirmar_clave) {
          throw new Error('Las claves no coinciden');
        }
      }

      if (editIntegrantes.some(int => !int.nombre_completo || !int.parentesco || !int.fecha_nacimiento)) {
        throw new Error('Completa todos los campos de los integrantes adicionales');
      }

      const payload = {
        rut_representante: rutRepresentante,
        nombre_representante: nombreCompleto,
        direccion: editBeneficiario.direccion,
        sector_localidad: editBeneficiario.sector_localidad,
        telefono: editBeneficiario.telefono || editBeneficiario.telefono_hogar || null,
        telefono_hogar: editBeneficiario.telefono_hogar,
        correo_electronico: editBeneficiario.correo_electronico || null,
        sexo: editBeneficiario.sexo || null,
        observaciones: editBeneficiario.observaciones || null,
        tiene_discapacidad: editBeneficiario.tiene_discapacidad,
        ...(editBeneficiario.quiero_definir_clave ? { clave_acceso: editBeneficiario.clave_acceso } : {}),
        integrantes: [
          {
            nombre_completo: nombreCompleto,
            rut: rutRepresentante,
            parentesco: editBeneficiario.rol_en_hogar,
            sexo: editBeneficiario.sexo || null,
            fecha_nacimiento: editBeneficiario.fecha_nacimiento,
            correo_electronico: editBeneficiario.correo_electronico || null,
            telefono: editBeneficiario.telefono || editBeneficiario.telefono_hogar || null,
            tiene_discapacidad: editBeneficiario.tiene_discapacidad,
            observaciones: editBeneficiario.observaciones || null
          },
          ...editIntegrantes.map(integrante => ({
            nombre_completo: integrante.nombre_completo,
            rut: integrante.rut || null,
            parentesco: integrante.parentesco,
            sexo: integrante.sexo || null,
            fecha_nacimiento: integrante.fecha_nacimiento,
            correo_electronico: integrante.correo_electronico || null,
            telefono: integrante.telefono || null,
            tiene_discapacidad: integrante.tiene_discapacidad,
            observaciones: integrante.observaciones || null
          }))
        ]
      };

      const currentRut = detail?.datos_personales?.rut_representante || beneficiary?.rut_representante;
      if (!currentRut) {
        throw new Error('No fue posible identificar al beneficiario');
      }

      await beneficiariesService.updateBeneficiary(currentRut, payload);
      const refreshed = await beneficiariesService.getBeneficiaryDetail(rutRepresentante);
      setDetail(refreshed);
      setIsEditing(false);
      setFormMessage({ text: '✅ Datos actualizados correctamente', type: 'success' });
    } catch (error) {
      setFormMessage({ text: `❌ Error: ${error.message}`, type: 'error' });
    } finally {
      setSaving(false);
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
    { id: 'pin', label: 'PIN' },
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

  if (isEditing) {
    return (
      <div className="bg-white border border-gris-borde rounded-[6px] overflow-hidden">
        <div className="bg-azul text-white text-[13px] font-semibold px-[16px] py-[9px]">
          <span className="inline-block w-[3px] h-[16px] bg-amarillo rounded-[2px] mr-[8px] align-middle"></span>
          Editar datos del beneficiario
        </div>

        <div className="p-[13px_14px]">
          {formMessage && (
            <div className={`border rounded-[3px] p-[8px_12px] text-[12px] mb-[14px] ${
              formMessage.type === 'error' ? 'bg-[#ffebee] border-[#ffcdd2] text-[#c62828]' : 'bg-[#e8f5e9] border-[#c8e6c9] text-[#2e7d32]'
            }`}>
              {formMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <BeneficiarioForm
              beneficiario={editBeneficiario}
              onBeneficiarioChange={handleBeneficiarioChange}
            />

            <IntegrantesTable
              integrantes={editIntegrantes}
              onIntegranteChange={handleIntegranteChange}
              onEliminarIntegrante={eliminarIntegrante}
              onAgregarIntegrante={agregarIntegrante}
            />

            <div className="flex justify-end gap-[10px] mt-[4px]">
              <button type="button" onClick={() => { setIsEditing(false); setFormMessage(null); }} disabled={saving} className="bg-white border border-gris-borde text-gris-texto rounded-[4px] px-[22px] py-[9px] text-[13px] cursor-pointer hover:bg-[#f5f5f5]">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className={`bg-verde text-white border-none rounded-[4px] px-[24px] py-[9px] text-[13px] font-semibold ${saving ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:brightness-110'}`}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
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
        {formMessage && (
          <div className={`border rounded-[3px] p-[8px_12px] text-[12px] mb-[14px] ${
            formMessage.type === 'error' ? 'bg-[#ffebee] border-[#ffcdd2] text-[#c62828]' : 'bg-[#e8f5e9] border-[#c8e6c9] text-[#2e7d32]'
          }`}>
            {formMessage.text}
          </div>
        )}

        {/* DATOS PERSONALES */}
        {activeTab === 'datos-personales' && (
          <>
            <div className="text-[11px] font-bold text-azul mb-[8px] uppercase tracking-[0.5px]">Información general</div>
            <div className="grid grid-cols-2 gap-[7px] mb-[10px]">
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[3px]">Nombre completo</div>
                <div className="text-[12px] text-[#222] font-bold">{representante.nombre_completo || detail.datos_personales?.nombre_representante || 'N/A'}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[3px]">RUT</div>
                <div className="text-[12px] text-[#222] font-bold">{detail.datos_personales?.rut_representante || beneficiary.rut_representante}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[3px]">Fecha de nacimiento</div>
                <div className="text-[12px] text-[#222] font-bold">
                  {formatDate(representante.fecha_nacimiento)} ({calculateAge(representante.fecha_nacimiento)} años)
                </div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[3px]">Sexo</div>
                <div className="text-[12px] text-[#222] font-bold">{detail.datos_personales?.sexo || 'N/A'}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[3px]">Teléfono</div>
                <div className="text-[12px] text-[#222] font-bold">{detail.datos_personales?.telefono || 'N/A'}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[3px]">Teléfono del hogar</div>
                <div className="text-[12px] text-[#222] font-bold">{detail.datos_personales?.telefono_hogar || 'N/A'}</div>
              </div>
              <div className="col-span-2 text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[3px]">Correo electrónico</div>
                <div className="text-[12px] text-[#222] font-bold">{detail.datos_personales?.correo_electronico || 'N/A'}</div>
              </div>
              <div className="col-span-2 text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[3px]">Dirección</div>
                <div className="text-[12px] text-[#222] font-bold">{detail.datos_personales?.direccion || 'N/A'}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[3px]">Sector / localidad</div>
                <div className="text-[12px] text-[#222] font-bold">{detail.datos_personales?.sector_localidad || 'N/A'}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[3px]">¿Tiene discapacidad?</div>
                <div className="text-[12px] text-[#222] font-bold">{formatBoolean(detail.datos_personales?.tiene_discapacidad)}</div>
              </div>
              <div className="col-span-2 text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[3px]">Observaciones</div>
                <div className="text-[12px] text-[#222] font-bold">{detail.datos_personales?.observaciones || 'Sin observaciones'}</div>
              </div>
              <div className="text-[12px]">
                <div className="text-[11px] text-gris-claro mb-[3px]">Estado de cuenta</div>
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
                <div className="text-[11px] text-gris-claro mb-[3px]">Fecha de registro</div>
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

        {/* PIN */}
        {activeTab === 'pin' && (
          <div className="text-center text-gris-claro p-[20px]">
            PIN - Funcionalidad pendiente (Implementación por Maximiliano)
          </div>
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
        <button className="bg-[#b52b2b] text-white border-none rounded-[3px] px-[14px] py-[7px] text-[12px] cursor-pointer font-bold hover:brightness-110"
          style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
          Dar de baja
        </button>
        <div className="flex gap-[8px]">
          <button className="bg-[#c49300] text-white border-none rounded-[3px] px-[14px] py-[7px] text-[12px] cursor-pointer font-bold hover:brightness-110"
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
            Cargar fondos
          </button>
          <button onClick={startEditing} className="bg-azul text-white border-none rounded-[3px] px-[14px] py-[7px] text-[12px] cursor-pointer font-bold hover:brightness-110"
            style={{ fontFamily: "'Exo 2', Arial, sans-serif" }}>
            Editar datos
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDetail;