import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserDetails = ({ route }) => {
  const { userInfo } = route.params;
  const navigation = useNavigation();
  const busRegler = true; // Simulate the bus_regler property

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informations de l'utilisateur :</Text>
      {userInfo ? (
        <View style={styles.card}>
          <Text style={styles.infoText}>Nom: <Text style={styles.infoValue}>{userInfo.nom}</Text></Text>
          <Text style={styles.infoText}>Prénom: <Text style={styles.infoValue}>{userInfo.prenom}</Text></Text>
          <Text style={styles.infoText}>Numéro Adhérent: <Text style={styles.infoValue}>{userInfo.id_user}</Text></Text>
          <Text style={styles.infoText}>Numéro Téléphone: <Text style={styles.infoValue}>{userInfo.numero_telephone}</Text></Text>
          {busRegler && (
            <Text style={styles.busRegler}>Bus Regler</Text>
          )}
          <TouchableOpacity
            style={styles.warningButton}
            onPress={() => console.log('Ajouter Avertissement pressed')}
          >
            <Text style={styles.warningButtonText}>Ajouter Avertissement</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#F4F4F4", // Match Home.js background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#2C3E50", // Match Home.js title color
    fontFamily: 'Roboto-Bold', // Use a better font
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    width: '90%',
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#2C3E50", // Match Home.js text color
    fontFamily: 'Roboto-Regular', // Use a better font
  },
  infoValue: {
    fontWeight: 'bold',
    color: "#8A2BE2", // Match Home.js accent color
    fontFamily: 'Roboto-Bold', // Use a better font
  },
  busRegler: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 10,
  },
  warningButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
  },
  warningButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successMessage: {
    marginTop: 20,
    fontSize: 16,
    color: '#32cd32', // Lime green for success message
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold', // Use a better font
  },
  errorMessage: {
    marginTop: 20,
    fontSize: 16,
    color: 'red', // Red color for error message
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold', // Use a better font
  },
});

export default UserDetails;
