import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Button, Linking, Animated, ActivityIndicator } from 'react-native'; // Import ActivityIndicator
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import axios from 'axios';
const Activity = () => {
    const [activities, setActivities] = useState([]);
    const [username, setUsername] = useState('');
    const [paymentStatus, setPaymentStatus] = useState(null); // Add state for payment status
    const [loading, setLoading] = useState(false); // Add state for loading
    const slideAnim = useRef(new Animated.Value(-1000)).current; // Initial value for slide animation
    const navigation = useNavigation(); // Initialize navigation

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch('https://mornebourgmass.com/api/activityscreen');
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

        fetchActivities();
        fetchUsername();

        // Start slide animation
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true, // Add this line
        }).start();
    }, []);

    const checkPaymentStatus = async (paymentLink, activityId) => {
        setLoading(true); // Start loading
        try {
            const id_user = await AsyncStorage.getItem("userId"); // Get user ID from AsyncStorage

            // Check if transaction link already exists
            const checkResponse = await axios.get('http://localhost:8080/api/transactionLink', {
                params: {
                    id_user,
                    id_activityscreen: activityId // Include activity ID
                }
            });

            if (checkResponse.data.exists) {
                // Transaction link exists, open it
                const existingPaymentLink = checkResponse.data.paymentLink;
                const response = await fetch(`http://localhost:8080/api/checkPaymentStatus?paymentLink=${encodeURIComponent(existingPaymentLink)}`);
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

    useEffect(() => {
        const fetchPaymentLinks = async () => {
            try {
                const response = await fetch('https://mornebourgmass.com/api/activityscreen');
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

        fetchPaymentLinks();
    }, []);

    const handleInscrirePress = (activityId) => {
        navigation.navigate('Shopping', { activityId }); // Navigate to Shopping screen with activity ID
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
                    <Text style={styles.tickets}>Nombre de tickets: {item.nombre_max_tickets}</Text> {/* Add number of tickets */}
                    {loading ? (
                        <>
                            <ActivityIndicator size="small" color="#0000ff" /> {/* Show loader while checking payment status */}
                            <Text style={styles.checkingText}>Vérification de l'inscription...</Text> {/* Add checking text */}
                        </>
                    ) : item.paymentStatus === 'PAID' ? (
                        <Text style={styles.dejaInscritText}>Déjà inscrit</Text>
                    ) : (
                        <TouchableOpacity style={styles.inscrireButton} onPress={() => handleInscrirePress(item.id)}>
                            <Text style={styles.inscrireButtonText}>Inscrire</Text>
                        </TouchableOpacity>
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
        fontSize: 16,
        color: '#2C3E50',
        marginTop: 5,
    },
});

export default Activity;
