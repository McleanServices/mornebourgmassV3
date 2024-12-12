import { View, StyleSheet, Platform, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth';
import { router } from 'expo-router';
import axios from 'axios';
import TextInput from '../assets/screens/components/TextInput';
import Button from '../assets/screens/components/Button';
import Logo from '../assets/screens/components/Logo';
import Header from '../assets/screens/components/Header';
import { theme } from '../assets/screens/core/Theme';
import { usernameValidator } from '../assets/screens/helpers/UsernameValidator';
import { passwordValidator } from '../assets/screens/helpers/PasswordValidator';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withRepeat, withSequence } from 'react-native-reanimated';

//test

export default function SignIn() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const logoOpacity = useSharedValue(1);

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
    };
  });

  useEffect(() => {
    logoOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1500, easing: Easing.linear }),
        withTiming(1, { duration: 1500, easing: Easing.linear })
      ),
      -1,
      true
    );
  }, []);

  const handleSignIn = async () => {
    const usernameError = usernameValidator(username.value);
    const passwordError = passwordValidator(password.value);

    if (usernameError || passwordError) {
      setUsername({ ...username, error: usernameError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://mornebourgmass.com/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          identifiant: username.value,
          password: password.value,
        }),
      }).catch(error => {
        console.error('Erreur de récupération:', error);
        throw new Error('La requête réseau a échoué. Veuillez vérifier votre connexion internet.');
      });

      const data = await response.json();
      console.log('Réponse reçue:', response.status);

      if (response.ok) {
        const { token } = data;
        const decodedToken = JSON.parse(atob(token.split('.')[1]));

        const userDetailsResponse = await axios.get(`https://mornebourgmass.com/api/user/${decodedToken.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userRole = userDetailsResponse.data.user.role;
        const user = { id: decodedToken.id, role: userRole };

        signIn(token, user);
        router.replace('/(app)');
      } else {
        setError(data.message || 'Échec de la connexion');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Animated.View style={animatedLogoStyle}>
              <View style={{ width: 150, height: 150 }}>
                <Logo />
              </View>
            </Animated.View>
          </View>
          <TextInput
            label="Nom d'utilisateur"
            returnKeyType="next"
            value={username.value}
            onChangeText={(text: string) => setUsername({ value: text, error: '' })}
            error={!!username.error}
            errorText={username.error}
            description={!username.error ? "Entrez votre nom d'utilisateur" : ""}
            autoCapitalize="none"
          />
          <TextInput
            label="Mot de passe"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text: string) => setPassword({ value: text, error: '' })}
            error={!!password.error}
            errorText={password.error}
            description={!password.error ? "Entrez votre mot de passe" : ""}
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button 
            mode="contained" 
            onPress={handleSignIn}
            disabled={loading}
            style={{ marginTop: 16 }} // Add a style prop
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              "Connexion"
            )}
          </Button>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#8A2BE2" />
              <Text style={styles.loadingText}>Connexion en cours...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center', // Centrer le contenu verticalement
  },
  logoContainer: {
    alignItems: 'center', // Centrer le logo horizontalement
    marginBottom: 20, // Ajouter un espace en dessous du logo
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingText: {
    marginTop: 10,
    color: '#8A2BE2',
    fontSize: 16,
  },
});