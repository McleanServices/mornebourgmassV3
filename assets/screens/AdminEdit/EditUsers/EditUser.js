import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Modal, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import axios from 'axios';
import { theme } from '../../core/Theme';
//test
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';

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
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false); // Add state to toggle password fields

  const gradeOptions = [
    { label: "Adult", value: 1 },
    { label: "Admin", value: 2 },
    { label: "Enfant", value: 3 }
  ];

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
        setGrade(user.grade || ''); // Fetch grade from the database
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
    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

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
      
      if (newPassword) {
        await axios.put(`https://c7f3-194-3-170-41.ngrok-free.app/api/user/${userId}/password`, { newPassword });
      }

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
          <Text style={styles.label}>Grade</Text>
          {gradeOptions.map((option) => (
            <Pressable 
              key={option.value} 
              style={[
                styles.radioButtonBox, 
                grade === option.value && styles.radioButtonBoxSelected
              ]}
              onPress={() => setGrade(option.value)}
            >
              <View style={styles.radioButtonContainer}>
                <RadioButton
                  value={option.value}
                  status={grade === option.value ? 'checked' : 'unchecked'}
                  onPress={() => setGrade(option.value)}
                />
                <Text>{option.label}</Text>
              </View>
            </Pressable>
          ))}
        </View>
        <Pressable
          style={styles.togglePasswordButton}
          onPress={() => setShowPasswordFields(!showPasswordFields)}
        >
          <Text style={styles.togglePasswordButtonText}>
            {showPasswordFields ? 'Cacher les champs de mot de passe' : 'Changer le mot de passe'}
          </Text>
        </Pressable>
        {showPasswordFields && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nouveau Mot de Passe</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nouveau Mot de Passe"
                secureTextEntry
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmer le Mot de Passe</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirmer le Mot de Passe"
                secureTextEntry
              />
            </View>
          </>
        )}
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
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonBox: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  radioButtonBoxSelected: {
    borderColor: theme.colors.primary,
  },
  togglePasswordButton: {
    backgroundColor: theme.colors.secondary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  togglePasswordButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EditUser;
