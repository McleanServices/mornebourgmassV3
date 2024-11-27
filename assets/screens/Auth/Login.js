import React, { useState } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { Text } from "react-native-paper";

import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import axios from 'axios';
import { useCookies } from 'react-cookie'; // Import useCookies from react-cookie

import { theme } from "../core/Theme";

import { usernameValidator } from "../helpers/UsernameValidator";
import { passwordValidator } from "../helpers/PasswordValidator";
import { TouchableOpacity } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [error, setError] = useState("");
  const [cookies, setCookie] = useCookies(['token']); // Use react-cookie to get and set the token

  const onLoginPressed = async () => {
    const usernameError = usernameValidator(username.value);
    const passwordError = passwordValidator(password.value);

    if (usernameError || passwordError) {
      setUsername({ ...username, error: usernameError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      const response = await fetch("https://mornebourgmass.com/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifiant: username.value,
          password: password.value,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, userId, userRole } = data;
        // Save token, userId, and userRole to AsyncStorage
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("userId", userId.toString());
        if (userRole) {
          await AsyncStorage.setItem("userRole", userRole);
          console.log("Stored User Role:", userRole);
        }
        setCookie('token', token, { path: '/', sameSite: 'None', secure: true }); // Set the token in cookies with sameSite and secure attributes
        // Handle successful login
        console.log("Login successful", data);
        if (Platform.OS === 'web') {
          navigation.navigate('Home'); // Navigate to the Accueil screen for web
        } else {
          navigation.navigate('Home'); // Navigate to HomeAccueil in the nested navigator
        }
      } else {
        // Handle login error
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <BackButton goBack={navigation.goBack} />
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
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
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
});

export default Login;