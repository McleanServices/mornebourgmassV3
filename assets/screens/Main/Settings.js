import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Platform, Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCookies } from 'react-cookie'; // Import useCookies from react-cookie
import axios from 'axios'; // Import axios for API calls

const SettingsScreen = ({ navigation }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['token']); // Use react-cookie to manage cookies
    const [userDetails, setUserDetails] = useState(null); // State to store user details
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token to get user ID
                    const userId = decodedToken.id;
                    const response = await axios.get(`https://mornebourgmass.com/api/user/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUserDetails(response.data.user);
                }
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleLogout = async () => {
        // Clear AsyncStorage and cookies
        try {
            await AsyncStorage.clear().catch(error => {
                if (error.code !== 'NSCocoaErrorDomain' || error.message.indexOf('RCTAsyncLocalStorage') === -1) {
                    throw error; // Rethrow if it's not the specific error we're handling
                }
                if (error.underlyingError && error.underlyingError.code === 'NSPOSIXErrorDomain' && error.underlyingError.message.indexOf('No such file or directory') !== -1) {
                    console.warn("Specific iOS error while clearing AsyncStorage:", error);
                } else {
                    throw error; // Rethrow if it's not the specific underlying error we're handling
                }
            }); // Clear all AsyncStorage
            removeCookie('token'); // Remove token from cookies
            if (typeof localStorage !== 'undefined') {
                localStorage.clear(); // Clear localStorage if it exists
            }

            // Handle successful logout
            Alert.alert("Déconnexion réussie", "Vous avez été déconnecté.");
            if (Platform.OS === 'web') {
                window.location.reload(); // Reload the page if on web
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Auth' }],
                }); // Reset the navigation state and navigate to the Auth stack if on mobile
            }
        } catch (error) {
            Alert.alert("Échec de la déconnexion", "Une erreur s'est produite lors de la déconnexion.");
            console.error("Logout error:", error);
        }
    };

    const confirmLogout = () => {
        setModalVisible(true); // Show confirmation modal
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Paramètres</Text>
            {userDetails ? (
                <View style={styles.profileContainer}>
                    <Text style={styles.profileText}>Nom: {userDetails.nom}</Text>
                    <Text style={styles.profileText}>Prénom: {userDetails.prenom}</Text>
                    <Text style={styles.profileText}>Numéro Adhérent: {userDetails.id_user}</Text>
                    <Text style={styles.profileText}>Email: {userDetails.email}</Text>
                </View>
            ) : (
                <Text>Chargement des détails de l'utilisateur...</Text>
            )}
            
            {/* Logout Button */}
            <Button title="Déconnexion" onPress={confirmLogout} color="#FF5C5C" />

            {/* Confirmation Modal */}
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
                        <Text style={styles.modalText}>Êtes-vous sûr de vouloir vous déconnecter ?</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setModalVisible(false);
                                handleLogout();
                            }}
                        >
                            <Text style={styles.textStyle}>Oui</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonCancel]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.textStyle}>Non</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: "#2C3E50",
    },
    profileContainer: {
        marginBottom: 20,
        padding: 20,
        backgroundColor: "#E6E6FA",
        borderRadius: 10,
    },
    profileText: {
        fontSize: 18,
        marginBottom: 10,
        color: "#2C3E50",
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
        backgroundColor: '#FF5C5C',
    },
    buttonCancel: {
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

export default SettingsScreen;
