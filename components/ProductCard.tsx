import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

export default function ProductCard({ product, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>
          {product.title}
        </Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#f5f5f5",
  },
  info: {
    flex: 1,
  },
  title: {
    color: "#333333",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  price: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
