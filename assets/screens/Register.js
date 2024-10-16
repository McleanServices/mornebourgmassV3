import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import validator from "validator";

import { theme } from "../core/Theme";

// Commenting out the validator imports for now
// import { emailValidator } from "../helpers/EmailValidator";
// import { passwordValidator } from "../helpers/PasswordValidator";
// import { nameValidator } from "../helpers/NameValidator";
// import { usernameValidator } from "../helpers/UsernameValidator"; // New helper for username
// import { phoneValidator } from "../helpers/PhoneValidator"; // New helper for phone validation
// import { dateOfBirthValidator } from "../helpers/DateOfBirthValidator"; // New helper for DOB validation

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [firstName, setFirstName] = useState({ value: "", error: "" });
  const [lastName, setLastName] = useState({ value: "", error: "" });
  const [dateOfBirth, setDateOfBirth] = useState({ value: "", error: "" });
  const [phoneNumber, setPhoneNumber] = useState({ value: "", error: "" });
  const [acceptTerms, setAcceptTerms] = useState(false); // State for checkbox

    
  
  const onSignUpPressed = async () => {
      // Removed validation logic
      if (!acceptTerms) {
        alert("You must accept the terms and conditions.");
        return;
      }
  
      if (!validator.isEmail(email.value)) {
        setEmail({ ...email, color: "red", error: "Please enter a valid email address." });
        alert("Please enter a valid email address.");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email.value, // Use email as the username
            firstName: firstName.value,
            lastName: lastName.value,
          }),
        });
  
        // Handle response here
  
      } catch (error) {
        console.error("Error during registration:", error);
      }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome.</Header>

      {/* Username Input */}
      <TextInput
        label="Username"
        returnKeyType="next"
        value={username.value}
        onChangeText={(text) => setUsername({ value: text, error: "" })}
        error={!!username.error}
        errorText={username.error}
        autoCapitalize="none"></TextInput>

      {/* First Name Input */}
      <TextInput
        label="First Name"
        returnKeyType="next"
        value={firstName.value}
        onChangeText={(text) => setFirstName({ value: text, error: "" })}
        error={!!firstName.error}
        errorText={firstName.error}
      />

      {/* Last Name Input */}
      <TextInput
        label="Last Name"
        returnKeyType="next"
        value={lastName.value}
        onChangeText={(text) => setLastName({ value: text, error: "" })}
        error={!!lastName.error}
        errorText={lastName.error}
      />

      {/* Email Input */}
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      {/* Date of Birth Input */}
      <TextInput
        label="Date of Birth (YYYY-MM-DD)"
        returnKeyType="next"
        value={dateOfBirth.value}
        onChangeText={(text) => setDateOfBirth({ value: text, error: "" })}
        error={!!dateOfBirth.error}
        errorText={dateOfBirth.error}
      />

      {/* Phone Number Input */}
      <TextInput
        label="Phone Number"
        returnKeyType="next"
        value={phoneNumber.value}
        onChangeText={(text) => setPhoneNumber({ value: text, error: "" })}
        error={!!phoneNumber.error}
        errorText={phoneNumber.error}
      />

      {/* Terms and Conditions Checkbox */}
      <View style={styles.termsContainer}>
        <TouchableOpacity
          onPress={() => setAcceptTerms(!acceptTerms)}
          style={styles.checkbox}
        >
          <Text style={acceptTerms ? styles.checked : styles.unchecked}>
            {acceptTerms ? "☑" : "☐"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          I accept the{" "}
          <TouchableOpacity onPress={() => navigation.navigate("PrivacyPolicy")}>
            <Text style={styles.link}>terms and conditions</Text>
          </TouchableOpacity>{" "}
          and{" "}
          <TouchableOpacity onPress={() => navigation.navigate("PrivacyPolicy")}>
            <Text style={styles.link}>privacy policy</Text>
          </TouchableOpacity>
          .
        </Text>
      </View>

      {/* Sign Up Button */}
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Next
      </Button>
      <View style={styles.row}>
        <Text>I already have an account!</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
          <Text style={styles.link}>Log in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checked: {
    fontSize: 18,
  },
  unchecked: {
    fontSize: 18,
    opacity: 0.5,
  },
  termsText: {
    flex: 1,
  },
});
