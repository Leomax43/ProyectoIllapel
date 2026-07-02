import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { API_URL } from '../../src/config/api';
import { useUsuario } from '../../src/context/UsuarioContext';

export default function PagarScreen() {
  const { usuario } = useUsuario();
  const idFamilia = usuario?.id_familia;
  const nombreFamilia = usuario?.nombre_familia || '';
  
  const realizarPagoReal = async () => {
    try {
      // 1. La App pide su código QR temporal al backend
      const resQR = await fetch(`${API_URL}/movil/familia/${idFamilia}/generar-qr`);
      const dataQR = await resQR.json();
      
      if (!resQR.ok) throw new Error("No se pudo generar el código QR");
      const token = dataQR.qr_data; // Tenemos el súper código encriptado

      // 2. Simulamos que el Minimarket Don Jorge (RUT 77777777-7) escanea y cobra 5000
      const resCobro = await fetch(`${API_URL}/transacciones/comprar-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rut_comercio: "77777777-7", // Usamos el Minimarket de nuestro seedDB
          monto: 5000,
          qr_token: token // Enviamos el código sellado mágicamente con JWT
        })
      });

      const dataCobro = await resCobro.json();

      if (resCobro.ok) {
        // Aprovechamos ese saldo_restante que programaste tan bien en el backend
        Alert.alert("¡Pago Exitoso!", `Has pagado $5.000 en Minimarket Don Jorge.\nTu saldo actual es: $${dataCobro.saldo_restante}`);
      } else {
        // Por si se quedan sin fondos
        Alert.alert("Pago Rechazado", dataCobro.mensaje);
      }

    } catch (error) {
      Alert.alert("Error de Conexión", "No se pudo comunicar con el servidor municipal.");
      console.log(error);
    }
  };

  const confirmarPago = () => {
    Alert.alert(
      "Confirmar Pago",
      "¿Deseas realizar un pago de $5.000?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Pagar", onPress: realizarPagoReal } // <-- Llamamos a la función real
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido, {nombreFamilia || "Familia"}</Text>
      <Text style={styles.subtitle}>Presiona el botón para descontar $5.000</Text>

      <TouchableOpacity style={styles.payButton} onPress={confirmarPago}>
        <Text style={styles.paySign}>$</Text>
        <Text style={styles.payText}>Pagar</Text>
      </TouchableOpacity>
    </View>
  );
}

// ... (los styles de abajo quedan idénticos)

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#D1BDE3', // Un fondo lila suave similar al de la Junaeb
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  title: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  subtitle: { fontSize: 16, color: 'white', marginBottom: 40 },
  payButton: {
    width: 200,
    height: 200,
    backgroundColor: '#8E44AD',
    borderRadius: 100, // Lo hace un círculo perfecto
    borderWidth: 8,
    borderColor: 'rgba(255,255,255,0.5)', // Borde semi-transparente como en Edenred
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  paySign: { fontSize: 60, color: 'white', fontWeight: 'bold' },
  payText: { fontSize: 24, color: 'white', fontWeight: 'bold' }
});