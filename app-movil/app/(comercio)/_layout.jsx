// app/(comercio)/_layout.jsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ComercioLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#27AE60', // Un verde comercio distintivo
      tabBarInactiveTintColor: 'gray',
      headerShown: true,
      headerStyle: { backgroundColor: '#27AE60' },
      headerTintColor: 'white',
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

      {/* 3. Derecha: Salir */}
      <Tabs.Screen 
        name="salir" 
        options={{ 
          title: 'Salir', 
          tabBarIcon: ({ color }) => <Ionicons name="log-out-outline" size={24} color={color} /> 
        }} 
      />
    </Tabs>
  );
}