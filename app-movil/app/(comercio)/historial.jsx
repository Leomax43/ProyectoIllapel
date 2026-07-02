import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { API_URL } from '../../src/config/api';
import { useUsuario } from '../../src/context/UsuarioContext';

export default function HistorialComercioScreen() {
  const { usuario } = useUsuario();
  const rutComercio = usuario?.rut_comercio;
  const [ventas, setVentas] = useState([]);
  const [nombreComercio, setNombreComercio] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarHistorial = async () => {
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
      }
    };

    cargarHistorial();
  }, [rutComercio]);

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
        <Text style={styles.familia}>{item.nombre_familia || 'Familia'}</Text>
        <Text style={styles.monto}>+${Number(item.monto).toLocaleString('es-CL')}</Text>
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
        <ActivityIndicator size="large" color="#27AE60" />
        <Text style={styles.texto}>Cargando ventas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Historial de Ventas</Text>
      {nombreComercio && (
        <Text style={styles.subtitulo}>{nombreComercio}</Text>
      )}

      {ventas.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No hay ventas registradas</Text>
        </View>
      ) : (
        <FlatList
          data={ventas}
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
    color: '#27AE60',
    marginBottom: 4,
    marginTop: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
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
  familia: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  monto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27AE60',
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
    color: '#27AE60',
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