import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';

const EditHome = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [notreMission, setNotreMission] = useState(''); // Add state for NotreMission
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await fetch('https://mornebourgmass.com/api/homescreen');
                if (!response.ok) {
                    throw new Error('Failed to fetch activity data');
                }
                const data = await response.json();
                console.log('Fetched data:', data); // Log the fetched data
                // Access the first item in the array
                if (data.length > 0) {
                    setTitle(data[0].title);
                    setDescription(data[0].description);
                    setNotreMission(data[0].NotreMission); // Ensure NotreMission is set from response
                } else {
                    console.warn('No data found'); // Log a warning if the array is empty
                }
            } catch (error) {
                console.error('Error fetching activity:', error);
            }
        };

        fetchActivity();
    }, []);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://mornebourgmass.com/api/activity', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description, NotreMission: notreMission }), // Ensure NotreMission is included in request body
            });

            if (response.ok) {
                if (Platform.OS === 'web') {
                    alert('Succès: Activité Recente mise à jour avec succès');
                } else {
                    Alert.alert('Succès', 'Activité Recente mise à jour avec succès');
                }
                // Handle successful update, maybe navigate back or show a success message
            } else {
                const errorData = await response.json();
                console.error('Échec de la mise à jour:', errorData.message);
                if (Platform.OS === 'web') {
                    alert('Erreur: Échec de la mise à jour de l\'activité');
                } else {
                    Alert.alert('Erreur', 'Échec de la mise à jour de l\'activité');
                }
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'activité:', error);
            if (Platform.OS === 'web') {
                alert('Erreur: Une erreur s\'est produite lors de la mise à jour de l\'activité');
            } else {
                Alert.alert('Erreur', 'Une erreur s\'est produite lors de la mise à jour de l\'activité');
            }
        } finally {
            setLoading(false);
        }
    };

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
            <TextInput
                style={styles.input}
                value={notreMission}
                onChangeText={setNotreMission}
                placeholder="Entrez la mission"
                placeholderTextColor="#999"
                multiline
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Mettre à jour l'activité" onPress={handleUpdate} />
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

export default EditHome;
