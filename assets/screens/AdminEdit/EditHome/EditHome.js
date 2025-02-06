import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Platform, Modal, Pressable, TouchableOpacity } from 'react-native';
//test

const EditHomeScreen = () => {
    const [id, setId] = useState(null);  // Add new state for ID
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [notreMission, setNotreMission] = useState(''); // Add state for NotreMission
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [inputErrors, setInputErrors] = useState({}); // Define inputErrors state
    const isFormValid = title && description && notreMission; // Add form validation logic

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await fetch(`https://mornebourgmass.com/api/homescreen`);
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
                <Text style={styles.label}>Titre</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                />
                {inputErrors.title && <Text style={styles.errorText}>{inputErrors.title}</Text>}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />
                {inputErrors.description && <Text style={styles.errorText}>{inputErrors.description}</Text>}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Mission</Text>
                <TextInput
                    style={styles.input}
                    value={notreMission}
                    onChangeText={setNotreMission}
                    multiline
                />
                {inputErrors.notreMission && <Text style={styles.errorText}>{inputErrors.notreMission}</Text>}
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <TouchableOpacity
                    style={[styles.button, !isFormValid && { backgroundColor: "#ccc" }]}
                    onPress={handleUpdate}
                    disabled={!isFormValid}
                >
                    <Text style={styles.buttonText}>Mettre à jour l'activité</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: '#f4f4f4',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
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
        backgroundColor: '#2196F3', // Ensure default background color is set
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
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default EditHomeScreen;
