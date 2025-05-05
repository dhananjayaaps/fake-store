import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';

export default function ProductList() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios.get(`https://fakestoreapi.com/products/category/${category}`)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="blue" />;

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={products}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={() => router.push(`/products/${item.id}`)} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 10 }
});
