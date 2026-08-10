import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { API_URL } from '../../src/config/api';
import { Ionicons } from '@expo/vector-icons';
import { COLORES } from '../../src/config/colores';
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import FondoPantalla from '../../src/components/FondoPantalla';
import GradienteHeader from '../../src/components/GradienteHeader';
import AnimacionEntrada from '../../src/components/AnimacionEntrada';

export default function ComerciosScreen() {
  const [comercios, setComercios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarComercios = async () => {
      try {
        const response = await fetch(`${API_URL}/comercios`);
        const data = await response.json();

        if (response.ok) {
          const lista = Array.isArray(data) ? data : data.comercios || [];
          setComercios(lista.filter(c => c.estado === 'ACTIVO'));
        } else {
          console.error('Error al cargar comercios:', data.mensaje);
        }
      } catch (error) {
        console.error('Error de conexión:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarComercios();
  }, []);

  const renderItem = ({ item, index }) => (
    <AnimacionEntrada delay={index * 60}>
      <View style={styles.item}>
        <View style={styles.itemHeader}>
          <View style={styles.iconCircle}>
            <Svg style={StyleSheet.absoluteFill} width="38" height="38">
              <Defs>
                <LinearGradient id={`com-${item.rut_comercio}`} x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={COLORES.azul} />
                  <Stop offset="1" stopColor={COLORES.celeste} />
                </LinearGradient>
              </Defs>
              <Circle cx="19" cy="19" r="19" fill={`url(#com-${item.rut_comercio})`} />
            </Svg>
            <Ionicons name="storefront" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.nombre}>{item.nombre_comercio}</Text>
        </View>
        <View style={styles.itemFooter}>
          <Text style={styles.rubro}>{item.rubro || 'Comercio'}</Text>
          <Text style={styles.direccion}>{item.direccion || 'Sin dirección'}</Text>
        </View>
      </View>
    </AnimacionEntrada>
  );

  if (cargando) {
    return (
      <FondoPantalla>
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={COLORES.azul} />
          <Text style={styles.texto}>Cargando comercios...</Text>
        </View>
      </FondoPantalla>
    );
  }

  return (
    <FondoPantalla>
      <GradienteHeader titulo="Comercios Disponibles" colors={[COLORES.azul, COLORES.celeste]} />
      <FlatList
        style={styles.scroll}
        contentContainerStyle={comercios.length === 0 ? [styles.contenido, styles.contenidoVacio] : styles.contenido}
        data={comercios}
        renderItem={renderItem}
        keyExtractor={(item) => item.rut_comercio}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="storefront-outline" size={52} color={COLORES.grisClaro} />
            <Text style={styles.emptyText}>No hay comercios registrados</Text>
          </View>
        }
      />
    </FondoPantalla>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  contenido: {
    padding: 16,
  },
  contenidoVacio: {
    flexGrow: 1,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: COLORES.azul,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    backgroundColor: '#E1F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORES.grisOscuro,
    flex: 1,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rubro: {
    fontSize: 13,
    color: COLORES.azul,
    fontWeight: '500',
  },
  direccion: {
    fontSize: 12,
    color: COLORES.grisClaro,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  emptyText: {
    fontSize: 14,
    color: COLORES.grisClaro,
    marginTop: 12,
  },
  texto: {
    marginTop: 10,
    color: COLORES.grisMedio,
  },
});
