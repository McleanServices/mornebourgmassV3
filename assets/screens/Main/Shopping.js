import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Linking, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
//test
import { useAuth } from '../../../context/auth';

const ShoppingScreen = () => {
    const router = useRouter(); 
    const { session } = useAuth();
    const [activityId, setActivityId] = useState(null); // Add state for activityId
    const [paymentLink, setPaymentLink] = useState('');
    const slideAnim = useRef(new Animated.Value(-1000)).current;
    const [showPayment, setShowPayment] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [manualLink, setManualLink] = useState('');
    const [loadingPercentage, setLoadingPercentage] = useState(0);

    useEffect(() => {
        const getActivityIdFromStorage = async () => {
            try {
                const storedActivityId = await AsyncStorage.getItem('selectedActivityId');
                if (storedActivityId) {
                    setActivityId(storedActivityId);
                }
            } catch (error) {
                console.error('Error getting activity ID from AsyncStorage:', error);
            }
        };

        getActivityIdFromStorage();

        const fetchPaymentLink = async () => {
            try {
                const response = await axios.get(`https://mornebourgmass.com/api/activityscreen/${activityId}`);
                if (response.data) {
                    setPaymentLink(response.data.payment_link);
                    setManualLink(response.data.payment_link);
                }
            } catch (error) {
                console.error('Error fetching payment link:', error);
            }
        };

        if (activityId) {
            fetchPaymentLink();
        }

        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [activityId]);

    const handlePaymentLinkClick = async () => {
        try {
            setLoading(true);
            setLoadingPercentage(0); 

            const updateLoadingPercentage = (percentage) => {
                setLoadingPercentage(percentage);
            };

            const response = await axios.get(`https://mornebourgmass.com/api/activityscreen/${activityId}`);
            updateLoadingPercentage(25); 

            if (response.data) {
                const paymentLink = response.data.payment_link;
                const id_user = session?.user?.id;
                updateLoadingPercentage(50);

                const checkResponse = await axios.get(`https://mornebourgmass.com/api/transactionLink`, {
                    params: {
                        id_user,
                        id_activityscreen: activityId 
                    }
                });
                updateLoadingPercentage(75); 

                if (checkResponse.data.exists) {
                    Linking.openURL(checkResponse.data.paymentLink);
                } else {
                    await axios.put(`https://mornebourgmass.com/api/paiement`, {
                        id_user,
                        id_activityscreen: activityId 
                    }, {
                        params: {
                            paymentLink 
                        }
                    });

                    const recheckResponse = await axios.get(`https://mornebourgmass.com/api/transactionLink`, {
                        params: {
                            id_user,
                            id_activityscreen: activityId 
                        }
                    });
                    updateLoadingPercentage(100); 

                    if (recheckResponse.data.exists) {
                        Linking.openURL(recheckResponse.data.paymentLink);
                    } else {
                        Linking.openURL(paymentLink);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching payment link:', error);
        } finally {
            setLoading(false); 
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

export default ShoppingScreen;
