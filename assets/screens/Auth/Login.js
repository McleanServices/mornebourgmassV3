import React, { useState } from "react";
import { StyleSheet, View, Platform, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { useCookies } from 'react-cookie';
import { theme } from "../core/Theme";
import { usernameValidator } from "../helpers/UsernameValidator";
import { passwordValidator } from "../helpers/PasswordValidator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import axios from 'axios'; // Add axios import

const Login = ({ navigation, signIn }) => {
  const [username, setUsername] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [error, setError] = useState("");
  const [cookies, setCookie] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);

  const onLoginPressed = async () => {
    const usernameError = usernameValidator(username.value);
    const passwordError = passwordValidator(password.value);

    if (usernameError || passwordError) {
      setUsername({ ...username, error: usernameError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    setIsLoading(true); // Start loading
    try {
      const response = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({
          identifiant: username.value,
          password: password.value,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, userId } = data;
        
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userDetailsResponse = await axios.get(`${API_URL}/api/user/${decodedToken.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userRole = userDetailsResponse.data.user.role;
        const user = { id: decodedToken.id, role: userRole };

        // Store in secure storage
        await Promise.all([
          AsyncStorage.setItem("token", token),
          AsyncStorage.setItem("userData", JSON.stringify(user)),
          new Promise(resolve => {
            setCookie('token', token, { path: '/', sameSite: 'None', secure: true });
            resolve();
          })
        ]);

        // Use signIn function from context with proper parameters
        signIn(token, user);

        if (Platform.OS === 'web') {
          window.location.href = '/(tabs)';
        } else if (navigation) {
          navigation.replace('(tabs)');
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // End loading regardless of outcome
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Header>Login</Header>
      <TextInput
        label="Username"
        returnKeyType="next"
        value={username.value}
        onChangeText={(text) => setUsername({ value: text, error: "" })}
        error={!!username.error}
        errorText={username.error}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button 
        mode="contained" 
        onPress={onLoginPressed}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          "Login"
        )}
      </Button>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#8A2BE2" />
          <Text style={styles.loadingText}>Connexion en cours...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
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

export default Login;