import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function ProductCard({ product, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View>
        <Text numberOfLines={1} style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
    gap: 10,
  },
  image: { width: 60, height: 60, resizeMode: 'contain' },
  title: { fontWeight: 'bold', width: 200 },
  price: { color: 'green' }
});
