import { Tabs, router } from 'expo-router'; // <-- Agregamos router
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native'; // <-- Agregamos TouchableOpacity

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#5D2A7B',
      tabBarInactiveTintColor: 'gray',
      headerShown: true,
      headerStyle: { backgroundColor: '#5D2A7B' },
      headerTintColor: 'white',
      // BOTÓN DE LOGOUT EN LA ESQUINA SUPERIOR DERECHA
      headerRight: () => (
        <TouchableOpacity 
          style={{ marginRight: 15 }} 
          onPress={() => router.replace('/')} // Nos devuelve al Login
        >
          <Ionicons name="log-out-outline" size={28} color="white" />
        </TouchableOpacity>
      )
    }}>
      <Tabs.Screen name="comercios" options={{ title: 'Comercios', tabBarIcon: ({ color }) => <Ionicons name="storefront" size={24} color={color} /> }} />
      <Tabs.Screen name="saldos" options={{ title: 'Saldos', tabBarIcon: ({ color }) => <Ionicons name="wallet" size={24} color={color} /> }} />
      <Tabs.Screen name="pagar" options={{ title: 'Pagar', tabBarIcon: ({ color }) => <Ionicons name="qr-code" size={32} color={color} /> }} />
      <Tabs.Screen name="historial" options={{ href: null }} />
    </Tabs>
  );
}