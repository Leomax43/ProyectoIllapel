import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { API_URL } from '../src/config/api';
import { useUsuario } from '../src/context/UsuarioContext';

export default function LoginScreen() {
  const { usuario } = useUsuario();
  const [rut, setRut] = useState('');
  const [clave, setClave] = useState('');
  const { setUsuario } = useUsuario();

  const handleLogin = async () => {
    if (!rut || !clave) {
      Alert.alert("Error", "Por favor ingresa RUT y clave.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/movil/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut: rut, clave: clave })
      });

      const data = await response.json();

      if (response.ok) {
        const usuario = data.usuario;
        setUsuario(usuario);

        // EL SEMÁFORO: Redirigimos según el rol que envíe el backend
        if (usuario.rol === 'FAMILIA') {
          router.replace('/(familia)/pagar');
        } else if (usuario.rol === 'COMERCIO') {
          router.replace('/(comercio)/pago');
        } else {
          Alert.alert("Error", "Rol no reconocido por el sistema.");
        }
        
      } else {
        Alert.alert("Acceso Denegado", data.mensaje);
      }
    } catch (error) {
      Alert.alert("Error de Red", "No se pudo conectar con el servidor municipal.");
      console.log(error);
    }
  };

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
  container: { flex: 1, backgroundColor: '#005B8F', justifyContent: 'center', alignItems: 'center' },
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