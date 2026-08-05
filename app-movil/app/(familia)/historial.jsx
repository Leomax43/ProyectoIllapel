import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { API_URL } from '../../src/config/api';
import { useUsuario } from '../../src/context/UsuarioContext';
import { Ionicons } from '@expo/vector-icons';
import { COLORES } from '../../src/config/colores';
import FondoPantalla from '../../src/components/FondoPantalla';
import AnimacionEntrada from '../../src/components/AnimacionEntrada';

export default function HistorialScreen() {
  const { usuario } = useUsuario();
  const idFamilia = usuario?.id_familia;
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const response = await fetch(`${API_URL}/movil/familia/${idFamilia}/cartola`);
        const data = await response.json();

        if (response.ok) {
          setMovimientos(data.historial || []);
        } else {
          console.error('Error al cargar historial:', data.mensaje);
        }
      } catch (error) {
        console.error('Error de conexión:', error);
      } finally {
        setCargando(false);
      }
    };

    if (idFamilia) {
      cargarHistorial();
    }
  }, [idFamilia]);

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
          <Text style={styles.comercio}>{item.nombre_comercio || 'Comercio'}</Text>
          <Text style={styles.monto}>-${Number(item.monto).toLocaleString('es-CL')}</Text>
        </View>
        <View style={styles.itemFooter}>
          <Text style={styles.fecha}>{formatearFecha(item.fecha)}</Text>
          <Text style={styles.metodo}>{item.metodo_pago || 'QR'}</Text>
        </View>
      </View>
    </AnimacionEntrada>
  );

  if (cargando) {
    return (
      <FondoPantalla>
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={COLORES.azul} />
          <Text style={styles.texto}>Cargando historial...</Text>
        </View>
      </FondoPantalla>
    );
  }

  return (
    <FondoPantalla>
      <FlatList
        style={styles.scroll}
        contentContainerStyle={movimientos.length === 0 ? [styles.contenido, styles.contenidoVacio] : styles.contenido}
        data={movimientos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_transaccion.toString()}
        ListHeaderComponent={<Text style={styles.titulo}>Historial de Compras</Text>}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={52} color={COLORES.grisClaro} />
            <Text style={styles.emptyText}>No hay movimientos registrados</Text>
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
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORES.azul,
    marginBottom: 16,
    marginTop: 8,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  comercio: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORES.grisOscuro,
    flex: 1,
  },
  monto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORES.rojo,
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
    color: COLORES.azul,
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
