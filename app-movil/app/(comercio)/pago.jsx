import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { API_URL } from '../../src/config/api';
import { useUsuario } from '../../src/context/UsuarioContext';

export default function PagoComercioScreen() {
  const { usuario } = useUsuario();
  const rutComercio = usuario?.rut_comercio;
  const [escaneando, setEscaneando] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [tienePermiso, setTienePermiso] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setTienePermiso(status === 'granted');
    })();
  }, []);

  const solicitarPermisoCamara = async () => {
    if (!tienePermiso) {
      Alert.alert('Permiso denegado', 'Necesitas permitir el acceso a la cámara para escanear códigos QR.');
      return false;
    }
    return true;
  };

  const iniciarEscaneo = async () => {
    const tienePermiso = await solicitarPermisoCamara();
    if (tienePermiso) {
      setEscaneando(true);
    }
  };

  const handleQRCodeScanned = async (data) => {
    if (procesando) return;
    
    setEscaneando(false);
    setProcesando(true);

    try {
      // El QR contiene un token JWT como: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
      const qrToken = data?.data || data;
      
      if (!qrToken || typeof qrToken !== 'string') {
        Alert.alert('Error', 'Código QR inválido');
        return;
      }

      // Enviar el token al backend para procesar el cobro
      const response = await fetch(`${API_URL}/transacciones/comprar-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rut_comercio: rutComercio || '77777777-7',
          monto: 5000,
          qr_token: qrToken
        })
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          '✅ Cobro Exitoso',
          `Monto: $${Number(result.monto).toLocaleString('es-CL')}\nSaldo restante del cliente: $${Number(result.saldo_restante).toLocaleString('es-CL')}`
        );
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

  if (escaneando) {
    return (
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          type={CameraType.back}
          onBarCodeScanned={procesando ? undefined : handleQRCodeScanned}
          barCodeScannerSettings={{
            barCodeTypes: ['qr'],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea} />
            <Text style={styles.scanText}>Apunta al código QR del cliente</Text>
          </View>
        </Camera>
      </View>
    );
  }

  if (procesando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#27AE60" />
        <Text style={styles.texto}>Procesando pago...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cobrar con QR</Text>
      <Text style={styles.subtitulo}>Escanea el código QR del cliente para cobrar</Text>

      <TouchableOpacity style={styles.scanButton} onPress={iniciarEscaneo}>
        <Text style={styles.scanIcon}>📷</Text>
        <Text style={styles.scanText}>Escanear QR</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>⚠️ Asegúrate de que el cliente tenga saldo suficiente antes de escanear.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5F5E3',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27AE60',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#2D3436',
    marginBottom: 40,
    textAlign: 'center',
  },
  scanButton: {
    width: 200,
    height: 200,
    backgroundColor: '#27AE60',
    borderRadius: 100,
    borderWidth: 8,
    borderColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  scanIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  scanText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 30,
    maxWidth: 300,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  texto: {
    marginTop: 10,
    color: '#666',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
});