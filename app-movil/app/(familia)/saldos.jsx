import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { API_URL } from '../../src/config/api';
import { useUsuario } from '../../src/context/UsuarioContext';
import { router } from 'expo-router';

export default function SaldosScreen() {
  const { usuario } = useUsuario();
  const idFamilia = usuario?.id_familia;
  
  // Inicializamos directamente con el saldo del contexto si existe, para evitar parpadeo en $0
  const [saldo, setSaldo] = useState(usuario?.saldo !== undefined ? Number(usuario.saldo) : null);
  const [nombre, setNombre] = useState('');
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarSaldo = async () => {
      try {
        const url = `${API_URL}/movil/familia/${idFamilia}/cartola`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
          // Extraemos la propiedad exacta del backend
          const saldoBackend = data.saldo_actual !== undefined ? data.saldo_actual : data.saldo;
          
          if (saldoBackend !== undefined && saldoBackend !== null) {
            setSaldo(Number(saldoBackend));
          }
          setNombre(data.nombre_familia || '');
          setMovimientos(data.historial || []);
        } else {
          console.error('Error de la API:', data.mensaje);
        }
      } catch (error) {
        console.error('Error crítico de conexión:', error);
      } finally {
        setCargando(false);
      }
    };

    if (idFamilia) {
      cargarSaldo();
    } else {
      setCargando(false);
    }
  }, [idFamilia]);

  const formatearFecha = (fecha) => {
    if (!fecha) return '—';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CL', { 
      day: '2-digit', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ultimasTresTransacciones = movimientos.slice(0, 3);

  if (cargando && saldo === null) {
    return (
      <View style={styles.containerCentrado}>
        <ActivityIndicator size="large" color="#5D2A7B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Resumen de Saldos</Text>
      {nombre ? <Text style={styles.subtitulo}>Beneficiario: {nombre}</Text> : null}
      
      {/* Tarjeta de saldo */}
      <View style={styles.tarjetaSaldo}>
        <Text style={styles.label}>Saldo Disponible</Text>
        <Text style={styles.saldoTexto}>
          ${Number(saldo || 0).toLocaleString('es-CL')}
        </Text>
      </View>

      {/* Últimas transacciones */}
      <View style={styles.seccionTransacciones}>
        <Text style={styles.subtituloTransacciones}>Últimos movimientos</Text>

        {ultimasTresTransacciones.length === 0 ? (
          <Text style={styles.emptyText}>No hay movimientos registrados</Text>
        ) : (
          <>
            {ultimasTresTransacciones.map((item) => (
              <View key={item.id_transaccion} style={styles.transaccionItem}>
                <View style={styles.transaccionHeader}>
                  <Text style={styles.comercio}>{item.nombre_comercio || 'Comercio'}</Text>
                  <Text style={styles.monto}>-${Number(item.monto).toLocaleString('es-CL')}</Text>
                </View>
                <Text style={styles.fecha}>{formatearFecha(item.fecha)}</Text>
              </View>
            ))}

            {movimientos.length > 3 && (
              <TouchableOpacity 
                style={styles.verTodosButton}
                onPress={() => router.push('/(familia)/historial')}
              >
                <Text style={styles.verTodosText}>Ver todas las transacciones</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  containerCentrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#5D2A7B', textAlign: 'center', marginBottom: 5 },
  subtitulo: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  tarjetaSaldo: { 
    backgroundColor: 'white', 
    borderRadius: 16, 
    padding: 25, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 4 
  },
  label: { fontSize: 14, color: '#999', textTransform: 'uppercase', tracking: 1, marginBottom: 10 },
  saldoTexto: { fontSize: 36, fontWeight: 'bold', color: '#27AE60' },
  seccionTransacciones: {
    marginTop: 24,
    width: '100%',
  },
  subtituloTransacciones: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  transaccionItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transaccionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  comercio: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  monto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  fecha: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  verTodosButton: {
    backgroundColor: '#5D2A7B',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  verTodosText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});