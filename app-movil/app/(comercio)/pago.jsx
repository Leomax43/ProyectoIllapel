import { View, Text, StyleSheet, Alert, ActivityIndicator, TextInput, Animated, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { API_URL } from '../../src/config/api';
import { useUsuario } from '../../src/context/UsuarioContext';
import { Ionicons } from '@expo/vector-icons';
import { COLORES } from '../../src/config/colores';
import FondoPantalla from '../../src/components/FondoPantalla';
import GradienteHeader from '../../src/components/GradienteHeader';
import BotonGradiente from '../../src/components/BotonGradiente';
import AnimacionEntrada from '../../src/components/AnimacionEntrada';
import { useFloatAnimacion } from '../../src/components/useFloatAnimacion';

export default function PagoComercioScreen() {
  const { usuario } = useUsuario();
  const rutComercio = usuario?.rut_comercio;
  const nombreComercio = usuario?.nombre_comercio || '';

  const [montoCobro, setMontoCobro] = useState('');
  const [escaneando, setEscaneando] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  const floatY = useFloatAnimacion();

  const iniciarEscaneo = async () => {
    const montoNumerico = parseInt(montoCobro.replace(/\D/g, ''), 10);
    if (!montoNumerico || montoNumerico <= 0) {
      Alert.alert('Monto Inválido', 'Por favor, ingresa un monto mayor a $0 para cobrar.');
      return;
    }

    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permiso denegado', 'Necesitas permitir el acceso a la cámara.');
        return;
      }
    }

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

      const montoFinal = parseInt(montoCobro.replace(/\D/g, ''), 10);

      const response = await fetch(`${API_URL}/transacciones/comprar-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rut_comercio: rutComercio || '77777777-7',
          monto: montoFinal,
          qr_token: qrToken
        })
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          'Cobro Exitoso',
          `Monto: $${Number(result.monto_cobrado || montoFinal).toLocaleString('es-CL')}\nSaldo restante del cliente: $${Number(result.saldo_restante).toLocaleString('es-CL')}`
        );
        setMontoCobro('');
      } else {
        Alert.alert('Cobro Rechazado', result.mensaje || 'No se pudo procesar el pago');
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
      <View style={styles.containerCamara}>
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
      <View style={styles.containerCamara}>
        <ActivityIndicator size="large" color={COLORES.verde} />
        <Text style={styles.texto}>Procesando pago de ${Number(montoCobro).toLocaleString('es-CL')}...</Text>
      </View>
    );
  }

  // VISTA 3: PANTALLA PRINCIPAL DE COBRO
  return (
    <FondoPantalla color={COLORES.verdeClaro}>
      <GradienteHeader titulo="Cobrar con QR" subtitulo={nombreComercio} colors={[COLORES.verde, COLORES.verdeClaro]} />

      <AnimacionEntrada style={styles.card}>
        <Animated.View style={{ transform: [{ translateY: floatY }] }}>
          <Ionicons name="scan-outline" size={80} color={COLORES.verde} style={{ marginBottom: 20 }} />
        </Animated.View>

        <Text style={styles.instrucciones}>
          Ingresa el monto de la compra y escanea el código QR de la billetera del beneficiario.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.montoInput}
            placeholder="0"
            placeholderTextColor={COLORES.grisClaro}
            keyboardType="numeric"
            value={montoCobro}
            onChangeText={setMontoCobro}
            maxLength={7}
          />
        </View>

        <BotonGradiente
          titulo="Escanear QR"
          colors={[COLORES.verde, COLORES.verdeClaro]}
          onPress={iniciarEscaneo}
          icon={<Ionicons name="scan-outline" size={20} color="#FFFFFF" />}
        />

        <View style={styles.infoBox}>
          <Ionicons name="warning-outline" size={18} color="#B8860B" />
          <Text style={styles.infoText}>
            Ingresa el valor exacto antes de escanear el dispositivo del beneficiario.
          </Text>
        </View>
      </AnimacionEntrada>
    </FondoPantalla>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  instrucciones: {
    fontSize: 15,
    color: COLORES.grisMedio,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 23
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORES.verdeClaro,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
    marginBottom: 24,
    backgroundColor: '#F4F8FA'
  },
  currencySymbol: { fontSize: 28, fontWeight: 'bold', color: COLORES.verde, marginRight: 8 },
  montoInput: { flex: 1, fontSize: 28, fontWeight: 'bold', color: COLORES.grisOscuro, outlineWidth: 0, outlineStyle: 'none' },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 20
  },
  infoText: {
    fontSize: 12,
    color: '#B8860B',
    marginLeft: 6,
    flexShrink: 1
  },
  texto: { marginTop: 10, color: COLORES.grisMedio, fontSize: 16, fontWeight: '500' },
  containerCamara: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  camera: { width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  scanArea: { width: 250, height: 250, borderWidth: 3, borderColor: '#FFFFFF', borderRadius: 20, backgroundColor: 'transparent' },
  scanText: { color: '#FFFFFF', fontSize: 16, marginTop: 20, fontWeight: 'bold' },
  cancelButton: { marginTop: 40, padding: 15, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10 },
  cancelText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
