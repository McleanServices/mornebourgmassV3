import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Modal, Pressable, ScrollView, Alert, Platform } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { API_URL } from "@env";
import DateTimePicker from '@react-native-community/datetimepicker';
import validator from 'validator';
import PhoneInput from 'react-native-phone-input';

const RegisterScreen = () => {
  const router = useRouter();
  const [nextUserId, setNextUserId] = useState('');
  const [identifiant, setIdentifiant] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateNaissance, setDateNaissance] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    const fetchNextUserId = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/nextUserId`);
        setNextUserId(response.data.nextUserId);
      } catch (error) {
        console.error('Erreur lors de la récupération du prochain ID utilisateur:', error);
      }
    };

    fetchNextUserId();
  }, []);

  const handleRegister = async () => {
    let valid = true;

    if (!validator.isEmail(email)) {
      setEmailError('Veuillez entrer une adresse email valide');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!phone.isValidNumber()) {
      setPhoneError('Veuillez entrer un numéro de téléphone valide');
      valid = false;
    } else {
      setPhoneError('');
    }

    if (!valid) return;

    try {
      const response = await axios.post(`${API_URL}/api/register`, {
        identifiant,
        nom,
        prenom,
        email,
        password,
        numero_telephone: phoneNumber,
        date_naissance: dateNaissance.toISOString().split('T')[0],
      });

      if (response.status === 201) {
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription de l\'utilisateur:', error);
      Alert.alert('Échec de l\'inscription', 'Une erreur s\'est produite lors de l\'inscription de l\'utilisateur');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateNaissance;
    setShowDatePicker(Platform.OS === 'ios');
    setDateNaissance(currentDate);
  };

  return (
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
              <Text style={styles.modalText}>Utilisateur enregistré avec succès</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(false);
                  router.back();
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
        <TextInput
          style={styles.input}
          value={nom}
          onChangeText={setNom}
        />
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
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.label}>Numéro de Téléphone</Text>
        <PhoneInput
          style={[styles.input, phoneError ? styles.errorInput : null]}
          value={phoneNumber}
          onChangePhoneNumber={setPhoneNumber}
        />
        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
        <Text style={styles.label}>Date de Naissance</Text>
        <Pressable onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text style={{ fontSize: 16, color: '#000' }}>
            {dateNaissance.toISOString().split('T')[0] || "Sélectionner la date"}
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
        <Button title="S'inscrire" onPress={handleRegister} />
      </View>
    </ScrollView>
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
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
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
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
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
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
});

export default RegisterScreen;
