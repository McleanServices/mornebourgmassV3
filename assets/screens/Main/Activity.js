import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Button } from 'react-native';

const Activity = () => {
    const [activities, setActivities] = useState([]);

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

        fetchActivities();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.time}>{item.time}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
    );

    return (
        <FlatList
            data={activities}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
        />
    );
};

const styles = StyleSheet.create({
    item: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 5,
        boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.8)',
        elevation: 1,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 14,
        color: '#888',
    },
    time: {
        fontSize: 14,
        color: '#888',
    },
    description: {
        fontSize: 16,
        marginTop: 5,
    },
});

export default Activity;
