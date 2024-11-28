import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { Card, Avatar, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://mornebourgmass.com/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        if (Platform.OS === 'web') {
          alert('Erreur: Une erreur s\'est produite lors de la récupération des utilisateurs');
        } else {
          Alert.alert('Erreur', 'Une erreur s\'est produite lors de la récupération des utilisateurs');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = selectedUserId
    ? users.filter(user => user.id_user.toString() === selectedUserId)
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
            onPress={() => navigation.navigate('EditUser', { userId: item.id_user })} 
          />
        )}
        titleStyle={styles.cardTitle}
        subtitleStyle={styles.cardSubtitle}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.heading}>Rechercher utilisateur par numéro adhérent</Text>
          <View style={styles.listContainer}>
            <Picker
              selectedValue={selectedUserId}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedUserId(itemValue)}
            >
              {users.map(user => (
                <Picker.Item key={user.id_user} label={user.id_user.toString()} value={user.id_user.toString()} />
              ))}
            </Picker>
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
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 30, // Increase bottom margin
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 30, // Increase bottom margin
  },
  listContainer: {
    flex: 1,
    marginTop: 30, // Increase top margin
  },
  card: {
    marginVertical: 15, // Increase vertical margin
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Medium' : 'Roboto-Medium',
  },
  cardSubtitle: {
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'Roboto-Light',
  },
  heading: {
    fontSize: 16,
    marginBottom: 30, // Increase bottom margin
    textAlign: 'center',
  },
});

export default ViewUsers;
