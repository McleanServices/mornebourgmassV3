import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from "@env";
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/auth';

const SettingsScreen = () => {
    const router = useRouter();
    const { signOut, session } = useAuth();
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        if (session?.token) {
            console.log('Token:', session.token);
        }
        const fetchUserDetails = async () => {
            try {
                const storedDetails = await AsyncStorage.getItem('userDetails');
                if (storedDetails) {
                    setUserDetails(JSON.parse(storedDetails));
                } else if (session?.user?.id) {
                    const response = await axios.get(`${API_URL}/api/user/${session.user.id}`);
                    const userData = response.data.user;
                    await AsyncStorage.setItem('userDetails', JSON.stringify(userData));
                    setUserDetails(userData);
                }
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            }
        };

        fetchUserDetails();
    }, [session]);

    const handleSignOut = () => {
        signOut();
        router.replace('/login');
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.header}>Paramètres</Text>
                {userDetails ? (
                    <View style={styles.profileContainer}>
                        <Text style={styles.profileText}>Nom: {userDetails.nom}</Text>
                        <Text style={styles.profileText}>Prénom: {userDetails.prenom}</Text>
                        <Text style={styles.profileText}>Numéro Adhérent: {userDetails.id_user}</Text>
                        <Text style={styles.profileText}>Email: {userDetails.email}</Text>
                        <Text style={styles.profileText}>Role: {userDetails.role}</Text>
                        <Text style={styles.profileText}>Token: {session?.token}</Text>
                        <TouchableOpacity 
                            style={styles.signOutButton} 
                            onPress={handleSignOut}
                        >
                            <Text style={styles.signOutButtonText}>Se déconnecter</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text>Chargement des détails de l'utilisateur...</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
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
    signOutButton: {
        backgroundColor: '#E74C3C',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    signOutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default SettingsScreen;
