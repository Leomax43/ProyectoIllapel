import { View, Text, StyleSheet, ActivityIndicator, Alert, Animated } from 'react-native';
import { useState } from 'react';
import { API_URL } from '../../src/config/api';
import { useUsuario } from '../../src/context/UsuarioContext';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { COLORES } from '../../src/config/colores';
import FondoPantalla from '../../src/components/FondoPantalla';
import GradienteHeader from '../../src/components/GradienteHeader';
import BotonGradiente from '../../src/components/BotonGradiente';
import AnimacionEntrada from '../../src/components/AnimacionEntrada';
import { useFloatAnimacion } from '../../src/components/useFloatAnimacion';

export default function PagarScreen() {
  const { usuario } = useUsuario();
  const idFamilia = usuario?.id_familia;
  const nombreFamilia = usuario?.nombre_familia || '';

  const [qrToken, setQrToken] = useState(null);
  const [cargando, setCargando] = useState(false);

  const floatY = useFloatAnimacion();

  const generarNuevoQR = async () => {
    setCargando(true);
    try {
      const response = await fetch(`${API_URL}/movil/familia/${idFamilia}/generar-qr`);
      const data = await response.json();

      if (response.ok) {
        setQrToken(data.qr_data);
      } else {
        Alert.alert('Error', data.mensaje || 'No se pudo generar el código');
      }
    } catch {
      Alert.alert('Error de Conexión', 'No se pudo comunicar con el servidor municipal.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <FondoPantalla>
      <GradienteHeader titulo="Billetera Digital" subtitulo={nombreFamilia} colors={[COLORES.azul, COLORES.celeste]} />

      <AnimacionEntrada style={styles.card}>
        {!qrToken && !cargando ? (
          <View style={styles.initialContainer}>
            <Animated.View style={{ transform: [{ translateY: floatY }] }}>
              <Ionicons name="qr-code" size={80} color={COLORES.azul} style={{ marginBottom: 20 }} />
            </Animated.View>
            <Text style={styles.instruccionesIniciales}>
              Cuando estés en la caja listo para pagar, genera tu código seguro.
            </Text>

            <BotonGradiente
              titulo="Generar código de pago"
              colors={[COLORES.azul, COLORES.celeste]}
              onPress={generarNuevoQR}
            />
          </View>
        ) : (
          <>
            <Text style={styles.instrucciones}>
              Muestra este código al comerciante para pagar.
            </Text>

            <View style={styles.qrContainer}>
              {cargando ? (
                <ActivityIndicator size="large" color={COLORES.azul} />
              ) : qrToken ? (
                <QRCode
                  value={qrToken}
                  size={220}
                  color={COLORES.azul}
                  backgroundColor="white"
                />
              ) : (
                <Text style={styles.errorText}>No se pudo cargar el QR</Text>
              )}
            </View>

            <View style={styles.alertaContainer}>
              <Ionicons name="time-outline" size={20} color="#B8860B" />
              <Text style={styles.alertaTexto}>
                Por seguridad, este código expira en 5 minutos.
              </Text>
            </View>

            <BotonGradiente
              titulo="Generar nuevo código"
              colors={[COLORES.azul, COLORES.celeste]}
              onPress={generarNuevoQR}
              cargando={cargando}
            />
          </>
        )}
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
    minHeight: 400,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  initialContainer: {
    alignItems: 'center',
    width: '100%'
  },
  instruccionesIniciales: {
    fontSize: 16,
    color: COLORES.grisMedio,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24
  },
  instrucciones: {
    fontSize: 15,
    color: COLORES.grisOscuro,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500'
  },
  qrContainer: {
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORES.celeste,
    borderRadius: 12,
    marginBottom: 20,
    padding: 10
  },
  errorText: { color: COLORES.rojo, fontWeight: 'bold' },
  alertaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20
  },
  alertaTexto: {
    fontSize: 12,
    color: '#B8860B',
    marginLeft: 6,
    flexShrink: 1
  }
});
