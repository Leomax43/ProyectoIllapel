import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { API_URL } from '../../src/config/api';
import { useUsuario } from '../../src/context/UsuarioContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CambiarClaveScreen() {
  const { usuario } = useUsuario();
  const [claveActual, setClaveActual] = useState('');
  const [nuevaClave, setNuevaClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [cargando, setCargando] = useState(false);

  const esFamilia = usuario?.rol === 'FAMILIA';
  const colorTema = esFamilia ? '#5D2A7B' : '#27AE60';

  const handleCambiarClave = async () => {
    if (!claveActual || !nuevaClave || !confirmarClave) {
      Alert.alert('Campos vacíos', 'Por favor, completa todos los campos.');
      return;
    }
    if (nuevaClave !== confirmarClave) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden.');
      return;
    }

    setCargando(true);
    try {
      const rut = esFamilia ? usuario.rut_representante : usuario.rut_comercio;
      
      const response = await fetch(`${API_URL}/movil/cambiar-clave`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut, rol: usuario.rol, clave_actual: claveActual, nueva_clave: nuevaClave })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('¡Éxito!', data.mensaje, [
          { text: 'OK', onPress: () => router.back() } // Vuelve a la pantalla de Cuenta
        ]);
      } else {
        Alert.alert('Error', data.mensaje);
      }
    } catch (error) {
      Alert.alert('Error de Red', 'No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.titulo, { color: colorTema }]}>Seguridad</Text>
      <Text style={styles.subtitulo}>Ingresa tu contraseña actual y la nueva contraseña que deseas utilizar.</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="key-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña Actual"
          secureTextEntry
          value={claveActual}
          onChangeText={setClaveActual}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nueva Contraseña"
          secureTextEntry
          value={nuevaClave}
          onChangeText={setNuevaClave}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Nueva Contraseña"
          secureTextEntry
          value={confirmarClave}
          onChangeText={setConfirmarClave}
        />
      </View>

      <TouchableOpacity 
        style={[styles.botonGuardar, { backgroundColor: colorTema }]} 
        onPress={handleCambiarClave}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.textoBoton}>Guardar Contraseña</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 20 },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, marginTop: 20 },
  subtitulo: { fontSize: 15, color: '#666', marginBottom: 30, lineHeight: 22 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 55,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  botonGuardar: {
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  textoBoton: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});