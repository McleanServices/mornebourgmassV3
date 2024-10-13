import React from 'react';
import { View, Text, Switch, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
    const [isEnabled, setIsEnabled] = React.useState(false);
    
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    
    const handleLogout = async () => {
        // Clear AsyncStorage
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userId');

            // Navigate to the login screen
            navigation.navigate('Welcome');
            Alert.alert("Logout successful", "You have been logged out.");
        } catch (error) {
            Alert.alert("Logout failed", "An error occurred while logging out.");
            console.error("Logout error:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Settings</Text>
            <View style={styles.settingItem}>
                <Text style={styles.settingText}>Enable Notifications</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>
            
            {/* Logout Button */}
            <Button title="Logout" onPress={handleLogout} color="#FF5C5C" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    settingText: {
        fontSize: 18,
    },
});

export default SettingsScreen;
