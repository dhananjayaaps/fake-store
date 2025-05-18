import { Slot } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { Stack } from 'expo-router';

export default function RootLayout() {
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
