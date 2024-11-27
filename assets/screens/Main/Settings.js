import React from 'react';
import { View, Text, Switch, StyleSheet, Button, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
    const [isEnabled, setIsEnabled] = React.useState(false);
    
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    
    const handleLogout = async () => {
        // Clear AsyncStorage
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userId');

            // Handle successful logout
            Alert.alert("Logout successful", "You have been logged out.");
            if (Platform.OS === 'web') {
                window.location.reload(); // Reload the page if on web
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Auth' }],
                }); // Reset the navigation state and navigate to the Auth stack if on mobile
            }
        } catch (error) {
            Alert.alert("Logout failed", "An error occurred while logging out.");
            console.error("Logout error:", error);
        }
    };

    const testApiGet = async () => {
        try {
          const response = await fetch("http://145.223.73.21:80/api/test");
          const data = await response.json();
          console.log("GET response data:", data);
        } catch (err) {
          console.error("GET request error:", err);
        }
      };
      
      // Call this function in useEffect or on a button press to test the GET request
      

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
