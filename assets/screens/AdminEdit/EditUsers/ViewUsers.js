import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Platform, TextInput, Modal, Pressable } from 'react-native';
import { Card, Avatar, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
//test
import { useAuth } from '../../../../context/auth';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = session?.token;
        if (!token) {
          throw new Error('No token found');
        }
        const response = await fetch(`https://mornebourgmass.com/api/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 403) {
          throw new Error('Access denied');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        if (error.message === 'Access denied') {
          setModalVisible(true);
        } else {
          if (Platform.OS === 'web') {
            alert('Erreur: Une erreur s\'est produite lors de la récupération des utilisateurs');
          } else {
            Alert.alert('Erreur', 'Une erreur s\'est produite lors de la récupération des utilisateurs');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [session]);

  const filteredUsers = searchQuery
    ? users.filter(user => user.id_user.toString().includes(searchQuery))
    : users;

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={`${item.prenom} ${item.nom}`}
        subtitle={`Numero Adherent: ${item.id_user}`}
        left={(props) => <Avatar.Icon {...props} icon="account" />}
        right={(props) => (
          <IconButton 
            {...props} 
            icon="eye" 
            onPress={() => router.replace(`/pages/edituser/${item.id_user}/edituser`)} 
          />
        )}
        titleStyle={styles.cardTitle}
        subtitleStyle={styles.cardSubtitle}
      />
    </Card>
  );

  return (
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
            <Text style={styles.modalText}>Accès refusé: Vous n'êtes pas autorisé à accéder à cette ressource. Veuillez vous reconnecter.</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View style={styles.searchContainer}>
            <Text style={styles.label}>Numéro Adhérent:</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Entrez le numéro adhérent"
              value={searchQuery}
              onChangeText={setSearchQuery}
              keyboardType="numeric" // Ensure the keyboard shows up
            />
          </View>
          <View style={styles.listContainer}>
            <FlatList
              data={filteredUsers}
              renderItem={renderItem}
              keyExtractor={(item) => item.id_user.toString()}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    paddingVertical: 40, // Add more vertical padding
  },
  searchContainer: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  searchInput: {
    height: 50,
    width: '100%',
    paddingHorizontal: 10,
    fontSize: 16, // Ensure the font size is not too small
  },
  listContainer: {
    flex: 1,
    marginTop: 20, // Increase top margin
  },
  card: {
    marginVertical: 10, // Increase vertical margin
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    padding: 10,
  },
  cardTitle: {
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Medium' : 'Roboto-Medium',
    fontSize: 14, // Smaller font size
  },
  cardSubtitle: {
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'Roboto-Light',
    fontSize: 12, // Smaller font size
  },
  heading: {
    fontSize: 18,
    marginBottom: 20, // Increase bottom margin
    textAlign: 'center',
    fontWeight: 'bold',
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

export default ViewUsers;
