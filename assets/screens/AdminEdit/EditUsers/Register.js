import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  ScrollView,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
//test
import DateTimePicker from "@react-native-community/datetimepicker";
import validator from "validator";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { Picker } from '@react-native-picker/picker'; // Add this import at the top

const RegisterScreen = () => {
  const [nextUserId, setNextUserId] = useState("");
  const [identifiant, setIdentifiant] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateNaissance, setDateNaissance] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [grade, setGrade] = useState(1); // Default to 1 (adult) - now as integer
  const [dateInput, setDateInput] = useState(''); // Add this state
  const [gradeModalVisible, setGradeModalVisible] = useState(false); // Add new state for grade modal

  const gradeOptions = [
    { label: "Adult", value: 1 },    // Changed to integers
    { label: "Admin", value: 2 },
    { label: "Enfant", value: 3 }
  ];

  useEffect(() => {
    const fetchNextUserId = async () => {
      try {
        const response = await axios.get(`https://mornebourgmass.com/api/nextUserId`);
        setNextUserId(response.data.nextUserId);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du prochain ID utilisateur:",
          error
        );
      }
    };

    const loadSavedData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("registerData");
        if (savedData) {
          const {
            identifiant,
            nom,
            prenom,
            email,
            password,
            phoneNumber,
            dateNaissance,
            grade // Load saved grade
          } = JSON.parse(savedData);
          setIdentifiant(identifiant);
          setNom(nom);
          setPrenom(prenom);
          setEmail(email);
          setPassword(password);
          setPhoneNumber(phoneNumber);
          setDateNaissance(new Date(dateNaissance));
          setGrade(grade); // Set grade
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données sauvegardées:",
          error
        );
      }
    };

    fetchNextUserId();
    loadSavedData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        const data = {
          identifiant,
          nom,
          prenom,
          email,
          password,
          phoneNumber,
          dateNaissance: dateNaissance.toISOString(),
          grade // Save grade
        };
        await AsyncStorage.setItem("registerData", JSON.stringify(data));
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des données:", error);
      }
    };

    saveData();
  }, [identifiant, nom, prenom, email, password, phoneNumber, dateNaissance, grade]);

  useEffect(() => {
    if (password !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
    } else {
      setPasswordError("");
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    const checkFormValidity = () => {
      if (
        identifiant &&
        nom &&
        prenom &&
        email &&
        password &&
        confirmPassword &&
        phoneNumber &&
        dateNaissance
      ) {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    };

    checkFormValidity();
  }, [identifiant, nom, prenom, email, password, confirmPassword, phoneNumber, dateNaissance]);

  const handleRegister = async () => {
    console.log("Register button clicked"); // Log when the register button is clicked

    let valid = true;

    if (!validator.isEmail(email)) {
      setEmailError("Veuillez entrer une adresse email valide");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    try {
      const response = await axios.post(`https://mornebourgmass.com/api/register`, {
        identifiant,
        nom,
        prenom,
        email,
        password,
        numero_telephone: phoneNumber.toString(), // Ensure phone number is varchar
        date_naissance: dateNaissance.toISOString().split("T")[0],
        grade: parseInt(grade) // Ensure grade is sent as integer
      });

      if (response.status === 201) {
        await AsyncStorage.removeItem("registerData"); // Clear saved data upon successful registration
        setModalVisible(true);
      } else {
        Alert.alert(
          "Échec de l'inscription",
          "Une erreur s'est produite lors de l'inscription de l'utilisateur"
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription de l'utilisateur:", error);
      Alert.alert(
        "Échec de l'inscription",
        "Une erreur s'est produite lors de l'inscription de l'utilisateur"
      );
    }
  };

  const handleSaveProgress = async () => {
    try {
      const data = {
        identifiant,
        nom,
        prenom,
        email,
        password,
        phoneNumber,
        dateNaissance: dateNaissance.toISOString(),
        grade // Save grade
      };
      await AsyncStorage.setItem("registerData", JSON.stringify(data));
      Alert.alert(
        "Progression sauvegardée",
        "Vos données ont été sauvegardées avec succès"
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données:", error);
      Alert.alert(
        "Erreur",
        "Une erreur s'est produite lors de la sauvegarde des données"
      );
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'web') {
      // For web platform
      const inputDate = event.target.value;
      setDateInput(inputDate);
      
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(inputDate)) {
        const newDate = new Date(inputDate);
        if (!isNaN(newDate.getTime())) {
          setDateNaissance(newDate);
        }
      }
    } else {
      // For mobile platforms
      const currentDate = selectedDate || dateNaissance;
      setShowDatePicker(Platform.OS === "ios");
      setDateNaissance(currentDate);
    }
  };

  const formatDateInput = (value) => {
    // Remove any non-digit characters
    const cleanValue = value.replace(/\D/g, '');
    
    // Add hyphens after YYYY and MM
    if (cleanValue.length >= 6) {
      return `${cleanValue.slice(0, 4)}-${cleanValue.slice(4, 6)}-${cleanValue.slice(6, 8)}`;
    } else if (cleanValue.length >= 4) {
      return `${cleanValue.slice(0, 4)}-${cleanValue.slice(4)}`;
    }
    return cleanValue;
  };

  const handleDateInputChange = (text) => {
    const formatted = formatDateInput(text);
    setDateInput(formatted);
    
    // Update dateNaissance if valid date
    if (/^\d{4}-\d{2}-\d{2}$/.test(formatted)) {
      const newDate = new Date(formatted);
      if (!isNaN(newDate.getTime())) {
        setDateNaissance(newDate);
      }
    }
  };

  const handleGradeSelection = (value) => {
    setGrade(value);
    setGradeModalVisible(false);
  };

  return (
    <>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
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
                <Text style={styles.modalText}>
                  Utilisateur enregistré avec succès
                </Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.textStyle}>OK</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <Text style={styles.label}>Numéro adhérent</Text>
          <TextInput
            style={styles.input}
            value={nextUserId.toString()}
            editable={false}
          />
          <Text style={styles.label}>Identifiant</Text>
          <TextInput
            style={styles.input}
            value={identifiant}
            onChangeText={setIdentifiant}
          />
          <Text style={styles.label}>Nom</Text>
          <TextInput style={styles.input} value={nom} onChangeText={setNom} />
          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            value={prenom}
            onChangeText={setPrenom}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, emailError ? styles.errorInput : null]}
            value={email}
            onChangeText={setEmail}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={[styles.input, passwordError ? styles.errorInput : null]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <TextInput
            style={[styles.input, passwordError ? styles.errorInput : null]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          <Text style={styles.label}>Numéro de Téléphone</Text>
          <TextInput
            style={[styles.input, phoneError ? styles.errorInput : null]}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}
          <Text style={styles.label}>Date de Naissance</Text>
          {Platform.OS === 'web' ? (
            <>
              <TextInput
                style={styles.input}
                value={dateInput}
                onChangeText={handleDateInputChange}
                placeholder="YYYYMMDD"
                maxLength={10}
                keyboardType="numeric"
              />
              <Text style={styles.formatHint}>
                Format: YYYYMMDD (ex: 1990-01-01)
              </Text>
            </>
          ) : (
            <>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={[styles.input, { marginBottom: 50 }]}
              >
                <Text style={{ fontSize: 16, color: "#000" }}>
                  {dateNaissance.toISOString().split("T")[0] ||
                    "Sélectionner la date"}
                </Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={dateNaissance}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </>
          )}
          <Text style={styles.label}>Type Adherent</Text>
          {Platform.OS === 'web' ? (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={grade}
                onValueChange={(itemValue) => setGrade(parseInt(itemValue))}
                style={styles.picker}
              >
                {gradeOptions.map((option) => (
                  <Picker.Item 
                    key={option.value} 
                    label={option.label} 
                    value={option.value} 
                  />
                ))}
              </Picker>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.gradeButton}
                onPress={() => setGradeModalVisible(true)}
              >
                <Text style={styles.gradeButtonText}>
                  {gradeOptions.find(opt => opt.value === grade)?.label || 'Sélectionner'}
                </Text>
              </TouchableOpacity>

              <Modal
                animationType="slide"
                transparent={true}
                visible={gradeModalVisible}
                onRequestClose={() => setGradeModalVisible(false)}
              >
                <View style={styles.gradeModalContainer}>
                  <View style={styles.gradeModalContent}>
                    <Text style={styles.gradeModalTitle}>Sélectionner le type</Text>
                    {gradeOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={styles.gradeModalButton}
                        onPress={() => handleGradeSelection(option.value)}
                      >
                        <Text style={styles.gradeModalButtonText}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={[styles.gradeModalButton, styles.cancelButton]}
                      onPress={() => setGradeModalVisible(false)}
                    >
                      <Text style={styles.gradeModalButtonText}>Annuler</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSaveProgress}
            >
              <Text style={styles.buttonText}>Sauvegarder la progression</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, !isFormValid && { backgroundColor: "#ccc" }]}
              onPress={handleRegister}
              disabled={!isFormValid}
            >
              <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    elevation: 5,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  formatHint: {
    fontSize: 12,
    color: '#666',
    marginTop: -10,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  gradeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  gradeButtonText: {
    fontSize: 16,
  },
  gradeModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  gradeModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  gradeModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  gradeModalButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  gradeModalButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
});

export default RegisterScreen;
