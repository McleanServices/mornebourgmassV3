import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';

const EditPalmares = () => {
  const route = useRoute();
  const { id } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchPalmares = async () => {
      try {
        const response = await fetch(`https://mornebourgmass.com/api/palmares/${id}`);
        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data for testing
        if (data) {
          setTitle(data.title);
          setDescription(data.description);
        } else {
          console.warn('No data found'); // Log a warning if no data is found
        }
      } catch (error) {
        console.error('Error fetching palmares:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPalmares();
  }, [id]);

  const handleUpdatePalmares = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://mornebourgmass.com/api/palmares/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        Alert.alert('Succès', 'Palmarès mis à jour avec succès');
      } else {
        const errorData = await response.json();
        Alert.alert('Erreur', `Échec de la mise à jour: ${errorData.message}`);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de la mise à jour du palmarès');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Entrez le titre"
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Entrez la description"
        placeholderTextColor="#999"
        multiline
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Mettre à jour le palmarès" onPress={handleUpdatePalmares} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  input: {
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
});

export default EditPalmares;