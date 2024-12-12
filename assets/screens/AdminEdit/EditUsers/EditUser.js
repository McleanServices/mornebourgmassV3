import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Modal, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import axios from 'axios';
import { theme } from '../../core/Theme';
//test
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditUser = () => {
  const { id } = useLocalSearchParams();
  const userId = id;
  const [userInfo, setUserInfo] = useState(null);
  const [identifiant, setIdentifiant] = useState('');
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [numero_telephone, setNumeroTelephone] = useState('');
  const [date_naissance, setDateNaissance] = useState('');
  const [role, setRole] = useState('');
  const [grade, setGrade] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const [confirmUserId, setConfirmUserId] = useState(''); // Add state for confirm userId

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`https://mornebourgmass.com/api/user/${userId}`);
        const user = response.data.user;
        setUserInfo(user);
        setIdentifiant(user.identifiant || '');
        setEmail(user.email || '');
        setNom(user.nom || '');
        setPrenom(user.prenom || '');
        setNumeroTelephone(user.numero_telephone || '');
        setDateNaissance(user.date_naissance ? user.date_naissance.split('T')[0] : ''); 
        setRole(user.role || '');
        setGrade(user.grade || '');
        await AsyncStorage.setItem('userId', userId); // Save userId in AsyncStorage
      } catch (error) {
        setError(<Text>Error fetching user info: {error.message}</Text>);
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  const handleSave = async () => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        "Confirmation",
        "Êtes-vous sûr de vouloir mettre à jour les informations de l'utilisateur? Veuillez entrer l'ID utilisateur pour confirmer.",
        [
          {
            text: "Annuler",
            style: "cancel"
          },
          {
            text: "Confirmer",
            onPress: () => {
              Alert.prompt(
                "Confirmer l'ID utilisateur",
                "Veuillez entrer l'ID utilisateur pour confirmer.",
                [
                  {
                    text: "Annuler",
                    style: "cancel"
                  },
                  {
                    text: "Confirmer",
                    onPress: async (inputUserId) => {
                      if (inputUserId === userId) {
                        saveUserData();
                      } else {
                        Alert.alert("Erreur", "L'ID utilisateur ne correspond pas.");
                      }
                    }
                  }
                ],
                "plain-text"
              );
            }
          }
        ]
      );
    } else {
      // On Android, directly save without confirmation
      saveUserData();
    }
  };

  const saveUserData = async () => {
    try {
      const formattedDateNaissance = date_naissance.split('T')[0]; 
      const updatedUser = {
        identifiant,
        email,
        nom,
        prenom,
        numero_telephone,
        date_naissance: formattedDateNaissance,
        role,
        grade,
      };
      const response = await axios.put(`https://mornebourgmass.com/api/user/${userId}`, updatedUser);
      if (!!response && response.status === 200) {
        setSuccessMessage('Utilisateur enregistré avec succès.');
        setModalVisible(true);
      } else {
        setSuccessMessage('Error saving user info: ' + (response?.data?.message || 'Unknown error'));
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error during axios.put:', error); // Added console log for error
      let errorMessage = 'Error saving user info: ';
      if (error.response?.status === 404) {
        errorMessage += 'User not found';
      } else if (error.response?.status === 500) {
        errorMessage += 'Internal server error';
      } else {
        errorMessage += error.message || 'Unknown error';
      }
      setError(<Text>{errorMessage}</Text>);
      setModalVisible(true);
    }
  };

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Modal
          animationType="slide"
          transparent={!!true}
          visible={!!modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{successMessage || ''}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Text style={styles.title}>Modifier l'utilisateur</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Numéro Adhérent</Text>
          <TextInput
            style={styles.input}
            value={userInfo.id_user.toString()}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Identifiant</Text>
          <TextInput
            style={styles.input}
            value={identifiant}
            onChangeText={setIdentifiant}
            placeholder="Identifiant"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            value={nom}
            onChangeText={setNom}
            placeholder="Nom"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            value={prenom}
            onChangeText={setPrenom}
            placeholder="Prénom"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Numéro Téléphone</Text>
          <TextInput
            style={styles.input}
            value={numero_telephone}
            onChangeText={setNumeroTelephone}
            placeholder="Numéro Téléphone"
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date Naissance</Text>
          <TextInput
            style={styles.input}
            value={date_naissance}
            onChangeText={setDateNaissance}
            placeholder="Date Naissance"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Rôle</Text>
          <TextInput
            style={styles.input}
            value={role}
            onChangeText={setRole}
            placeholder="Rôle"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Grade</Text>
          <TextInput
            style={styles.input}
            value={grade}
            onChangeText={setGrade}
            placeholder="Grade"
          />
        </View>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
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
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default EditUser;
