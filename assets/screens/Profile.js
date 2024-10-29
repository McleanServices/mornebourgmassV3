import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const Profile = () => {
    const [userId, setUserId] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const loadUserId = async () => {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (storedUserId) {
                setUserId(storedUserId);
            }
        };

        loadUserId();
    }, []);

    return (
        <View style={styles.container}>
            {userId ? (
                <>
                    {userId !== '21' && (
                        <>
                            <Text style={styles.welcomeText}>Bonjour, ID Utilisateur: {userId}</Text>
                            <Text style={styles.title}>Votre QR Code Personnel</Text>
                            <QRCode
                                value={String(userId)} // Generate QR code with user ID
                                size={150}
                            />
                        </>
                    )}
                </>
            ) : (
                <Text>Chargement des données utilisateur...</Text>
            )}
            
            {userId == '21' && (
                <Button
                    title="Scanner un QR Code"
                    onPress={() => navigation.navigate('scancode')}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default Profile;
