import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { API_URL } from '../../src/config/api';
import { useUsuario } from '../../src/context/UsuarioContext';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';

export default function PagarScreen() {
  const { usuario } = useUsuario();
  const idFamilia = usuario?.id_familia;
  const nombreFamilia = usuario?.nombre_familia || '';
  
  const [qrToken, setQrToken] = useState(null);
  const [cargando, setCargando] = useState(false); // Inicia en false para mostrar el botón primero

  // Función que pide el QR de 5 minutos al backend
  const generarNuevoQR = async () => {
    setCargando(true);
    try {
      const response = await fetch(`${API_URL}/movil/familia/${idFamilia}/generar-qr`);
      const data = await response.json();
      
      if (response.ok) {
        setQrToken(data.qr_data); // El JWT seguro
      } else {
        Alert.alert("Error", data.mensaje || "No se pudo generar el código");
      }
    } catch (error) {
      Alert.alert("Error de Conexión", "No se pudo comunicar con el servidor municipal.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con colores de Illapel */}
      <View style={styles.header}>
        <Text style={styles.title}>Billetera Digital</Text>
        <Text style={styles.subtitle}>{nombreFamilia}</Text>
      </View>

      <View style={styles.qrCard}>
        
        {/* LÓGICA CONDICIONAL: Si no hay QR y no está cargando, mostramos el botón inicial */}
        {!qrToken && !cargando ? (
          <View style={styles.initialContainer}>
            <Ionicons name="qr-code" size={80} color="#005B8F" style={{ marginBottom: 20 }} />
            <Text style={styles.instruccionesIniciales}>
              Cuando estés en la caja listo para pagar, genera tu código seguro.
            </Text>
            
            <TouchableOpacity style={styles.generateButton} onPress={generarNuevoQR}>
              <Text style={styles.generateButtonText}>Generar código de pago</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Si ya se presionó el botón, mostramos el cargando o el QR */
          <>
            <Text style={styles.instrucciones}>
              Muestra este código al comerciante para pagar.
            </Text>

            <View style={styles.qrContainer}>
              {cargando ? (
                <ActivityIndicator size="large" color="#005B8F" />
              ) : qrToken ? (
                <QRCode
                  value={qrToken}
                  size={220}
                  color="#002B49" 
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

            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={generarNuevoQR}
              disabled={cargando}
            >
              <Ionicons name="refresh" size={20} color="#005B8F" style={{ marginRight: 8 }} />
              <Text style={styles.refreshText}>Generar nuevo código</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F0F4F8',
    alignItems: 'center' 
  },
  header: {
    width: '100%',
    backgroundColor: '#005B8F',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 5,
    borderBottomColor: '#F2A900',
    alignItems: 'center',
    marginBottom: 30
  },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#E1F0FF' },
  qrCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 400, // Ayuda a que la tarjeta no cambie drásticamente de tamaño
    justifyContent: 'center'
  },
  initialContainer: {
    alignItems: 'center',
    width: '100%'
  },
  instruccionesIniciales: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24
  },
  generateButton: {
    backgroundColor: '#005B8F',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  instrucciones: {
    fontSize: 15,
    color: '#333',
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
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 20,
    padding: 10
  },
  errorText: { color: '#D32F2F', fontWeight: 'bold' },
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
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#005B8F',
    backgroundColor: 'transparent'
  },
  refreshText: {
    color: '#005B8F',
    fontWeight: 'bold',
    fontSize: 15
  }
});