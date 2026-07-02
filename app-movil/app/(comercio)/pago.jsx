import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { API_URL } from '../../src/config/api';
import { useUsuario } from '../../src/context/UsuarioContext';

export default function PagoComercioScreen() {
  const { usuario } = useUsuario();
  const rutComercio = usuario?.rut_comercio;
  
  const [montoCobro, setMontoCobro] = useState(''); // <-- Nuevo estado para el monto
  const [escaneando, setEscaneando] = useState(false);
  const [procesando, setProcesando] = useState(false);
  
  const [permission, requestPermission] = useCameraPermissions();

  const iniciarEscaneo = async () => {
    // 1. Validar que el monto sea un número válido y mayor a 0
    const montoNumerico = parseInt(montoCobro.replace(/\D/g, ''), 10);
    if (!montoNumerico || montoNumerico <= 0) {
      Alert.alert('Monto Inválido', 'Por favor, ingresa un monto mayor a $0 para cobrar.');
      return;
    }

    // 2. Pedir permisos de cámara
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permiso denegado', 'Necesitas permitir el acceso a la cámara.');
        return;
      }
    }
    
    // 3. Iniciar cámara
    setEscaneando(true);
  };

  const handleQRCodeScanned = async (data) => {
    if (procesando) return;
    
    setEscaneando(false);
    setProcesando(true);

    try {
      const qrToken = data?.data || data;
      
      if (!qrToken || typeof qrToken !== 'string') {
        Alert.alert('Error', 'Código QR inválido');
        setProcesando(false);
        return;
      }

      // Convertir el texto ingresado a un número entero limpio
      const montoFinal = parseInt(montoCobro.replace(/\D/g, ''), 10);

      const response = await fetch(`${API_URL}/transacciones/comprar-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rut_comercio: rutComercio || '77777777-7',
          monto: montoFinal, // <-- Aquí enviamos el monto dinámico
          qr_token: qrToken
        })
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          '✅ Cobro Exitoso',
          `Monto: $${Number(result.monto_cobrado || montoFinal).toLocaleString('es-CL')}\nSaldo restante del cliente: $${Number(result.saldo_restante).toLocaleString('es-CL')}`
        );
        setMontoCobro(''); // Limpiamos el campo después de un cobro exitoso
      } else {
        Alert.alert('❌ Cobro Rechazado', result.mensaje || 'No se pudo procesar el pago');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
      console.error(error);
    } finally {
      setProcesando(false);
    }
  };

  // VISTA 1: LA CÁMARA
  if (escaneando) {
    return (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={procesando ? undefined : handleQRCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea} />
            <Text style={styles.scanText}>Apunta al código QR del cliente</Text>
            
            {/* Botón para cancelar el escaneo */}
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEscaneando(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  // VISTA 2: PROCESANDO EL PAGO
  if (procesando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#27AE60" />
        <Text style={styles.texto}>Procesando pago de ${Number(montoCobro).toLocaleString('es-CL')}...</Text>
      </View>
    );
  }

  // VISTA 3: PANTALLA PRINCIPAL DE COBRO
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cobrar con QR</Text>
      <Text style={styles.subtitulo}>Ingresa el monto de la compra</Text>

      {/* NUEVO CONTENEDOR DEL INPUT DE MONTO */}
      <View style={styles.inputContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          style={styles.montoInput}
          placeholder="0"
          placeholderTextColor="#999"
          keyboardType="numeric" // Muestra el teclado numérico
          value={montoCobro}
          onChangeText={setMontoCobro}
          maxLength={7} // Evita cobros absurdamente grandes (máx 9,999,999)
        />
      </View>

      <TouchableOpacity style={styles.scanButton} onPress={iniciarEscaneo}>
        <Text style={styles.scanIcon}>📷</Text>
        <Text style={styles.scanText}>Escanear QR</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>⚠️ Ingresa el valor exacto antes de escanear el dispositivo del beneficiario.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D5F5E3', justifyContent: 'center', alignItems: 'center', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#27AE60', marginBottom: 8 },
  subtitulo: { fontSize: 16, color: '#2D3436', marginBottom: 20, textAlign: 'center' },
  
  // Estilos nuevos para el input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 40,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currencySymbol: { fontSize: 36, fontWeight: 'bold', color: '#27AE60', marginRight: 10 },
  montoInput: { flex: 1, fontSize: 36, fontWeight: 'bold', color: '#333' },

  scanButton: { width: 200, height: 200, backgroundColor: '#27AE60', borderRadius: 100, borderWidth: 8, borderColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  scanIcon: { fontSize: 60, marginBottom: 10 },
  scanText: { fontSize: 22, color: 'white', fontWeight: 'bold' },
  infoBox: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginTop: 40, maxWidth: 300 },
  infoText: { fontSize: 13, color: '#666', textAlign: 'center' },
  texto: { marginTop: 10, color: '#666', fontSize: 16, fontWeight: '500' },
  camera: { width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  scanArea: { width: 250, height: 250, borderWidth: 3, borderColor: 'white', borderRadius: 20, backgroundColor: 'transparent' },
  scanText: { color: 'white', fontSize: 16, marginTop: 20, fontWeight: 'bold' },
  cancelButton: { marginTop: 40, padding: 15, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10 },
  cancelText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});