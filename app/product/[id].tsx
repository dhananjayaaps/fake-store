import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((res) => setProduct(res.data));
  }, []);

  if (!product)
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#07689c" />
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <Text style={styles.title}>{product.title}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.tag}>⭐ {product.rating.rate}</Text>
        <Text style={styles.tag}>📦 {product.rating.count}</Text>
        <Text style={[styles.tag, styles.price]}>💲{product.price}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.buttonText}>🛒 Add to Cart</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.descriptionTitle}>Description</Text>
      <View style={styles.descriptionBox}>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#f4faff",
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    borderRadius: 12,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "center",
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  tag: {
    backgroundColor: "#dff6ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontWeight: "bold",
    fontSize: 14,
    color: "#07689c",
  },
  price: {
    backgroundColor: "#07689c",
    color: "white",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    backgroundColor: "#b0bec5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cartButton: {
    backgroundColor: "#07689c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 14,
  },
  descriptionTitle: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "flex-start",
    paddingLeft: 16,
    color: "#333",
  },
  descriptionBox: {
    marginTop: 8,
    backgroundColor: "#e3f2fd",
    padding: 14,
    borderRadius: 10,
    width: "100%",
  },
  description: {
    fontSize: 14,
    color: "#444",
  },
});
