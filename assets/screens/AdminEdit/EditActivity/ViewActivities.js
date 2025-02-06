import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { Card, Avatar, IconButton, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { printToFileAsync } from 'expo-print';
//test

const ViewActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`https://mornebourgmass.com/api/activityscreen`);
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
        Alert.alert('Erreur', 'Une erreur s\'est produite lors de la récupération des activités');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const generatePDF = async (userData) => {
    try {
      const statutPaiement = userData.statut_paiement === 'paid' ? 'payé' : userData.statut_paiement;
      const htmlContent = `
      <html>
        <body>
          <h1>Détails de l'activité</h1>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Nom</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Prénom</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Email</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Titre de l'activité</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Date</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Statut Paiement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd;">${userData.nom}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${userData.prenom}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${userData.email}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${userData.title}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${userData.date}</td>
                <td style="padding: 12px; border: 1px solid #ddd; ${statutPaiement === 'payé' ? 'color: green; font-weight: bold;' : ''}">${statutPaiement}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

      const file = await printToFileAsync({
        html: htmlContent,
        base64: false
      });
      await Sharing.shareAsync(file.uri);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Erreur', 'Échec de la génération du PDF');
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await fetch(`https://c7f3-194-3-170-41.ngrok-free.app/api/paiement/users/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      if (data.length === 0) {
        throw new Error('No user data found');
      }
      const userData = data[0]; // Assuming the API returns an array of user data
      await generatePDF(userData);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite lors du téléchargement du PDF');
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFFFFF', '#FFFFFF']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View>
          <Text>Liste des activités</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Card style={styles.card} onPress={() => router.push('/pages/addactivity')}>
              <Card.Title
                title="Ajouter une nouvelle activité"
                left={(props) => <Avatar.Icon {...props} icon="plus" />}
                right={(props) => (
                  <IconButton {...props} icon="chevron-right" />
                )}
              />
            </Card>
            <Card style={styles.card} onPress={downloadPDF}>
              <Card.Title
                title="Télécharger PDF"
                left={(props) => <Avatar.Icon {...props} icon="file-download" />}
                right={(props) => (
                  <IconButton {...props} icon="chevron-right" />
                )}
              />
            </Card>
            {activities.map((item) => (
              <Card key={item.id} style={styles.card} onPress={() => router.push(`/pages/editactivity/${item.id}/editactivity`)}>
                <Card.Title
                  title={item.title}
                  subtitle={item.description}
                  left={(props) => <Avatar.Icon {...props} icon="calendar" />}
                  right={(props) => (
                    <IconButton {...props} icon="chevron-right" />
                  )}
                />
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    paddingVertical: 10,
  },
  card: {
    width: '90%',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    alignSelf: 'center',
  },
});

export default ViewActivities;