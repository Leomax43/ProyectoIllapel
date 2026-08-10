import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { COLORES } from '../../src/config/colores';

export default function ComercioLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: COLORES.verde,
      tabBarInactiveTintColor: 'gray',
      headerShown: true,
      headerStyle: { backgroundColor: COLORES.verde },
      headerTintColor: 'white',
      // BOTÓN DE LOGOUT EN LA ESQUINA SUPERIOR DERECHA
      headerRight: () => (
        <TouchableOpacity 
          style={{ marginRight: 15 }} 
          onPress={() => router.replace('/')} // Nos devuelve al Login principal
        >
          <Ionicons name="log-out-outline" size={28} color="white" />
        </TouchableOpacity>
      )
    }}>
      {/* 1. Izquierda: Historial */}
      <Tabs.Screen 
        name="historial" 
        options={{ 
          title: 'Historial', 
          tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} /> 
        }} 
      />
      
      {/* 2. Centro: Pago (El escáner) */}
      <Tabs.Screen 
        name="pago" 
        options={{ 
          title: 'Cobrar QR', 
          tabBarIcon: ({ color }) => <Ionicons name="qr-code-outline" size={32} color={color} /> 
        }} 
      />

      {/* 3. Derecha: Pestaña de Cuenta */}
      <Tabs.Screen 
        name="cuenta" 
        options={{ 
          title: 'Cuenta', 
          tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={28} color={color} /> 
        }} 
      />

      {/* PANTALLA OCULTA: Cambiar Contraseña (Navegable pero sin botón abajo) */}
      <Tabs.Screen 
        name="cambiar-clave" 
        options={{ 
          href: null, 
          title: 'Cambiar Contraseña' 
        }} 
      />

      {/* PANTALLA OCULTA: Salir (sin uso, no debe aparecer como pestaña) */}
      <Tabs.Screen 
        name="salir" 
        options={{ 
          href: null 
        }} 
      />
    </Tabs>
  );
}