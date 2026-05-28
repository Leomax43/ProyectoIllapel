import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useAuth } from '../hooks/useAuth';
import beneficiariesService from '../services/beneficiariesService';
import fondosService from '../services/fondosService';

const CargaFondosPage = ({ onNavigate }) => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [beneficiariosList, setBeneficiariosList] = useState([]);
  const [selectedBeneficiario, setSelectedBeneficiario] = useState(null);
  const [montoInput, setMontoInput] = useState('');
  const [tipoAyuda, setTipoAyuda] = useState('Seleccione...');
  const [observaciones, setObservaciones] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');

  // Datos ficticios para demo
  const beneficiarioDemo = {
    nombre: 'Rosa Martínez Ríos',
    rut: '12.345.678-9',
    ficha: 'FSH-2026-004',
    nucleo: 'Fam. Martínez #04',
    saldo_actual: 45000,
    estado: 'ACTIVO',
    historial: [
      { fecha: '2026-04-10', monto: 50000, tipo: 'Alimentación', pdf: 'doc-001.pdf' },
      { fecha: '2026-02-05', monto: 40000, tipo: 'Construcción', pdf: 'doc-002.pdf' },
      { fecha: '2025-11-18', monto: 35000, tipo: 'Alimentación', pdf: 'doc-003.pdf' }
    ],
    nucleo_info: [
      { integrante: 'Rosa Martínez Ríos', ultima_carga: '2026-04-10', monto: 50000, estado: 'Habilitado' },
      { integrante: 'Carlos Martínez', ultima_carga: '2026-04-10', monto: null, estado: 'Habilitado' }
    ]
  };

  // Búsqueda dinámica de beneficiarios
  useEffect(() => {
    if (searchTerm.trim()) {
      fetchBeneficiarios();
    } else {
      setBeneficiariosList([]);
    }
  }, [searchTerm]);

  const fetchBeneficiarios = async () => {
    setLoadingSearch(true);
    try {
      console.log('🔍 Buscando beneficiarios con:', searchTerm);
      const results = await beneficiariesService.search(searchTerm);
      console.log('✅ Resultados:', results);
      setBeneficiariosList(results);
    } catch (error) {
      console.error('❌ Error al buscar beneficiarios:', error);
      setMessage({ text: '❌ Error al buscar beneficiarios', type: 'error' });
      setBeneficiariosList([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSelectBeneficiario = async (beneficiario) => {
    setLoadingSearch(true);
    try {
      // Obtener detalle completo del beneficiario
      const detail = await beneficiariesService.getBeneficiaryDetail(beneficiario.rut_representante);
      setSelectedBeneficiario(detail);
      setBeneficiariosList([]);
      setSearchTerm('');
    } catch (error) {
      console.error('Error al obtener detalle del beneficiario:', error);
      setMessage({ text: '❌ Error al cargar detalle del beneficiario', type: 'error' });
    } finally {
      setLoadingSearch(false);
    }
  };

  const handlePdfChange = (file) => {
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setMessage({ text: '❌ Solo se aceptan archivos PDF', type: 'error' });
      return;
    }

    const maxSizeMB = 10;
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setMessage({ text: `❌ El archivo excede el tamaño máximo de ${maxSizeMB} MB`, type: 'error' });
      return;
    }

    setPdfFile(file);
    setPdfFileName(file.name);
    setMessage(null);
  };

  const handleFileInputChange = (e) => {
    handlePdfChange(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handlePdfChange(e.dataTransfer.files[0]);
  };

  const getNuevoSaldo = () => {
    if (selectedBeneficiario && montoInput) {
      return (selectedBeneficiario.datos_personales?.saldo || 0) + parseInt(montoInput || 0);
    }
    return selectedBeneficiario?.datos_personales?.saldo || 0;
  };

  const handleConfirmar = async () => {
    setLoading(true);
    setMessage(null);

    try {
      if (!selectedBeneficiario) {
        throw new Error('Debe seleccionar un beneficiario');
      }
      if (!montoInput) {
        throw new Error('Debe ingresar un monto');
      }
      if (tipoAyuda === 'Seleccione...') {
        throw new Error('Debe seleccionar un tipo de ayuda');
      }
      if (!pdfFile) {
        throw new Error('Debe adjuntar un PDF');
      }

      // Obtener id_admin del usuario autenticado
      const userStr = localStorage.getItem('illapel_token');
      if (!userStr) {
        throw new Error('No hay usuario autenticado');
      }
      const user = JSON.parse(userStr);
      const id_admin = user.id_admin;

      if (!id_admin) {
        throw new Error('No se encontró el ID del administrador');
      }

      // Llamar a la API para cargar fondos
      const id_familia = selectedBeneficiario.datos_personales?.id_familia;
      const monto = parseInt(montoInput);

      console.log('📤 Enviando carga de fondos:', {
        id_familia,
        id_admin,
        monto,
        archivo: pdfFile.name
      });

      const result = await fondosService.cargarFondos(id_familia, id_admin, monto, pdfFile);

      console.log('✅ Respuesta:', result);

      setMessage({ 
        text: `✅ Carga realizada exitosamente. Nuevo saldo: ${formatCurrency(result.nuevo_saldo || 0)}`, 
        type: 'success' 
      });

      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        setSearchTerm('');
        setSelectedBeneficiario(null);
        setMontoInput('');
        setTipoAyuda('Seleccione...');
        setObservaciones('');
        setPdfFile(null);
        setPdfFileName('');
        setMessage(null);
      }, 2000);
    } catch (error) {
      console.error('❌ Error:', error);
      setMessage({ text: `❌ Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onNavigate('dashboard');
  };

  const formatCurrency = (value) => `$${value.toLocaleString('es-CL')}`;
  const formatDate = (date) => new Date(date).toLocaleDateString('es-CL');

  // Estilos
  const mainStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#f5f5f2'
  };

  const contentStyle = {
    padding: '16px',
    flex: 1
  };

  const sectionTitleStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1a3a5c',
    marginBottom: '4px'
  };

  const sectionDescStyle = {
    fontSize: '12px',
    color: '#666',
    marginBottom: '16px'
  };

  const layoutStyle = {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '14px',
    alignItems: 'start'
  };

  const panelStyle = {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '14px'
  };

  const panelHeaderStyle = {
    background: '#2563a0',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 'bold',
    padding: '8px 14px'
  };

  const panelBodyStyle = {
    padding: '16px'
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '13px'
  };

  const labelStyle = {
    fontSize: '11px',
    color: '#444',
    fontWeight: 'bold'
  };

  const requiredStyle = {
    color: '#b52b2b'
  };

  const inputStyle = {
    border: '1px solid #ccc',
    borderRadius: '3px',
    padding: '7px 9px',
    fontSize: '12px',
    color: '#333',
    fontFamily: 'Arial, sans-serif'
  };

  const selectStyle = {
    border: '1px solid #ccc',
    borderRadius: '3px',
    padding: '7px 9px',
    fontSize: '12px',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
    background: '#fff'
  };

  const beneficiarioCardStyle = {
    background: '#e0edff',
    border: '1px solid #2563a0',
    borderRadius: '4px',
    padding: '12px 14px',
    marginTop: '4px'
  };

  const bcNameStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1a3a5c',
    marginBottom: '4px'
  };

  const badgeStyle = (estado) => ({
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: 'bold',
    display: 'inline-block',
    background: estado === 'Activo' || estado === 'Habilitado' ? '#d1e7dd' : '#f8d7da',
    color: estado === 'Activo' || estado === 'Habilitado' ? '#0f5132' : '#842029'
  });

  const alertStyle = (type) => ({
    background: type === 'ok' ? '#d1e7dd' : type === 'warn' ? '#fff3cd' : '#f8d7da',
    border: `1px solid ${type === 'ok' ? '#0f5132' : type === 'warn' ? '#ffc107' : '#b52b2b'}`,
    borderRadius: '3px',
    padding: '8px 12px',
    fontSize: '12px',
    color: type === 'ok' ? '#0f5132' : type === 'warn' ? '#856404' : '#842029',
    marginBottom: '14px'
  });

  const montoDisplayStyle = {
    background: '#f0f6ff',
    border: '2px solid #2563a0',
    borderRadius: '4px',
    padding: '12px 14px',
    textAlign: 'center',
    marginTop: '8px'
  };

  const montoLabelStyle = {
    fontSize: '11px',
    color: '#5580aa',
    marginBottom: '4px'
  };

  const montoValorStyle = {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#1a3a5c'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '11px',
    marginTop: '6px'
  };

  const thStyle = {
    background: '#e8f0f8',
    color: '#1a3a5c',
    padding: '5px 8px',
    textAlign: 'left',
    border: '1px solid #ddd'
  };

  const tdStyle = {
    padding: '5px 8px',
    border: '1px solid #eee',
    color: '#333'
  };

  const uploadAreaStyle = {
    border: '2px dashed #2563a0',
    borderRadius: '4px',
    padding: '16px',
    textAlign: 'center',
    background: '#f0f6ff',
    cursor: 'pointer',
    marginTop: '4px'
  };

  const btnRowStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '6px'
  };

  const btnCancelStyle = {
    background: '#fff',
    border: '1px solid #aaa',
    color: '#555',
    borderRadius: '3px',
    padding: '8px 20px',
    fontSize: '13px',
    cursor: 'pointer'
  };

  const btnSubmitStyle = {
    background: '#1e7a3e',
    border: 'none',
    color: '#fff',
    borderRadius: '3px',
    padding: '8px 22px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer'
  };

  const msgStyle = (type) => ({
    background: type === 'error' ? '#ffebee' : '#e8f5e9',
    border: `1px solid ${type === 'error' ? '#ffcdd2' : '#c8e6c9'}`,
    borderRadius: '3px',
    padding: '8px 12px',
    fontSize: '12px',
    color: type === 'error' ? '#c62828' : '#2e7d32',
    marginBottom: '14px'
  });

  return (
    <div style={mainStyle}>
      <DashboardHeader currentPage="fondos" onNavigate={onNavigate} />
      <div style={contentStyle}>
        <div style={sectionTitleStyle}>Carga de fondos</div>
        <div style={sectionDescStyle}>
          Asigne saldo a un beneficiario activo. El sistema verificará automáticamente la regla de los 30 días por núcleo familiar antes de confirmar la operación.
        </div>

        {message && (
          <div style={msgStyle(message.type)}>
            {message.text}
          </div>
        )}

        <div style={layoutStyle}>
          {/* Columna izquierda */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Panel 1: Buscar beneficiario */}
            <div style={panelStyle}>
              <div style={panelHeaderStyle}>1. Buscar beneficiario</div>
              <div style={panelBodyStyle}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Buscar por RUT o nombre <span style={requiredStyle}>*</span></label>
                  <input
                    type="text"
                    placeholder="Ej: 12.345.678-9 o Rosa Martínez..."
                    style={{ ...inputStyle, flex: 1 }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {loadingSearch && (
                    <div style={{ fontSize: '12px', color: '#2563a0', marginTop: '4px' }}>
                      Buscando...
                    </div>
                  )}
                </div>

                {/* Lista de resultados de búsqueda */}
                {beneficiariosList.length > 0 && (
                  <div style={{
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    maxHeight: '250px',
                    overflowY: 'auto',
                    marginTop: '4px'
                  }}>
                    <table style={{ ...tableStyle, margin: 0, marginTop: 0 }}>
                      <thead>
                        <tr>
                          <th style={thStyle}>Nombre</th>
                          <th style={thStyle}>RUT</th>
                          <th style={thStyle}>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {beneficiariosList.map((beneficiario) => (
                          <tr 
                            key={beneficiario.id_familia}
                            onClick={() => handleSelectBeneficiario(beneficiario)}
                            style={{
                              cursor: 'pointer',
                              transition: 'background-color 0.2s',
                              background: '#fff'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f0f6ff'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                          >
                            <td style={tdStyle}>{beneficiario.nombre_familia}</td>
                            <td style={tdStyle}>{beneficiario.rut_representante}</td>
                            <td style={tdStyle}>
                              <span style={badgeStyle(beneficiario.estado)}>{beneficiario.estado}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {searchTerm.trim() && !loadingSearch && beneficiariosList.length === 0 && (
                  <div style={{
                    padding: '12px',
                    background: '#fff3cd',
                    border: '1px solid #ffc107',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#856404',
                    marginTop: '4px'
                  }}>
                    No se encontraron beneficiarios con ese término
                  </div>
                )}

                {selectedBeneficiario && (
                  <div style={beneficiarioCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={bcNameStyle}>{selectedBeneficiario.datos_personales?.nombre_familia}</div>
                      <span style={badgeStyle(selectedBeneficiario.datos_personales?.estado)}>{selectedBeneficiario.datos_personales?.estado}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' }}>
                      <div style={{ fontSize: '11px' }}>
                        <span style={{ color: '#5580aa' }}>RUT: </span>
                        <span style={{ color: '#1a3a5c', fontWeight: 'bold' }}>{selectedBeneficiario.datos_personales?.rut_representante}</span>
                      </div>
                      <div style={{ fontSize: '11px' }}>
                        <span style={{ color: '#5580aa' }}>ID Familia: </span>
                        <span style={{ color: '#1a3a5c', fontWeight: 'bold' }}>{selectedBeneficiario.datos_personales?.id_familia}</span>
                      </div>
                      <div style={{ fontSize: '11px' }}>
                        <span style={{ color: '#5580aa' }}>Integrantes: </span>
                        <span style={{ color: '#1a3a5c', fontWeight: 'bold' }}>{selectedBeneficiario.nucleo_familiar?.length || 0}</span>
                      </div>
                      <div style={{ fontSize: '11px' }}>
                        <span style={{ color: '#5580aa' }}>Saldo actual: </span>
                        <span style={{ color: '#1a3a5c', fontWeight: 'bold' }}>
                          {formatCurrency(selectedBeneficiario.datos_personales?.saldo || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Panel 2: Validación familiar */}
            {selectedBeneficiario && (
              <div style={panelStyle}>
                <div style={panelHeaderStyle}>2. Validación familiar (regla 30 días)</div>
                <div style={panelBodyStyle}>
                  <div style={alertStyle('ok')}>
                    ✔ El núcleo familiar de {selectedBeneficiario.datos_personales?.nombre_familia} no ha recibido fondos en los últimos 30 días. La carga puede proceder.
                  </div>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Integrante</th>
                        <th style={thStyle}>RUT</th>
                        <th style={thStyle}>Relación</th>
                        <th style={thStyle}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBeneficiario.nucleo_familiar?.map((integrante, idx) => (
                        <tr key={idx}>
                          <td style={tdStyle}>{integrante.nombre}</td>
                          <td style={tdStyle}>{integrante.rut}</td>
                          <td style={tdStyle}>{integrante.rol_hogar || '—'}</td>
                          <td style={tdStyle}>
                            <span style={badgeStyle('Activo')}>Activo</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{
                    background: '#f9f9f9',
                    borderLeft: '3px solid #ffc107',
                    borderRadius: '0 3px 3px 0',
                    padding: '8px 12px',
                    fontSize: '11px',
                    color: '#555',
                    marginTop: '6px',
                    lineHeight: '1.6'
                  }}>
                    ℹ La carga se bloqueará si cualquier integrante del núcleo recibió fondos en los últimos 30 días (RF03).
                  </div>
                </div>
              </div>
            )}

            {/* Panel 3: Monto a asignar */}
            {selectedBeneficiario && (
              <div style={panelStyle}>
                <div style={panelHeaderStyle}>3. Monto a asignar</div>
                <div style={panelBodyStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Monto <span style={requiredStyle}>*</span></label>
                    <input
                      type="number"
                      placeholder="Ej: 50000"
                      style={inputStyle}
                      value={montoInput}
                      onChange={(e) => setMontoInput(e.target.value)}
                      min="1000"
                    />
                  </div>

                  <div style={fieldStyle}>
                    <label style={labelStyle}>Tipo de ayuda <span style={requiredStyle}>*</span></label>
                    <select
                      style={selectStyle}
                      value={tipoAyuda}
                      onChange={(e) => setTipoAyuda(e.target.value)}
                    >
                      <option>Seleccione...</option>
                      <option>Alimentación</option>
                      <option>Materiales de construcción</option>
                      <option>Útiles escolares</option>
                      <option>Otro</option>
                    </select>
                  </div>

                  <div style={fieldStyle}>
                    <label style={labelStyle}>Observaciones</label>
                    <textarea
                      placeholder="Información adicional sobre esta asignación..."
                      style={{
                        ...inputStyle,
                        resize: 'vertical',
                        minHeight: '55px',
                        fontFamily: 'Arial, sans-serif'
                      }}
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                    />
                  </div>

                  <div style={montoDisplayStyle}>
                    <div style={montoLabelStyle}>Nuevo saldo del beneficiario tras la carga</div>
                    <div style={montoValorStyle}>{formatCurrency(getNuevoSaldo())}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Panel 4: Documentación */}
            {selectedBeneficiario && (
              <div style={panelStyle}>
                <div style={panelHeaderStyle}>4. Documentación de respaldo</div>
                <div style={panelBodyStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Adjuntar resolución / solicitud en PDF <span style={requiredStyle}>*</span></label>
                    <input
                      id="pdfInput"
                      type="file"
                      accept="application/pdf"
                      style={{ display: 'none' }}
                      onChange={handleFileInputChange}
                    />
                    <div
                      style={uploadAreaStyle}
                      onDragOver={handleDragOver}
                      onDrop={handleDragDrop}
                      onClick={() => document.getElementById('pdfInput').click()}
                    >
                      <div style={{ fontSize: '26px', marginBottom: '8px' }}>📄</div>
                      {pdfFileName ? (
                        <>
                          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563a0', marginBottom: '4px' }}>
                            {pdfFileName}
                          </div>
                          <div style={{ fontSize: '11px', color: '#888' }}>Haz clic para cambiar</div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563a0' }}>Haga clic para adjuntar el PDF</div>
                          <div style={{ fontSize: '11px', color: '#888', marginTop: '3px' }}>o arrastre el archivo aquí</div>
                          <div style={{ fontSize: '11px', color: '#b52b2b', marginTop: '5px' }}>* Obligatorio · Solo .PDF · Máximo 10 MB</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Historial del beneficiario */}
            {selectedBeneficiario && (
              <div style={panelStyle}>
                <div style={panelHeaderStyle}>Historial de cargas del beneficiario</div>
                <div style={{ padding: '12px' }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Fecha</th>
                        <th style={thStyle}>Monto</th>
                        <th style={thStyle}>Tipo</th>
                        <th style={thStyle}>PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBeneficiario.historial_cargas?.map((item, idx) => (
                        <tr key={idx}>
                          <td style={tdStyle}>{formatDate(item.fecha)}</td>
                          <td style={tdStyle}>{formatCurrency(item.monto)}</td>
                          <td style={tdStyle}>{item.tipo}</td>
                          <td style={{ ...tdStyle, color: '#2563a0', cursor: 'pointer' }}>📄 Ver</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Resumen de operación */}
            {selectedBeneficiario && (
              <div style={panelStyle}>
                <div style={{ ...panelHeaderStyle, background: '#1e7a3e' }}>Resumen de la operación</div>
                <div style={panelBodyStyle}>
                  <table style={tableStyle}>
                    <tbody>
                      <tr>
                        <td style={{ ...tdStyle, color: '#888' }}>Beneficiario</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>{selectedBeneficiario.datos_personales?.nombre_familia}</td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyle, color: '#888' }}>Núcleo familiar</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>ID {selectedBeneficiario.datos_personales?.id_familia}</td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyle, color: '#888' }}>Saldo actual</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>{formatCurrency(selectedBeneficiario.datos_personales?.saldo || 0)}</td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyle, color: '#888' }}>Monto a cargar</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold', color: '#1e7a3e' }}>
                          + {montoInput ? formatCurrency(parseInt(montoInput)) : '$0'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyle, color: '#888' }}>Saldo resultante</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold', color: '#1a3a5c', fontSize: '14px' }}>
                          {formatCurrency(getNuevoSaldo())}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyle, color: '#888' }}>PDF adjunto</td>
                        <td style={{ ...tdStyle, color: pdfFileName ? '#2e7d32' : '#b52b2b' }}>
                          {pdfFileName ? '✓ ' + pdfFileName : 'Pendiente'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={btnRowStyle} style={{ marginTop: '14px' }}>
                    <button
                      style={btnCancelStyle}
                      onClick={handleCancel}
                      disabled={loading}
                      onMouseEnter={(e) => { if (!loading) e.target.style.background = '#f5f5f5'; }}
                      onMouseLeave={(e) => { if (!loading) e.target.style.background = '#fff'; }}
                    >
                      Cancelar
                    </button>
                    <button
                      style={btnSubmitStyle}
                      onClick={handleConfirmar}
                      disabled={loading}
                      onMouseEnter={(e) => { if (!loading) e.target.style.background = '#157a3e'; }}
                      onMouseLeave={(e) => { if (!loading) e.target.style.background = '#1e7a3e'; }}
                    >
                      {loading ? 'Procesando...' : 'Confirmar carga →'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CargaFondosPage;
