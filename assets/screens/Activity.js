import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Button } from 'react-native';

// Local images
const Image1 = require('../images/photo1.jpg');
const Image2 = require('../images/photo2.jpg');
const Image3 = require('../images/photo3.jpg');

// Sample event data
const carnivalActivities = [
    {
        id: '1',
        title: 'Parade du Carnaval',
        date: '2024-10-20', // ISO format for easier comparison
        time: '15h00 - 18h00',
        description: 'Une parade avec musique et chars colorés.',
        image: Image1,
    },
    {
        id: '2',
        title: 'Atelier de Danse',
        date: '2024-10-21',
        time: '10h00 - 13h00',
        description: 'Apprenez les danses traditionnelles du carnaval.',
        image: Image2,
    },
    {
        id: '3',
        title: 'Concours de Costumes',
        date: '2023-10-22',
        time: '17h00 - 20h00',
        description: 'Participez à notre concours de costumes et gagnez des prix!',
        image: Image3,
    },
];

// Helper function to check if event is in the future
const isUpcoming = (eventDate) => {
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    return eventDateObj >= today;
};

const ActivityScreen = () => {
    // Split events into upcoming and past based on the current date
    const upcomingEvents = carnivalActivities.filter(event => isUpcoming(event.date));
    const pastEvents = carnivalActivities.filter(event => !isUpcoming(event.date));

    // Combine both event types into one array with section headers
    const combinedEvents = [
        { type: 'header', title: 'Upcoming Events' },
        ...upcomingEvents.map(event => ({ ...event, type: 'event' })),
        { type: 'header', title: 'Past Events' },
        ...pastEvents.map(event => ({ ...event, type: 'event' })),
    ];

    // Render an event item
    const renderItem = ({ item }) => {
        if (item.type === 'header') {
            return <Text style={styles.sectionTitle}>{item.title}</Text>;
        }
        return (
            <TouchableOpacity style={styles.item}>
                <Image source={item.image} style={styles.image} />
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDate}>{item.date} - {item.time}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                {isUpcoming(item.date) && (
                    <Button title="Reserve a Spot" onPress={() => alert('Spot reserved for ' + item.title)} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={combinedEvents}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id ? item.id : index.toString()}
                contentContainerStyle={styles.column}
            />
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
        color: '#ff5722',
    },
    column: {
        paddingBottom: 20,
    },
    item: {
        padding: 15,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    itemDate: {
        fontSize: 14,
        color: '#777',
    },
    itemDescription: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
});

export default ActivityScreen;
