import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import axios from 'axios';
import { theme } from '../../core/Theme'; // Import theme

const EditUser = ({ route }) => {
  const { userId } = route.params;
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

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`https://mornebourgmass.com/api/user/${userId}`);
        const user = response.data.user;
        setUserInfo(user);
        setIdentifiant(user.identifiant);
        setEmail(user.email);
        setNom(user.nom);
        setPrenom(user.prenom);
        setNumeroTelephone(user.numero_telephone);
        setDateNaissance(user.date_naissance.split('T')[0]); // Format date_naissance to exclude time part
        setRole(user.role);
        setGrade(user.grade);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, [userId]);

  const handleSave = async () => {
    try {
      const formattedDateNaissance = date_naissance.split('T')[0]; // Format date_naissance to YYYY-MM-DD
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
      if (response.status === 200) {
        console.log('User information saved:', updatedUser);
        setSuccessMessage('Utilisateur enregistré avec succès.');
        setModalVisible(true);
      } else {
        console.error('Error saving user info:', response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('Error saving user info: User not found');
      } else if (error.response && error.response.status === 500) {
        console.error('Error saving user info: Internal server error', error.response.data);
      } else {
        console.error('Error saving user info:', error);
      }
    }
  };

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

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
            <Text style={styles.modalText}>{successMessage}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Modifier l'utilisateur</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Numéro Adhérent</Text>
          <TextInput
            style={styles.input}
            value={userInfo.id_user.toString()}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Identifiant</Text>
          <TextInput
            style={styles.input}
            value={identifiant}
            onChangeText={setIdentifiant}
            placeholder="Identifiant"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nom</Text>
          <TextInput
            style={styles.input}
            value={nom}
            onChangeText={setNom}
            placeholder="Nom"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Prénom</Text>
          <TextInput
            style={styles.input}
            value={prenom}
            onChangeText={setPrenom}
            placeholder="Prénom"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Numéro Téléphone</Text>
          <TextInput
            style={styles.input}
            value={numero_telephone}
            onChangeText={setNumeroTelephone}
            placeholder="Numéro Téléphone"
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Date Naissance</Text>
          <TextInput
            style={styles.input}
            value={date_naissance}
            onChangeText={setDateNaissance}
            placeholder="Date Naissance"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Rôle</Text>
          <TextInput
            style={styles.input}
            value={role}
            onChangeText={setRole}
            placeholder="Rôle"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Grade</Text>
          <TextInput
            style={styles.input}
            value={grade}
            onChangeText={setGrade}
            placeholder="Grade"
          />
        </View>
        <Button title="Enregistrer" onPress={handleSave} />
      </ScrollView>
    </>
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
  inputLabel: {
    position: 'absolute',
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
});

export default EditUser;
