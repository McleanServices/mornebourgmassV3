import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Linking, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { API_URL } from "@env";

const ShoppingCart = () => {
    const route = useRoute(); 
    const { activityId } = route.params; 
    const [username, setUsername] = useState('');
    const [paymentLink, setPaymentLink] = useState('');
    const slideAnim = useRef(new Animated.Value(-1000)).current;
    const [showPayment, setShowPayment] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [manualLink, setManualLink] = useState('');
    const [loadingPercentage, setLoadingPercentage] = useState(0);

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

        const fetchPaymentLink = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/activityscreen/${activityId}`);
                if (response.data) {
                    setPaymentLink(response.data.payment_link);
                    setManualLink(response.data.payment_link);
                }
            } catch (error) {
                console.error('Error fetching payment link:', error);
            }
        };

        fetchUsername();
        fetchPaymentLink();

        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [activityId]);

    const handlePaymentLinkClick = async () => {
        try {
            setLoading(true); // Show loader
            setLoadingPercentage(0); // Reset loading percentage

            const updateLoadingPercentage = (percentage) => {
                setLoadingPercentage(percentage);
            };

            const response = await axios.get(`${API_URL}/api/activityscreen/${activityId}`);
            updateLoadingPercentage(25); // Update loading percentage

            if (response.data) {
                const paymentLink = response.data.payment_link;
                // Get id_user from AsyncStorage
                const id_user = await AsyncStorage.getItem("userId");
                updateLoadingPercentage(50); // Update loading percentage

                // Check if transaction link already exists
                const checkResponse = await axios.get(`${API_URL}/api/transactionLink`, {
                    params: {
                        id_user,
                        id_activityscreen: activityId // Include activity ID
                    }
                });
                updateLoadingPercentage(75); // Update loading percentage

                if (checkResponse.data.exists) {
                    // Transaction link exists, open it
                    Linking.openURL(checkResponse.data.paymentLink);
                } else {
                    // Payment link does not exist, create a new one
                    await axios.put(`${API_URL}/api/paiement`, {
                        id_user,
                        id_activityscreen: activityId // Include activity ID
                    }, {
                        params: {
                            paymentLink // Use paymentLink from query parameters
                        }
                    });

                    // Recheck if transaction link exists
                    const recheckResponse = await axios.get(`${API_URL}/api/transactionLink`, {
                        params: {
                            id_user,
                            id_activityscreen: activityId // Include activity ID
                        }
                    });
                    updateLoadingPercentage(100); // Update loading percentage

                    if (recheckResponse.data.exists) {
                        // Transaction link exists, open it
                        Linking.openURL(recheckResponse.data.paymentLink);
                    } else {
                        Linking.openURL(paymentLink);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching payment link:', error);
        } finally {
            setLoading(false); // Hide loader
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#8A2BE1" />
                        <Text style={styles.loaderText}>{loadingPercentage}%</Text>
                    </View>
                ) : (
                    <>
                        {manualLink && (
                            <TouchableOpacity style={styles.manualLinkButton} onPress={handlePaymentLinkClick}>
                                <Text style={styles.manualLinkButtonText}>Ouvrir le lien de paiement</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </Animated.View>
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
        backgroundColor: '#8A2BE2',
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
    manualLinkButton: {
        backgroundColor: '#8A2BE2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 10,
    },
    manualLinkButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderText: {
        marginTop: 10,
        fontSize: 16,
        color: '#8A2BE2',
    },
});

export default ShoppingCart;
