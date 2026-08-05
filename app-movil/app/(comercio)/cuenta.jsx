import { View, Text, StyleSheet } from 'react-native';
import { useUsuario } from '../../src/context/UsuarioContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORES } from '../../src/config/colores';
import { useId } from 'react';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import FondoPantalla from '../../src/components/FondoPantalla';
import AnimacionEntrada from '../../src/components/AnimacionEntrada';
import BotonGradiente from '../../src/components/BotonGradiente';

export default function CuentaScreen() {
  const { usuario } = useUsuario();

  const esFamilia = usuario?.rol === 'FAMILIA';
  const colorTema = esFamilia ? COLORES.azul : COLORES.verde;
  const gradientId = useId().replace(/:/g, '');

  const nombre = esFamilia ? usuario?.nombre_familia : usuario?.nombre_comercio;
  const rut = esFamilia ? usuario?.rut_representante : usuario?.rut_comercio;

  return (
    <FondoPantalla color={COLORES.verdeClaro}>
      <View style={styles.container}>
        <AnimacionEntrada>
          <View style={styles.profileCard}>
            <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
              <Defs>
                <LinearGradient id={`perfil-${gradientId}`} x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={colorTema} />
                  <Stop offset="1" stopColor={COLORES.verdeClaro} />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" rx="16" fill={`url(#perfil-${gradientId})`} />
            </Svg>
            <View style={styles.iconCircle}>
              <Ionicons name={esFamilia ? "home" : "storefront"} size={44} color={colorTema} />
            </View>
            <Text style={styles.nombre}>{nombre}</Text>
            <Text style={styles.rut}>RUT: {rut}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{usuario?.rol}</Text>
            </View>
          </View>
        </AnimacionEntrada>

        <AnimacionEntrada delay={140}>
          <BotonGradiente
            titulo="Cambiar Contraseña"
            colors={[colorTema, COLORES.verdeClaro]}
            onPress={() => router.push(esFamilia ? '/(familia)/cambiar-clave' : '/(comercio)/cambiar-clave')}
            icon={<Ionicons name="lock-closed-outline" size={22} color="#FFFFFF" />}
            style={styles.boton}
          />
        </AnimacionEntrada>
      </View>
    </FondoPantalla>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center' },
  profileCard: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 24,
    marginBottom: 44,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  nombre: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  rut: { fontSize: 16, color: 'rgba(255,255,255,0.85)', marginTop: 8 },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORES.amarillo,
    marginTop: 20,
  },
  badgeText: { color: COLORES.verde, fontWeight: 'bold', fontSize: 13, letterSpacing: 1 },
  boton: { height: 62 },
});
