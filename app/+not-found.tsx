import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';

export default function NotFound() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Page Not Found</Text>
      <Button title="Go Home" onPress={() => router.replace('/')} />
    </View>
  );
}