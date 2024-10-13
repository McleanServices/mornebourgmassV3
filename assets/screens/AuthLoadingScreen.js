import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function AuthLoadingScreen({ navigation }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('token');

            if (token) {
                try {
                    const response = await axios.get('http://localhost:3000/user/account', {
                        headers: {
                            Authorization: token
                        }
                    });

                    // If successful, navigate to home/dashboard
                    navigation.navigate('Home');
                } catch (error) {
                    // If token is invalid, navigate to login
                    navigation.navigate('Login');
                }
            } else {
                // No token found, navigate to login
                navigation.navigate('Login');
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    return <View />;
}
