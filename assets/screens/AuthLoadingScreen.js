import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function AuthLoadingScreen({ navigation }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem("token");
            console.log("Token from AsyncStorage:", token); // Debugging information

            if (token) {
                try {
                    console.log("Attempting to authenticate with token"); // Debugging information
                    const response = await axios.get('https://mornebourgmass.com/api/account', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        timeout: 5000 // Set a timeout of 5 seconds
                    });

                    console.log("Authentication successful:", response.data); // Debugging information
                    // If successful, navigate to home/dashboard
                    navigation.navigate('Home');
                } catch (error) {
                    if (error.code === 'ECONNABORTED') {
                        console.error("Request timed out:", error); // Log timeout errors
                    } else {
                        console.error("Error during authentication:", error); // Log any other errors
                    }
                    // If token is invalid, navigate to login
                    navigation.navigate('Welcome');
                } finally {
                    console.log("Setting loading to false in catch block"); // Debugging information
                    setLoading(false);
                }
            } else {
                // No token found, navigate to login
                console.log("No token found, navigating to Welcome");
                navigation.navigate('Welcome');
                console.log("Setting loading to false in else block"); // Debugging information
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        console.log("Loading state is true, showing ActivityIndicator"); // Debugging information
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
                <Text>Loading...</Text>
            </View>
        );
    }

    console.log("Loading state is false, returning empty View"); // Debugging information
    return <View />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
