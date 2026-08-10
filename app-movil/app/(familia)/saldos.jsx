import { View, Text, ActivityIndicator, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { useState, useEffect, useId } from 'react';
import { API_URL } from '../../src/config/api';
import { useUsuario } from '../../src/context/UsuarioContext';
import { router } from 'expo-router';
import { COLORES } from '../../src/config/colores';
import { Ionicons } from '@expo/vector-icons';
import FondoPantalla from '../../src/components/FondoPantalla';
import AnimacionEntrada from '../../src/components/AnimacionEntrada';
import BotonGradiente from '../../src/components/BotonGradiente';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

export default function SaldosScreen() {
  const { usuario } = useUsuario();
  const idFamilia = usuario?.id_familia;

  const [saldo, setSaldo] = useState(usuario?.saldo !== undefined ? Number(usuario.saldo) : null);
  const [nombre, setNombre] = useState('');
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  const gradientId = useId().replace(/:/g, '');

  const cargarDatos = async () => {
    try {
      const url = `${API_URL}/movil/familia/${idFamilia}/cartola`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        const saldoBackend = data.saldo_actual !== undefined ? data.saldo_actual : data.saldo;
        if (saldoBackend !== undefined && saldoBackend !== null) {
          setSaldo(Number(saldoBackend));
        }
        setNombre(data.nombre_familia || '');
        setMovimientos(data.historial || []);
      }
    } catch (error) {
      console.error('Error crítico:', error);
    }
  };

  const onRefresh = async () => {
    setRefrescando(true);
    await cargarDatos();
    setRefrescando(false);
  };

  useEffect(() => {
    const cargarSaldo = async () => {
      try {
        const url = `${API_URL}/movil/familia/${idFamilia}/cartola`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
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
      <FondoPantalla style={styles.containerCentrado}>
        <ActivityIndicator size="large" color={COLORES.azul} />
      </FondoPantalla>
    );
  }

  return (
    <FondoPantalla>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contenido}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={onRefresh} tintColor={COLORES.azul} />
        }
      >
        <AnimacionEntrada>
          <Text style={styles.titulo}>Resumen de Saldos</Text>
          {nombre ? <Text style={styles.subtitulo}>Beneficiario: {nombre}</Text> : null}
        </AnimacionEntrada>

        {/* Tarjeta de saldo con degradado institucional */}
        <AnimacionEntrada delay={80}>
          <View style={styles.tarjetaSaldo}>
            <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
              <Defs>
                <LinearGradient id={`saldo-${gradientId}`} x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={COLORES.azul} />
                  <Stop offset="1" stopColor={COLORES.celeste} />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" rx="16" fill={`url(#saldo-${gradientId})`} />
            </Svg>
            <View style={styles.saldoIcon}>
              <Ionicons name="wallet" size={20} color={COLORES.azul} />
            </View>
            <Text style={styles.label}>Saldo Disponible</Text>
            <Text style={styles.saldoTexto}>
              ${Number(saldo || 0).toLocaleString('es-CL')}
            </Text>
            <View style={styles.accent} />
          </View>
        </AnimacionEntrada>

        {/* Últimas transacciones */}
        <View style={styles.seccionTransacciones}>
          <Text style={styles.subtituloTransacciones}>Últimos movimientos</Text>

          {ultimasTresTransacciones.length === 0 ? (
            <AnimacionEntrada delay={160}>
              <Text style={styles.emptyText}>No hay movimientos registrados</Text>
            </AnimacionEntrada>
          ) : (
            <>
              {ultimasTresTransacciones.map((item, index) => (
                <AnimacionEntrada key={item.id_transaccion} delay={160 + index * 80}>
                  <View style={styles.transaccionItem}>
                    <View style={styles.transaccionHeader}>
                      <Text style={styles.comercio}>{item.nombre_comercio || 'Comercio'}</Text>
                      <Text style={styles.monto}>-${Number(item.monto).toLocaleString('es-CL')}</Text>
                    </View>
                    <Text style={styles.fecha}>{formatearFecha(item.fecha)}</Text>
                  </View>
                </AnimacionEntrada>
              ))}

              {movimientos.length > 3 && (
                <AnimacionEntrada delay={400}>
                  <BotonGradiente
                    titulo="Ver todas las transacciones"
                    colors={[COLORES.azul, COLORES.celeste]}
                    onPress={() => router.push('/(familia)/historial')}
                    style={styles.verTodosButton}
                  />
                </AnimacionEntrada>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </FondoPantalla>
  );
}

const styles = StyleSheet.create({
  containerCentrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  contenido: { padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: COLORES.azul, textAlign: 'center', marginBottom: 5 },
  subtitulo: { fontSize: 16, color: COLORES.grisMedio, textAlign: 'center', marginBottom: 24 },
  tarjetaSaldo: {
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: COLORES.azul,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  saldoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  saldoTexto: { fontSize: 38, fontWeight: 'bold', color: '#FFFFFF' },
  accent: { width: 36, height: 4, borderRadius: 2, backgroundColor: COLORES.amarillo, marginTop: 12 },
  seccionTransacciones: {
    marginTop: 26,
    width: '100%',
  },
  subtituloTransacciones: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORES.azul,
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
    borderLeftWidth: 3,
    borderLeftColor: COLORES.amarillo,
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
    color: COLORES.grisOscuro,
    flex: 1,
  },
  monto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORES.rojo,
  },
  fecha: {
    fontSize: 12,
    color: COLORES.grisClaro,
  },
  emptyText: {
    fontSize: 14,
    color: COLORES.grisClaro,
    textAlign: 'center',
    marginTop: 20,
  },
  verTodosButton: {
    marginTop: 10,
  },
});
