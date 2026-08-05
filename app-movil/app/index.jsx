import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
  Alert, ActivityIndicator, Animated, Image
} from 'react-native';
import { router } from 'expo-router';
import { API_URL } from '../src/config/api';
import { useUsuario } from '../src/context/UsuarioContext';
import { Ionicons } from '@expo/vector-icons';
import { COLORES } from '../src/config/colores';
import LogoApp from '../src/components/LogoApp';

import logoAzul from '../assets/logos/azul.png';
import logoVerde from '../assets/logos/verde.png';
import logoAmarillo from '../assets/logos/amarillo.png';

export default function LoginScreen() {
  const { setUsuario } = useUsuario();
  const [rut, setRut] = useState('');
  const [clave, setClave] = useState('');
  const [rutFocus, setRutFocus] = useState(false);
  const [claveFocus, setClaveFocus] = useState(false);
  const [cargando, setCargando] = useState(false);

  const entranceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [entranceAnim]);

  const handleLogin = async () => {
    if (!rut || !clave) {
      Alert.alert('Error', 'Por favor ingresa RUT y clave.');
      return;
    }

    setCargando(true);
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

        if (usuario.rol === 'FAMILIA') {
          router.replace('/(familia)/pagar');
        } else if (usuario.rol === 'COMERCIO') {
          router.replace('/(comercio)/pago');
        } else {
          Alert.alert('Error', 'Rol no reconocido por el sistema.');
        }
      } else {
        Alert.alert('Acceso Denegado', data.mensaje);
      }
    } catch (error) {
      Alert.alert('Error de Red', 'No se pudo conectar con el servidor municipal.');
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: entranceAnim,
            transform: [{
              translateY: entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [14, 0] })
            }]
          }
        ]}
      >
        {/* Logo oficial con su propia animación interna de caída */}
        <LogoApp size={140} />

        <Text style={styles.eyebrow}>Municipalidad de Illapel</Text>
        <Text style={styles.titulo}>Billetera Digital</Text>

        {/* Firma: tres elementos oficiales del logo */}
        <View style={styles.tricolor}>
          <Image source={logoAzul} style={styles.tricolorIcon} resizeMode="contain" />
          <Image source={logoVerde} style={styles.tricolorIcon} resizeMode="contain" />
          <Image source={logoAmarillo} style={styles.tricolorIcon} resizeMode="contain" />
        </View>

        <Text style={styles.subtitulo}>Accede con tu RUT y clave web</Text>

        <View style={[styles.inputBox, rutFocus && styles.inputBoxFocus]}>
          <Ionicons name="person-outline" size={20} color={rutFocus ? COLORES.azul : COLORES.grisClaro} />
          <TextInput
            style={styles.input}
            placeholder="RUT"
            placeholderTextColor={COLORES.grisClaro}
            value={rut}
            onChangeText={setRut}
            onFocus={() => setRutFocus(true)}
            onBlur={() => setRutFocus(false)}
          />
        </View>

        <View style={[styles.inputBox, claveFocus && styles.inputBoxFocus]}>
          <Ionicons name="lock-closed-outline" size={20} color={claveFocus ? COLORES.azul : COLORES.grisClaro} />
          <TextInput
            style={styles.input}
            placeholder="Clave Web"
            placeholderTextColor={COLORES.grisClaro}
            value={clave}
            onChangeText={setClave}
            secureTextEntry
            onFocus={() => setClaveFocus(true)}
            onBlur={() => setClaveFocus(false)}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={cargando}
          activeOpacity={0.85}
        >
          {cargando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.buttonLabel}>
              <Text style={styles.buttonText}>Ingresar</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORES.amarillo} />
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.footer}>Illapel Te Ayuda</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingBottom: 24,
  },
  eyebrow: {
    fontSize: 12,
    color: COLORES.grisMedio,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 18,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORES.azul,
    marginTop: 6,
  },
  tricolor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    marginBottom: 10,
  },
  tricolorIcon: {
    width: 30,
    height: 30,
    marginHorizontal: 3,
  },
  subtitulo: {
    fontSize: 14,
    color: COLORES.grisMedio,
    marginBottom: 26,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 54,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#E3E9EC',
    marginBottom: 14,
    width: '100%',
  },
  inputBoxFocus: {
    borderColor: COLORES.celeste,
    backgroundColor: '#FBFDFE',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORES.grisOscuro,
    marginLeft: 12,
    outlineWidth: 0,
    outlineStyle: 'none',
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORES.verde,
    shadowColor: COLORES.verde,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginRight: 8,
  },
  footer: {
    marginTop: 30,
    fontSize: 13,
    color: COLORES.grisClaro,
    letterSpacing: 1,
  },
});