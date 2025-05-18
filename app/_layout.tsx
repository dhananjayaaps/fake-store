import { Slot } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import SplashScreen from './splash'; // Import your SplashScreen component

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="products/[category]"
          options={({ route }) => ({
            title: (route.params as { category: string })?.category,
          })}
        />
        <Stack.Screen
          name="product/[id]"
          options={({ route }) => ({
            title: `Product Details`,
          })}
        />
      </Stack>
    </Provider>
  );
}
