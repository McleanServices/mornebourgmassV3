import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useCookies } from 'react-cookie'; // Import useCookies from react-cookie
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function AuthLoadingScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [cookies] = useCookies(['token']); // Use react-cookie to get the token

    useEffect(() => {
        const checkAuth = async () => {
            console.log("Cookies:", cookies); // Log all cookies
            let token = cookies.token;
            console.log("Token from cookies:", token); // Debugging information

            if (!token && typeof window !== 'undefined') {
                token = localStorage.getItem('token'); // Check localStorage for token
                console.log("Token from localStorage:", token); // Debugging information
            }

            if (!token) {
                token = await AsyncStorage.getItem('token'); // Check AsyncStorage for token
                console.log("Token from AsyncStorage:", token); // Debugging information
            }

            if (token) {
                try {
                    console.log("Attempting to authenticate with token"); // Debugging information
                    const response = await axios.get('https://mornebourgmass.com/api/account', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        timeout: 20000 // Increase timeout to 20 seconds
                    });
                    console.log("Request headers:", response.config.headers); // Log request headers
                    console.log("Request URL:", response.config.url); // Log request URL
                    console.log("Response status:", response.status); // Log response status
                    console.log("Response data:", response.data); // Log response data

                    console.log("Authentication successful:", response.data); // Debugging information
                    // If successful, navigate to home/dashboard
                    navigation.navigate('Home');
                } catch (error) {
                    if (error.code === 'ECONNABORTED') {
                        console.error("Request timed out:", error); // Log timeout errors
                        // Retry the request once more after a timeout
                        try {
                            console.log("Retrying authentication with token"); // Debugging information
                            const retryResponse = await axios.get('https://mornebourgmass.com/api/account', {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                },
                                timeout: 5000 // Increase timeout to 20 seconds
                            });
                            console.log("Retry request headers:", retryResponse.config.headers); // Log request headers
                            console.log("Retry request URL:", retryResponse.config.url); // Log request URL
                            console.log("Retry response status:", retryResponse.status); // Log response status
                            console.log("Retry response data:", retryResponse.data); // Log response data

                            console.log("Retry authentication successful:", retryResponse.data); // Debugging information
                            // If successful, navigate to home/dashboard
                            navigation.navigate('Home');
                        } catch (retryError) {
                            console.error("Retry error during authentication:", retryError); // Log retry errors
                            if (retryError.response) {
                                console.error("Retry response status:", retryError.response.status); // Log response status
                                console.error("Retry response data:", retryError.response.data); // Log response data
                            } else {
                                console.error("No retry response received:", retryError.message); // Log if no response received
                            }
                            navigation.navigate('Welcome');
                        }
                    } else {
                        console.error("Error during authentication:", error); // Log any other errors
                        if (error.response) {
                            console.error("Response status:", error.response.status); // Log response status
                            console.error("Response data:", error.response.data); // Log response data
                        } else {
                            console.error("No response received:", error.message); // Log if no response received
                        }
                        navigation.navigate('Welcome');
                    }
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
    }, [cookies]);

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
