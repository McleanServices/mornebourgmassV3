import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

const Profile = () => {
    return (
        <View style={styles.container}>
            
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.bio}>Software Developer at XYZ Company</Text>
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