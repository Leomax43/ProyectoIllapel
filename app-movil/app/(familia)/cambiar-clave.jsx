import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { API_URL } from '../../src/config/api';
import { useUsuario } from '../../src/context/UsuarioContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORES } from '../../src/config/colores';
import FondoPantalla from '../../src/components/FondoPantalla';
import AnimacionEntrada from '../../src/components/AnimacionEntrada';
import BotonGradiente from '../../src/components/BotonGradiente';

export default function CambiarClaveScreen() {
  const { usuario } = useUsuario();
  const [claveActual, setClaveActual] = useState('');
  const [nuevaClave, setNuevaClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [cargando, setCargando] = useState(false);
  const [focoActual, setFocoActual] = useState(false);
  const [focoNueva, setFocoNueva] = useState(false);
  const [focoConfirmar, setFocoConfirmar] = useState(false);

  const esFamilia = usuario?.rol === 'FAMILIA';
  const colorTema = esFamilia ? COLORES.azul : COLORES.verde;

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
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', data.mensaje);
      }
    } catch {
      Alert.alert('Error de Red', 'No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  const inputBox = (enfocado) => [
    styles.inputBox,
    enfocado && { borderColor: COLORES.celeste, backgroundColor: '#FFFFFF' }
  ];

  return (
    <FondoPantalla>
      <View style={styles.container}>
        <AnimacionEntrada>
          <Text style={[styles.titulo, { color: colorTema }]}>Seguridad</Text>
          <Text style={styles.subtitulo}>Ingresa tu contraseña actual y la nueva contraseña que deseas utilizar.</Text>
        </AnimacionEntrada>

        <AnimacionEntrada delay={80}>
          <View style={inputBox(focoActual)}>
            <Ionicons name="key-outline" size={20} color={focoActual ? colorTema : COLORES.grisClaro} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña Actual"
              secureTextEntry
              value={claveActual}
              onChangeText={setClaveActual}
              onFocus={() => setFocoActual(true)}
              onBlur={() => setFocoActual(false)}
            />
          </View>
        </AnimacionEntrada>

        <AnimacionEntrada delay={150}>
          <View style={inputBox(focoNueva)}>
            <Ionicons name="lock-closed-outline" size={20} color={focoNueva ? colorTema : COLORES.grisClaro} />
            <TextInput
              style={styles.input}
              placeholder="Nueva Contraseña"
              secureTextEntry
              value={nuevaClave}
              onChangeText={setNuevaClave}
              onFocus={() => setFocoNueva(true)}
              onBlur={() => setFocoNueva(false)}
            />
          </View>
        </AnimacionEntrada>

        <AnimacionEntrada delay={220}>
          <View style={inputBox(focoConfirmar)}>
            <Ionicons name="checkmark-circle-outline" size={20} color={focoConfirmar ? colorTema : COLORES.grisClaro} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar Nueva Contraseña"
              secureTextEntry
              value={confirmarClave}
              onChangeText={setConfirmarClave}
              onFocus={() => setFocoConfirmar(true)}
              onBlur={() => setFocoConfirmar(false)}
            />
          </View>
        </AnimacionEntrada>

        <AnimacionEntrada delay={290}>
          <BotonGradiente
            titulo="Guardar Contraseña"
            colors={[colorTema, COLORES.celeste]}
            onPress={handleCambiarClave}
            cargando={cargando}
            icon={<Ionicons name="shield-checkmark-outline" size={20} color="#FFFFFF" />}
          />
        </AnimacionEntrada>
      </View>
    </FondoPantalla>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, marginTop: 20 },
  subtitulo: { fontSize: 15, color: COLORES.grisMedio, marginBottom: 26, lineHeight: 22 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F8FA',
    borderRadius: 14,
    marginBottom: 14,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  input: { flex: 1, fontSize: 16, color: COLORES.grisOscuro, marginLeft: 12, outlineWidth: 0, outlineStyle: 'none' },
});
