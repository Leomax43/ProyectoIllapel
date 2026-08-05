import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../../src/config/api';
import { useUsuario } from '../../src/context/UsuarioContext';
import { Ionicons } from '@expo/vector-icons';
import { COLORES } from '../../src/config/colores';
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import FondoPantalla from '../../src/components/FondoPantalla';
import GradienteHeader from '../../src/components/GradienteHeader';
import AnimacionEntrada from '../../src/components/AnimacionEntrada';

export default function HistorialComercioScreen() {
  const { usuario } = useUsuario();
  const rutComercio = usuario?.rut_comercio;
  const [ventas, setVentas] = useState([]);
  const [nombreComercio, setNombreComercio] = useState('');
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  const cargarHistorial = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/comercios/${rutComercio}`);
      const data = await response.json();

      if (response.ok) {
        setNombreComercio(data.datos_comercio?.nombre_comercio || '');
        setVentas(data.historial_ventas || []);
      } else {
        console.error('Error al cargar historial:', data.mensaje);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, [rutComercio]);

  useEffect(() => {
    if (rutComercio) {
      cargarHistorial();
    }
  }, [rutComercio, cargarHistorial]);

  const onRefresh = () => {
    setRefrescando(true);
    cargarHistorial();
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '—';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderItem = ({ item, index }) => (
    <AnimacionEntrada delay={index * 60}>
      <View style={styles.item}>
        <View style={styles.itemHeader}>
          <View style={styles.iconCircle}>
            <Svg style={StyleSheet.absoluteFill} width="38" height="38">
              <Defs>
                <LinearGradient id={`ven-${item.id_transaccion}`} x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={COLORES.verde} />
                  <Stop offset="1" stopColor={COLORES.verdeClaro} />
                </LinearGradient>
              </Defs>
              <Circle cx="19" cy="19" r="19" fill={`url(#ven-${item.id_transaccion})`} />
            </Svg>
            <Ionicons name="person" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.familia}>{item.nombre_familia || 'Familia'}</Text>
          <Text style={styles.monto}>+${Number(item.monto).toLocaleString('es-CL')}</Text>
        </View>
        <View style={styles.itemFooter}>
          <Text style={styles.fecha}>{formatearFecha(item.fecha)}</Text>
          <Text style={styles.metodo}>{item.metodo_pago || 'QR'}</Text>
        </View>
      </View>
    </AnimacionEntrada>
  );

  if (cargando && !refrescando) {
    return (
      <FondoPantalla color={COLORES.verdeClaro}>
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={COLORES.verde} />
          <Text style={styles.texto}>Cargando ventas...</Text>
        </View>
      </FondoPantalla>
    );
  }

  return (
    <FondoPantalla color={COLORES.verdeClaro}>
      <GradienteHeader titulo="Historial de Ventas" subtitulo={nombreComercio || undefined} colors={[COLORES.verde, COLORES.verdeClaro]} />
      <FlatList
        style={styles.scroll}
        contentContainerStyle={ventas.length === 0 ? [styles.contenido, styles.contenidoVacio] : styles.contenido}
        data={ventas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_transaccion.toString()}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={52} color={COLORES.grisClaro} />
            <Text style={styles.emptyText}>No hay ventas registradas</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={onRefresh}
            tintColor={COLORES.verde}
          />
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
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    borderLeftColor: COLORES.verde,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  familia: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORES.grisOscuro,
    flex: 1,
  },
  monto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORES.verde,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fecha: {
    fontSize: 12,
    color: COLORES.grisClaro,
  },
  metodo: {
    fontSize: 12,
    color: COLORES.verde,
    fontWeight: '500',
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
