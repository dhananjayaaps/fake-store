import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { useEffect, useState } from 'react';
import { checkAuthStatus } from '../redux/slices/authSlice';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Dispatch the token check action and wait for it to complete
        await store.dispatch(checkAuthStatus());
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <Stack>
         {/* <Stack.Screen name="auth" options={{ headerShown: false }} /> */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="products/[category]"
          options={({ route }) => ({
            title: (route.params as { category: string })?.category,
          })}
        />
        <Stack.Screen
          name="product/[id]"
          options={{
            title: 'Product Details',
          }}
        />
      </Stack>
    </Provider>
  );
}