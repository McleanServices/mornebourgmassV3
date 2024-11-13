
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { useCookies } from 'react-cookie'; // Import useCookies from react-cookie

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cookies, setCookie] = useCookies(['token']); // Use react-cookie to set the token

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://mornebourgmass.com/api/login', {
                username,
                password
            });
            console.log("Login response:", response.data); // Log login response data

            // Set cookies
            setCookie('token', response.data.token, { path: '/', secure: true, sameSite: 'Strict' });
            console.log("Token set in cookies:", response.data.token); // Debugging information

            // Navigate to AuthLoadingScreen
            navigation.navigate('AuthLoadingScreen');
        } catch (error) {
            console.error("Login error:", error); // Log login errors
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '80%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
});