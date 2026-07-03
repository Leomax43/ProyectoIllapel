import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUsuario } from '../../src/context/UsuarioContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CuentaScreen() {
  const { usuario } = useUsuario();
  
  const esFamilia = usuario?.rol === 'FAMILIA';
  const colorTema = esFamilia ? '#5D2A7B' : '#27AE60';
  
  const nombre = esFamilia ? usuario?.nombre_familia : usuario?.nombre_comercio;
  const rut = esFamilia ? usuario?.rut_representante : usuario?.rut_comercio;

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Ionicons name={esFamilia ? "home" : "storefront"} size={80} color={colorTema} />
        <Text style={[styles.nombre, { color: colorTema }]}>{nombre}</Text>
        <Text style={styles.rut}>RUT: {rut}</Text>
        <View style={[styles.badge, { backgroundColor: colorTema }]}>
          <Text style={styles.badgeText}>{usuario?.rol}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.botonClave, { backgroundColor: colorTema }]}
        onPress={() => router.push(esFamilia ? '/(familia)/cambiar-clave' : '/(comercio)/cambiar-clave')}
      >
        <Ionicons name="lock-closed-outline" size={24} color="white" />
        <Text style={styles.textoBoton}>Cambiar Contraseña</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20, alignItems: 'center' },
  profileCard: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 20,
    marginBottom: 40
  },
  nombre: { fontSize: 22, fontWeight: 'bold', marginTop: 10, textAlign: 'center' },
  rut: { fontSize: 16, color: '#666', marginTop: 5 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 15 },
  badgeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  botonClave: {
    flexDirection: 'row',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  textoBoton: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }
});