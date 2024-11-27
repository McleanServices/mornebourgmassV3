import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Alert, ActivityIndicator, TextInput, Platform, Modal, Pressable } from "react-native";
import { Text } from "react-native-paper";
import Header from "../../components/Header";
import Button from "../../components/Button";
import BackButton from "../../components/BackButton";
import validator from "validator";

import { theme } from "../../core/Theme";

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
  const [userId, setUserId] = useState({ value: "", error: "" }); // New state for user ID
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchNextUserId = async () => {
      try {
        const response = await fetch("https://mornebourgmass.com/api/nextUserId");
        const data = await response.json();
        setUserId({ value: data.nextUserId.toString(), error: "" });
      } catch (error) {
        console.error("Error fetching next user ID:", error);
      }
    };

    fetchNextUserId();
  }, []);

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
      setPhoneNumber({ ...phoneNumber, color: "red", error: "Veuillez entrer un numéro de téléphone valide." });
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
        setModalVisible(true); // Show success modal
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

  const formFields = [
    { placeholder: "Numéro d'adhérent", value: userId, setValue: setUserId, editable: false }, // New input field
    { placeholder: "Nom d'utilisateur", value: username, setValue: setUsername },
    { placeholder: "Prénom", value: firstName, setValue: setFirstName },
    { placeholder: "Nom", value: lastName, setValue: setLastName },
    { placeholder: "Email", value: email, setValue: setEmail, autoCapitalize: "none", autoCompleteType: "email", textContentType: "emailAddress", keyboardType: "email-address" },
    { placeholder: "Mot de passe", value: password, setValue: setPassword, secureTextEntry: true },
    { placeholder: "Date de naissance (YYYY-MM-DD)", value: dateOfBirth, setValue: setDateOfBirth },
    { placeholder: "Numéro de téléphone", value: phoneNumber, setValue: setPhoneNumber },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{item.placeholder}</Text>
      <TextInput
        returnKeyType="next"
        value={item.value.value}
        onChangeText={(text) => item.setValue({ value: text, error: "" })}
        style={styles.input}
        autoCapitalize={item.autoCapitalize}
        autoCompleteType={item.autoCompleteType}
        textContentType={item.textContentType}
        keyboardType={item.keyboardType}
        secureTextEntry={item.secureTextEntry}
        editable={item.editable !== false} // Set editable property
      />
    </View>
  );

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Utilisateur enregistré avec succès</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <FlatList
        data={formFields}
        renderItem={renderItem}
        keyExtractor={(item) => item.placeholder}
        ListHeaderComponent={<BackButton goBack={navigation.goBack} />}
        ListFooterComponent={
          <>
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
                {/* Temporary button to trigger the modal */}
                {/* <Button mode="contained" onPress={() => setModalVisible(true)} style={{ marginTop: 24 }}>
                  Show Modal
                </Button> */}
              </>
            )}
          </>
        }
        contentContainerStyle={styles.scrollContainer}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20, // Increased spacing between inputs
  },
  inputLabel: {
    position: "absolute",
    left: 10,
    top: -10,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 5,
    zIndex: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Replace shadow properties with boxShadow
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
