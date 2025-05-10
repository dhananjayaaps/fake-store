import { Tabs } from "expo-router";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function TabsLayout() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#07689c",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          borderTopWidth: 1,
          borderColor: "#e0e0e0",
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "home";

          switch (route.name) {
            case "index":
              iconName = focused ? "home" : "home-outline";
              break;
            case "profile":
              iconName = focused ? "person" : "person-outline";
              break;
            case "orders":
              iconName = focused ? "file-tray-full" : "file-tray-full-outline";
              break;
            case "cart":
              iconName = focused ? "cart" : "cart-outline";
              break;
          }

          return (
            <>
              <Ionicons name={iconName as any} size={22} color={color} />
              {route.name === "cart" && totalCount > 0 && (
                <Text
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -12,
                    backgroundColor: "red",
                    color: "#fff",
                    fontSize: 10,
                    paddingHorizontal: 4,
                    paddingVertical: 1,
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  {totalCount}
                </Text>
              )}
            </>
          );
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
