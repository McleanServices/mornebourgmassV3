
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { Card, Avatar, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ViewPalmares = () => {
  const [palmares, setPalmares] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPalmares = async () => {
      try {
        const response = await fetch('https://mornebourgmass.com/api/palmares');
        if (!response.ok) {
          throw new Error('Failed to fetch palmares');
        }
        const data = await response.json();
        setPalmares(data);
      } catch (error) {
        console.error('Error fetching palmares:', error);
        if (Platform.OS === 'web') {
          alert('Erreur: Une erreur s\'est produite lors de la récupération des palmarès');
        } else {
          Alert.alert('Erreur', 'Une erreur s\'est produite lors de la récupération des palmarès');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPalmares();
  }, []);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.title}
        subtitle={item.description}
        left={(props) => <Avatar.Icon {...props} icon="trophy" />}
        right={(props) => (
          <IconButton {...props} icon="pencil" onPress={() => navigation.navigate("EditPalmares", { id: item.id })} />
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
          data={palmares}
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

export default ViewPalmares;