// app/(comercio)/salir.jsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function SalirComercio() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>¿Deseas cerrar sesión en esta tienda?</Text>
      
      <TouchableOpacity 
        style={styles.boton} 
        onPress={() => router.replace('/')} // Nos devuelve al Login principal
      >
        <Text style={styles.botonTexto}>Sí, Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  texto: { fontSize: 18, marginBottom: 20 },
  boton: { backgroundColor: '#E74C3C', padding: 15, borderRadius: 10 },
  botonTexto: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});