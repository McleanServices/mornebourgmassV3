import { View, Text, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../context/auth';
import { router } from 'expo-router';
import axios from 'axios';

const API_URL = process.env.API_URL;

export default function SignIn() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate inputs
      if (!username || !password) {
        setError('Please enter both username and password');
        return;
      }

      console.log('API URL:', API_URL); // Debug log to verify URL

      // Check if API_URL is defined
      if (!API_URL) {
        throw new Error('API URL is not configured in environment variables');
      }

      const response = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          identifiant: username,
          password: password,
        }),
      }).catch(error => {
        console.error('Fetch error:', error); // Debug log
        throw new Error('Network request failed. Please check your internet connection.');
      });

      const data = await response.json();
      console.log('Response received:', response.status); // Debug log

      if (response.ok) {
        const { token } = data;
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        
        const userDetailsResponse = await axios.get(`${API_URL}/api/user/${decodedToken.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userRole = userDetailsResponse.data.user.role;
        const user = { id: decodedToken.id, role: userRole };

        signIn(token, user);
        router.replace('/(app)');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err); // Debug log
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ marginBottom: 20, fontSize: 24 }}>Sign In</Text>
      
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        style={{ marginBottom: 10, width: '100%' }}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={{ marginBottom: 20, width: '100%' }}
      />

      {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

      <Pressable 
        onPress={handleSignIn}
        disabled={loading}
        style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 5 }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: 'white' }}>Sign In</Text>
        )}
      </Pressable>
    </View>
  );
}