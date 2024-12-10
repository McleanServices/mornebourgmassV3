import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Button, Linking, Animated, ActivityIndicator } from 'react-native'; // Import ActivityIndicator
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import axios from 'axios';
import debounce from 'lodash.debounce'; // Import debounce from lodash
import { API_URL } from "@env";
import { useAuth } from '../../../context/auth';

const ActivityScreen = () => {
    const router = useRouter();
    const { session } = useAuth();
    const [activities, setActivities] = useState([]);
    const [username, setUsername] = useState('');
    const [paymentStatus, setPaymentStatus] = useState(null); // Add state for payment status
    const [loading, setLoading] = useState(false); // Add state for loading
    const slideAnim = useRef(new Animated.Value(-1000)).current; // Initial value for slide animation

    const fetchActivities = async () => {
        try {
            const response = await fetch(`${API_URL}/api/activityscreen`);
            if (!response.ok) {
                throw new Error('Failed to fetch activities');
            }
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

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

    const checkPaymentStatus = async (paymentLink, activityId) => {
        setLoading(true); // Start loading
        try {
            const id_user = session?.user?.id; // Get user ID from session

            // Check if transaction link already exists
            const checkResponse = await axios.get(`${API_URL}/api/transactionLink`, {
                params: {
                    id_user,
                    id_activityscreen: activityId // Include activity ID
                }
            });

            if (checkResponse.data.exists) {
                // Transaction link exists, open it
                const existingPaymentLink = checkResponse.data.paymentLink;
                const response = await fetch(`${API_URL}/api/checkPaymentStatus?paymentLink=${encodeURIComponent(existingPaymentLink)}`);
                const data = await response.json();
                console.log('Payment Status:', data);
                return data.status; // Return payment status
            } else {
                // Payment link does not exist
                return null;
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
            return null;
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const fetchPaymentLinks = async () => {
        try {
            const response = await fetch(`${API_URL}/api/activityscreen`);
            if (!response.ok) {
                throw new Error('Failed to fetch payment links');
            }
            const data = await response.json();
            const updatedActivities = await Promise.all(data.map(async (activity) => {
                if (activity.payment_link) {
                    const paymentStatus = await checkPaymentStatus(activity.payment_link, activity.id); // Pass activity ID
                    return { ...activity, paymentStatus };
                }
                return activity;
            }));
            setActivities(updatedActivities);
        } catch (error) {
            console.error('Error fetching payment links:', error);
        }
    };

    useEffect(() => {
        fetchActivities();
        fetchUsername();

        // Start slide animation
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true, // Add this line
        }).start();
    }, []);

    const debouncedFetchActivities = useCallback(debounce(fetchActivities, 300), []);
    const debouncedFetchPaymentLinks = useCallback(debounce(fetchPaymentLinks, 300), []);

    useEffect(() => {
        // Replace useFocusEffect with useEffect
        debouncedFetchActivities();
        debouncedFetchPaymentLinks();
    }, [debouncedFetchActivities, debouncedFetchPaymentLinks]);

    const handleInscrirePress = (activityId) => {
        router.push({
            pathname: '/shopping',
            params: { activityId }
        });
    };

    const formatDate = (dateString) => {
        const months = [
            'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
        ];
        const [year, month, day] = dateString.split('-');
        return `le ${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
    };

    const renderItem = ({ item }) => {
        const formattedDate = formatDate(item.date.split('T')[0]); // Format date
        return (
            <View style={styles.item}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.dateTime}>{formattedDate} à {item.time}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    {item.nombre_ticket === 0 ? (
                        <Text style={styles.noTicketsText}>Ticket non disponible</Text>
                    ) : (
                        <>
                            <Text style={styles.tickets}>Nombre de tickets: {item.nombre_ticket}</Text>
                            {loading ? (
                                <>
                                    <ActivityIndicator size="small" color="#0000ff" /> 
                                    <Text style={styles.checkingText}>Vérification de l'inscription...</Text>
                                </>
                            ) : item.paymentStatus === 'PAID' ? (
                                <Text style={styles.dejaInscritText}>Déjà inscrit</Text>
                            ) : (
                                <TouchableOpacity style={styles.inscrireButton} onPress={() => handleInscrirePress(item.id)}>
                                    <Text style={styles.inscrireButtonText}>Inscrire</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>
            </View>
        );
    };

    return (
        <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>
            <Text style={styles.header}>Voici nos activités à venir</Text>
            <FlatList
                data={activities}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#2C3E50',
        paddingHorizontal: 16,
    },
    item: {
        flexDirection: 'row',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Replace shadow properties with boxShadow
        elevation: 5,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    dateTime: {
        fontSize: 16,
        color: '#2C3E50',
        marginTop: 5,
    },
    description: {
        fontSize: 16,
        marginTop: 10,
        color: '#555',
    },
    inscrireButton: {
        backgroundColor: '#8A2BE2', // Purple color
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
    dejaInscritText: {
        color: 'green',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    checkingText: {
        color: '#0000ff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    tickets: {
        fontSize: 18, // Increase font size
        color: '#2C3E50',
        marginTop: 5,
        fontWeight: 'bold', // Make text bold
        backgroundColor: '#E0E0E0', // Add background color
        padding: 5, // Add padding
        borderRadius: 5, // Add border radius
        textAlign: 'center', // Center align text
    },
    noTicketsText: {
        fontSize: 18,
        color: 'red',
        marginTop: 5,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ActivityScreen;
