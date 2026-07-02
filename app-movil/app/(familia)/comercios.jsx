import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { API_URL } from '../../src/config/api';
import { useUsuario } from '../../src/context/UsuarioContext';

export default function ComerciosScreen() {
  const { usuario } = useUsuario();
  const [comercios, setComercios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarComercios = async () => {
      try {
        const response = await fetch(`${API_URL}/comercios`);
        const data = await response.json();

        if (response.ok) {
          // El endpoint devuelve un array directamente
          const lista = Array.isArray(data) ? data : data.comercios || [];
          // Filtrar solo comercios activos
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

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Text style={styles.nombre}>{item.nombre_comercio}</Text>
      </View>
      <View style={styles.itemFooter}>
        <Text style={styles.rubro}>{item.rubro || 'Comercio'}</Text>
        <Text style={styles.direccion}>{item.direccion || 'Sin dirección'}</Text>
      </View>
    </View>
  );

  if (cargando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#5D2A7B" />
        <Text style={styles.texto}>Cargando comercios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Comercios Disponibles</Text>

      {comercios.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No hay comercios registrados</Text>
        </View>
      ) : (
        <FlatList
          data={comercios}
          renderItem={renderItem}
          keyExtractor={(item) => item.rut_comercio}
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
    marginBottom: 8,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rubro: {
    fontSize: 13,
    color: '#5D2A7B',
    fontWeight: '500',
  },
  direccion: {
    fontSize: 12,
    color: '#999',
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