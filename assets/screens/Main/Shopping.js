import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native'; // Import Platform
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { WebView } from 'react-native-webview'; // Import WebView
import axios from 'axios'; // Import axios for webhook

const paymentLink = 'https://pay.sumup.com/b2c/X4GK0WEX1S'; // Use the provided payment link

const ShoppingCart = () => {
    const [username, setUsername] = useState('');
    const slideAnim = useRef(new Animated.Value(-1000)).current; // Initial value for slide animation
    const [showPayment, setShowPayment] = useState(false); // State to control payment view
    const amount = 0.00; // Amount to be paid for testing

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const fetchedUsername = await AsyncStorage.getItem('username');
                if (fetchedUsername) {
                    setUsername(fetchedUsername);
                }
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };

        fetchUsername();

        // Start slide animation
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true, // Add this line
        }).start();
    }, []);

    const handleInscrirePress = () => {
        setShowPayment(true); // Afficher la vue de paiement
    };

    const handlePaymentError = async () => {
        console.log('Paiement échoué'); // Journaliser le paiement échoué
        try {
            await axios.post('https://mornebourgmass.com/webhook/payment-failed', {
                event_type: 'CHECKOUT_STATUS_CHANGED',
                id: 'X4GK0WEX1S', // Utiliser l'ID du lien de paiement fourni
            });
            console.log('Webhook envoyé avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'envoi du webhook:', error);
        }
    };

    const renderPayment = () => {
        console.log('Rendu du paiement avec le lien:', paymentLink); // Ajouter une journalisation
        if (Platform.OS === 'web') {
            return (
                <View style={{ flex: 1 }}>
                    <iframe
                        src={paymentLink}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        onError={handlePaymentError}
                        allow="payment" // Ajouter cette ligne pour permettre le paiement
                    />
                </View>
            );
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <WebView
                        originWhitelist={['*']}
                        source={{ uri: paymentLink }}
                        onError={handlePaymentError} // Appeler handlePaymentError en cas d'erreur
                        style={{ flex: 1 }}
                    />
                </View>
            );
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {showPayment ? (
                renderPayment() // Rendre la vue de paiement
            ) : (
                <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>
                    <TouchableOpacity style={styles.inscrireButton} onPress={handleInscrirePress}>
                        <Text style={styles.inscrireButtonText}>Aller au paiement</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#2C3E50',
        paddingHorizontal: 16,
    },
    amount: {
        fontSize: 20,
        marginVertical: 10,
        color: '#2C3E50',
    },
    inscrireButton: {
        backgroundColor: '#8A2BE2', // Couleur violette
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 10,
    },
    inscrireButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ShoppingCart;
