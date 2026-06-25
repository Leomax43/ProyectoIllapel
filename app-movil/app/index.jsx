import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { API_URL } from '../src/config/api';


export default function LoginScreen() {
  const [rut, setRut] = useState('');
  const [clave, setClave] = useState('');

  const handleLogin = async () => {
    if (!rut || !clave) {
      Alert.alert("Error", "Por favor ingresa RUT y clave.");
      return;
    }

    try {
      // Usamos tu IP local apuntando al puerto 3000 de Node.js
      const response = await fetch(`${API_URL}/movil/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut: rut, clave: clave })
      });

      const data = await response.json();

      if (response.ok) {
        // Login exitoso: Viajamos a la pestaña de Pagar enviando el nombre Y EL ID
        router.replace({
          pathname: '/(tabs)/pagar',
          params: { 
            nombreFamilia: data.usuario.nombre_familia,
            idFamilia: data.usuario.id_familia // <-- ¡NUEVO! Pasamos el ID
          }
        });
      } else {
        // Si la cuenta está pendiente, o la clave (bcrypt) falla, mostramos tu mensaje del backend
        Alert.alert("Acceso Denegado", data.mensaje);
      }
    } catch (error) {
      Alert.alert("Error de Red", "No se pudo conectar con el servidor. Revisa que Node.js esté corriendo.");
      console.log(error);
    }
  };

  // ... (El return y los styles quedan exactamente igual que antes)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoTitle}>Billetera</Text>
        <Text style={styles.logoSubtitle}>ILLAPEL</Text>
      </View>

      <Text style={styles.loginText}>Iniciar Sesión</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="RUT"
          placeholderTextColor="#ccc"
          value={rut}
          onChangeText={setRut}
          keyboardType="default"
        />
        <TextInput
          style={styles.input}
          placeholder="Clave Web"
          placeholderTextColor="#ccc"
          value={clave}
          onChangeText={setClave}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#5D2A7B', justifyContent: 'center', alignItems: 'center' },
  logoContainer: { marginBottom: 50, alignItems: 'center' },
  logoTitle: { fontSize: 36, fontWeight: 'bold', color: 'white' },
  logoSubtitle: { fontSize: 24, color: 'white', backgroundColor: '#D32F2F', paddingHorizontal: 10, borderRadius: 20, marginTop: 5 },
  loginText: { fontSize: 24, color: 'white', marginBottom: 20 },
  inputContainer: { width: '80%' },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 15,
    marginTop: 10,
    alignItems: 'center'
  },
  buttonText: { color: '#5D2A7B', fontSize: 18, fontWeight: 'bold' }
});