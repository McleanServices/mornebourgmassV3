import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Text, View, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function Welcome() {
    const navigation = useNavigation();

return (
    <LinearGradient
      colors={['#89CFF0', '#89CFF0', '#FFA500']}
      style={styles.container}
    >
        <Image
        source={require('../images/logo.png')}
        style={styles.reactLogo}
      />
    <Button
        title="Go to Next Page"
        onPress={() => {
            navigation.push('Login');
        }}
    />
     
    </LinearGradient>
);
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    reactLogo: {
        width: 350,
        height: 350,
        resizeMode: 'contain',
      },
    
  });
  



