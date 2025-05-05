import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

type RootStackParamList = {
  index: undefined;
  "products/[category]": { category: string };
  "product/[id]": { id: string };
};

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#07689c",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Product Categories" }} />
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
  );
}

const styles = StyleSheet.create({});
