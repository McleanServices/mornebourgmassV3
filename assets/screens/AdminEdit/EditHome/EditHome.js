import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const EditHome = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await fetch('https://mornebourgmass.com/api/activity');
                if (!response.ok) {
                    throw new Error('Failed to fetch activity data');
                }
                const data = await response.json();
                console.log('Fetched data:', data); // Log the fetched data
                // Access the first item in the array
                if (data.length > 0) {
                    setTitle(data[0].title);
                    setDescription(data[0].description);
                } else {
                    console.warn('No data found'); // Log a warning if the array is empty
                }
            } catch (error) {
                console.error('Error fetching activity:', error);
            }
        };

        fetchActivity();
    }, []);

    const handleUpdate = async () => {
        try {
            const response = await fetch('https://mornebourgmass.com/api/activity', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });

            if (response.ok) {
                // Handle successful update, maybe navigate back or show a success message
            } else {
                const errorData = await response.json();
                console.error('Update failed:', errorData.message);
            }
        } catch (error) {
            console.error('Error updating activity:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter title"
                placeholderTextColor="#999"
            />
            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                placeholderTextColor="#999"
                multiline
            />
            <Button title="Update Activity" onPress={handleUpdate} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    input: {
        height: 60,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        fontSize: 16,
    },
});

export default EditHome;
