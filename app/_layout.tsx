import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

function RootLayoutNav() {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const segments = useSegments();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Escuta o término da hidratação do Zustand do AsyncStorage
    const unsubFinishHydration = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    
    // Verifica se já está hidratado
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return () => {
      unsubFinishHydration();
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // Identifica se estamos em uma rota protegida (dentro de tabs ou detalhes de tarefas)
    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'task';

    if (!token && inAuthGroup) {
      // Sem token nas rotas protegidas -> redireciona para login
      router.replace('/login');
    } else if (token && !inAuthGroup) {
      // Com token nas rotas de auth -> redireciona para tarefas
      router.replace('/(tabs)');
    }
  }, [token, segments, isHydrated]);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="task/[id]"
        options={{
          title: 'Detalhes da Tarefa',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RootLayoutNav />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
