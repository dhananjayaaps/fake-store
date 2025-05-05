import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    axios.get(`https://fakestoreapi.com/products/${id}`)
      .then(res => setProduct(res.data));
  }, []);

  if (!product) return <ActivityIndicator style={{ flex: 1 }} size="large" color="blue" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  image: { width: '100%', height: 250, resizeMode: 'contain' },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  price: { fontSize: 18, color: 'green' },
  description: { marginTop: 10, fontSize: 16 }
});
