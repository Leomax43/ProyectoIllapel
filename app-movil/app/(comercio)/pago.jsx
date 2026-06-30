// app/(comercio)/pago.jsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PagoComercioScreen() {
  
  const iniciarEscaneo = () => {
    // Por ahora es un placeholder. ¡Aquí irá la lógica de la cámara!
    console.log("¡Activando cámara para leer el QR de la familia!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Tienda</Text>
      <Text style={styles.subtitle}>Presiona para escanear el QR del cliente</Text>

      <TouchableOpacity style={styles.scanButton} onPress={iniciarEscaneo}>
        <Ionicons name="camera" size={60} color="white" style={styles.icon} />
        <Text style={styles.scanText}>Escanear</Text>
      </TouchableOpacity>
    </View>
  );
}

// Necesitamos importar el icono de cámara aquí arriba
import { Ionicons } from '@expo/vector-icons'; 

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#D5F5E3', // Fondo verde muy claro
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#27AE60', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#2D3436', marginBottom: 40 },
  scanButton: {
    width: 200,
    height: 200,
    backgroundColor: '#27AE60', // Verde vibrante
    borderRadius: 100, // Círculo
    borderWidth: 8,
    borderColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  icon: { marginBottom: 10 },
  scanText: { fontSize: 22, color: 'white', fontWeight: 'bold' }
});