import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "#07689c",
        },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#07689c",
        tabBarLabelStyle: { fontWeight: "bold" },
        tabBarIcon: ({ color, size }) => {
          let iconName: any;
          switch (route.name) {
            case "index":
              iconName = "home";
              break;
            case "profile":
              iconName = "person";
              break;
            case "orders":
              iconName = "receipt";
              break;
            case "cart":
              iconName = "cart";
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="cart" options={{ title: "Cart" }} />
      <Tabs.Screen name="orders" options={{ title: "Orders" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
