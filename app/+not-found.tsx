import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found', headerShown: true , headerBackTitle: 'retour'}} />
      <View style={styles.container}>
        <Ionicons name="settings-outline" size={48} color="grey" style={styles.icon} />
        <Text style={styles.developmentText}>En développement</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Retourner</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Changed to white
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#4b0082', // Updated color to match the icon
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
  },

  buttonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },

  icon: {
    marginTop: 20,
  },

  developmentText: {
    marginTop: 10,
    fontSize: 16,
    color: 'grey', // Changed to grey
  },
});
