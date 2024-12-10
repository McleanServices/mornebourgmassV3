import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Platform, Modal, Pressable } from 'react-native';
import { API_URL } from "@env";

const EditHomeScreen = () => {
    const [id, setId] = useState(null);  // Add new state for ID
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [notreMission, setNotreMission] = useState(''); // Add state for NotreMission
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await fetch(`${API_URL}/api/homescreen`);
                if (!response.ok) {
                    throw new Error('Failed to fetch activity data');
                }
                const data = await response.json();
                console.log('Fetched data:', data); // Log the fetched data
                // Access the first item in the array
                if (data.length > 0) {
                    setId(data[0]._id);  // Store the ID
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
                setModalVisible(true); // Show success modal
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Activité Recente mise à jour avec succès</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.textStyle}>OK</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Titre</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mission</Text>
                <TextInput
                    style={styles.input}
                    value={notreMission}
                    onChangeText={setNotreMission}
                    multiline
                />
            </View>
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
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        position: "absolute",
        left: 10,
        top: -10,
        backgroundColor: '#f4f4f4',
        paddingHorizontal: 5,
        zIndex: 1,
    },
    input: {
        height: 60,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Replace shadow properties with boxShadow
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default EditHomeScreen;
