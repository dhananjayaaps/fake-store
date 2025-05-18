import { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/auth'); // Removed the dot for better path resolution
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/splash.png')}
        style={styles.image}
        resizeMode="cover" // Changed to "cover" for full screen
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
});