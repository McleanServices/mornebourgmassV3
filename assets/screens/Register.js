import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { Text } from "react-native-paper";
import Header from "../components/Header";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import validator from "validator";

import { theme } from "../core/Theme";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [firstName, setFirstName] = useState({ value: "", error: "" });
  const [lastName, setLastName] = useState({ value: "", error: "" });
  const [dateOfBirth, setDateOfBirth] = useState({ value: "", error: "" });
  const [phoneNumber, setPhoneNumber] = useState({ value: "", error: "" });
  const [role, setRole] = useState("user"); // Default role
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const onSignUpPressed = async () => {
    if (!validator.isEmail(email.value)) {
      setEmail({ ...email, color: "red", error: "Veuillez entrer une adresse email valide." });
      return;
    }
    if (!validator.isAlpha(firstName.value)) {
      setFirstName({ ...firstName, color: "red", error: "Veuillez entrer un prénom valide." });
      return;
    }
    if (!validator.isDate(dateOfBirth.value)) {
      setDateOfBirth({ ...dateOfBirth, color: "red", error: "Veuillez entrer une date de naissance valide." });
      return;
    }
    if (!validator.isMobilePhone(phoneNumber.value)) {
      setPhoneNumber({ ...phoneNumber, color: "red", error: "Veuillez entrer un numéro de t��léphone valide." });
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      console.log("Sending registration request with data:", {
        identifiant: email.value,
        nom: lastName.value,
        prenom: firstName.value,
        role: role,
      });

      const response = await fetch("https://mornebourgmass.com/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifiant: email.value, // Use email as the identifiant
          nom: lastName.value,
          prenom: firstName.value,
          email: email.value,
          password: password.value,
          numero_telephone: phoneNumber.value, // Updated field name
          date_naissance: dateOfBirth.value,
          role: role,
        }),
      });

      const responseData = await response.json();
      console.log("Registration response:", responseData);

      setLoading(false); // Hide loading indicator

      if (response.ok) {
        setSuccessMessage("Utilisateur enregistré avec succès."); // Set success message
        Alert.alert("Succès", "Utilisateur enregistré avec succès.");
      } else {
        setSuccessMessage(""); // Clear success message
        Alert.alert("Erreur", `Une erreur s'est produite lors de l'enregistrement: ${responseData.message}`);
      }
    } catch (error) {
      setLoading(false); // Hide loading indicator
      console.error("Error during registration:", error);
      Alert.alert("Erreur", `Une erreur s'est produite lors de l'enregistrement: ${error.message}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <BackButton goBack={navigation.goBack} />
        <Header>Bienvenue.</Header>

        <TextInput
          placeholder="Nom d'utilisateur"
          returnKeyType="next"
          value={username.value}
          onChangeText={(text) => setUsername({ value: text, error: "" })}
          style={styles.input}
        />

        <TextInput
          placeholder="Prénom"
          returnKeyType="next"
          value={firstName.value}
          onChangeText={(text) => setFirstName({ value: text, error: "" })}
          style={styles.input}
        />

        <TextInput
          placeholder="Nom"
          returnKeyType="next"
          value={lastName.value}
          onChangeText={(text) => setLastName({ value: text, error: "" })}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          returnKeyType="next"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: "" })}
          style={styles.input}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Mot de passe"
          returnKeyType="done"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: "" })}
          style={styles.input}
          secureTextEntry
        />

        <TextInput
          placeholder="Date de naissance (YYYY-MM-DD)"
          returnKeyType="next"
          value={dateOfBirth.value}
          onChangeText={(text) => setDateOfBirth({ value: text, error: "" })}
          style={styles.input}
        />

        <TextInput
          placeholder="Numéro de téléphone"
          returnKeyType="next"
          value={phoneNumber.value}
          onChangeText={(text) => setPhoneNumber({ value: text, error: "" })}
          style={styles.input}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Button mode="contained" onPress={onSignUpPressed} style={{ marginTop: 24 }}>
              Ajouter
            </Button>
            {successMessage ? (
              <Text style={styles.successMessage}>{successMessage}</Text>
            ) : null}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  successMessage: {
    color: "green",
    marginTop: 10,
    textAlign: "center",
  },
});
