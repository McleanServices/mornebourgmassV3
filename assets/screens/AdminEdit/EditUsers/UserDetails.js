import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserDetails = ({ route }) => {
  const { userInfo } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informations de l'utilisateur :</Text>
      {userInfo ? (
        <>
          <Text style={styles.infoText}>ID: <Text style={styles.infoValue}>{userInfo.id}</Text></Text>
          <Text style={styles.infoText}>Nom d'utilisateur: <Text style={styles.infoValue}>{userInfo.username}</Text></Text>
          <Text style={styles.infoText}>Email: <Text style={styles.infoValue}>{userInfo.email}</Text></Text>
          <Text style={styles.successMessage}>Scan réussi avec succès !</Text>
          <Button
            title="Edit User"
            onPress={() => {
              console.log('Navigating to EditUser with userId:', userInfo.id); // Log the navigation action
              navigation.navigate('EditUser', { userId: userInfo.id });
            }}
          />
        </>
      ) : (
        <Text style={styles.errorMessage}>Aucune information utilisateur trouvée.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f8ff', // Light background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2e8b57', // Dark green color for title
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333', // Dark text color
  },
  infoValue: {
    fontWeight: 'bold',
    color: '#4682b4', // Steel blue color for user info
  },
  successMessage: {
    marginTop: 20,
    fontSize: 16,
    color: '#32cd32', // Lime green for success message
    fontWeight: 'bold',
  },
  errorMessage: {
    marginTop: 20,
    fontSize: 16,
    color: 'red', // Red color for error message
    fontWeight: 'bold',
  },
});

export default UserDetails;
