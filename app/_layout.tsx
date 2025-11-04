import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OverlayProvider } from 'stream-chat-expo';
import { StreamChatProvider } from '../contexts/StreamChatContext';
import { StreamVideoProvider } from '../contexts/StreamVideoContext';
import '../global.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StreamChatProvider>
          <StreamVideoProvider>
            <OverlayProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: '#ffffff' },
                }}
              >
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="doctors" />
                <Stack.Screen name="booking" />
                <Stack.Screen name="consultation" />
                <Stack.Screen name="conversation" />
              </Stack>
            </OverlayProvider>
          </StreamVideoProvider>
        </StreamChatProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
