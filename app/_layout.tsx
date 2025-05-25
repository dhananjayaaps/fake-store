import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { useEffect, useState } from 'react';
import SplashScreen from './splash';
export default function RootLayout() {
  const [isAppReady, setAppReady] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="products/[category]"
          options={({ route }) => ({
            title: (route.params as { category: string })?.category,
          })}
        />
        <Stack.Screen
          name="product/[id]"
          options={{ title: 'Product Details' }}
        />
      </Stack>
    </Provider>
  );
}
