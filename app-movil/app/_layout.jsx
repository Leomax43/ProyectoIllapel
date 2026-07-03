import { Stack } from 'expo-router';
import { UsuarioProvider } from '../src/context/UsuarioContext';

export default function RootLayout() {
  return (
    <UsuarioProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(familia)" />
        <Stack.Screen name="(comercio)" />
      </Stack>
    </UsuarioProvider>
  );
}