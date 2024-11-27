import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const EditUser = ({ route }) => {
  const { userId } = route.params;
  const [userInfo, setUserInfo] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [numero_telephone, setNumeroTelephone] = useState('');
  const [date_naissance, setDateNaissance] = useState('');
  const [role, setRole] = useState('');
  const [grade, setGrade] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`https://mornebourgmass.com/api/user/${userId}`);
        const user = response.data.user;
        setUserInfo(user);
        setUsername(user.username);
        setEmail(user.email);
        setNom(user.nom);
        setPrenom(user.prenom);
        setNumeroTelephone(user.numero_telephone);
        setDateNaissance(user.date_naissance);
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
      const updatedUser = {
        username,
        email,
        nom,
        prenom,
        numero_telephone,
        date_naissance,
        role,
        grade,
      };
      await axios.put(`https://mornebourgmass.com/api/user/${userId}`, updatedUser);
      console.log('User information saved:', updatedUser);
    } catch (error) {
      console.error('Error saving user info:', error);
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit User</Text>
      <Text>ID: {userInfo.id_user}</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={nom}
        onChangeText={setNom}
        placeholder="Nom"
      />
      <TextInput
        style={styles.input}
        value={prenom}
        onChangeText={setPrenom}
        placeholder="Prenom"
      />
      <TextInput
        style={styles.input}
        value={numero_telephone}
        onChangeText={setNumeroTelephone}
        placeholder="Numero Telephone"
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        value={date_naissance}
        onChangeText={setDateNaissance}
        placeholder="Date Naissance"
      />
      <TextInput
        style={styles.input}
        value={role}
        onChangeText={setRole}
        placeholder="Role"
      />
      <TextInput
        style={styles.input}
        value={grade}
        onChangeText={setGrade}
        placeholder="Grade"
      />
      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2e8b57',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default EditUser;
