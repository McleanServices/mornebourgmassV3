import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { Card, Avatar, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={`${item.prenom} ${item.nom}`}
        subtitle={item.email}
        left={(props) => <Avatar.Icon {...props} icon="account" />}
        right={(props) => (
          <IconButton 
            {...props} 
            icon="eye" 
            onPress={() => navigation.navigate('EditUser', { userId: item.id_user })} // Navigate to EditUser
          />
        )}
        titleStyle={styles.cardTitle}
        subtitleStyle={styles.cardSubtitle}
      />
    </Card>
  );

  const renderSection = (title, data) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_user.toString()}
      />
    </View>
  );

  const admins = users.filter(user => user.role === 'admin');
  const regularUsers = users.filter(user => user.role === 'user');

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {renderSection('Admins', admins)}
          {renderSection('Users', regularUsers)}
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
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'Roboto-Bold',
  },
  card: {
    marginVertical: 10,
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
});

export default ViewUsers;
