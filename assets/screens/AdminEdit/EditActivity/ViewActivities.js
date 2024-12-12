import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { Card, Avatar, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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
        if (Platform.OS === 'web') {
          alert('Erreur: Une erreur s\'est produite lors de la récupération des activités');
        } else {
          Alert.alert('Erreur', 'Une erreur s\'est produite lors de la récupération des activités');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

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