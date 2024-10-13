import React, { useEffect, useState } from 'react';

import { View, Text, StyleSheet} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
    const [userId, setUserId] = useState(null);

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
            <Text>Welcome, User ID: {userId}!</Text>
        ) : (
            <Text>Loading user data...</Text>
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
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    bio: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginHorizontal: 20,
    },
});

export default Profile;