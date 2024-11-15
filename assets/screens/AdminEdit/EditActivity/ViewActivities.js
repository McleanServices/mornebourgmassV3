
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { Card, Avatar, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ViewActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('https://mornebourgmass.com/api/activityscreen');
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

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.title}
        subtitle={item.description}
        left={(props) => <Avatar.Icon {...props} icon="calendar" />}
        right={(props) => (
          <IconButton {...props} icon="pencil" onPress={() => navigation.navigate("EditActivityScreen", { id: item.id })} />
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={activities}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
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
  card: {
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
});

export default ViewActivities;