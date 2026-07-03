import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { API_URL } from '../../src/config/api';
import { useUsuario } from '../../src/context/UsuarioContext';

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
          // Obligatorio usar data.historial porque así lo nombra tu controlador backend
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

  const renderItem = ({ item }) => (
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
  );

  if (cargando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#5D2A7B" />
        <Text style={styles.texto}>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Historial de Compras</Text>

      {movimientos.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No hay movimientos registrados</Text>
        </View>
      ) : (
        <FlatList
          data={movimientos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_transaccion.toString()}
          contentContainerStyle={styles.lista}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5D2A7B',
    marginBottom: 16,
    marginTop: 8,
  },
  lista: {
    paddingBottom: 16,
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
    color: '#333',
    flex: 1,
  },
  monto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fecha: {
    fontSize: 12,
    color: '#999',
  },
  metodo: {
    fontSize: 12,
    color: '#5D2A7B',
    fontWeight: '500',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  texto: {
    marginTop: 10,
    color: '#666',
  },
});