import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios.get("https://fakestoreapi.com/products/categories").then((res) => {
      setCategories(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🛍️ Product Categories</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.card}
              onPress={() => router.push(`/products/${cat}`)}
            >
              <Text style={styles.cardText}>{cat.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 1.2,
  },
  scrollContainer: {
    paddingBottom: 20,
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#dddddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    color: "#333333",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 1,
  },
});
