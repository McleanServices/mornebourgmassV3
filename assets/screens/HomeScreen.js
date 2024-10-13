import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const HomeScreen = () => {
    return (
        <ScrollView style={styles.container}>
            {/* First Section - Image */}
            <View style={styles.imageSection}>
                <Image 
                    source={{uri: 'https://via.placeholder.com/400x200'}} 
                    style={styles.image} 
                    resizeMode="cover" 
                />
            </View>

            {/* Second Section - Activity */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Activities</Text>
                <View style={styles.column}>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>Activity 1</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>Activity 2</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>Activity 3</Text>
                    </View>
                </View>
            </View>

            {/* Third Section - Palmares (Achievements as Cards) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Palmares</Text>
                <View style={styles.column}>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Achievement 1</Text>
                        <Text style={styles.cardDescription}>Description of achievement 1.</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Achievement 2</Text>
                        <Text style={styles.cardDescription}>Description of achievement 2.</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Achievement 3</Text>
                        <Text style={styles.cardDescription}>Description of achievement 3.</Text>
                    </View>
                </View>
            </View>
            
        </ScrollView>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    imageSection: {
        height: 200,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    section: {
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    column: {
        flexDirection: 'column',
    },
    item: {
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    cardDescription: {
        fontSize: 14,
        color: '#777',
    },
});

export default HomeScreen;
