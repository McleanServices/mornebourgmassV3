import React, {useRef} from 'react';
import { Animated,TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Text, View, Button } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function Welcome() {
    const navigation = useNavigation();

    const animatedValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(animatedValue, {
            toValue: 0.8,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
      Animated.spring(animatedValue, {
          toValue: 1,
          useNativeDriver: true,
      }).start(() => {
          navigation.push('Login');
      });
  };

  const animatedStyle = {
      transform: [{ scale: animatedValue }],
  };


return (
    <LinearGradient
      colors={['#89CFF0', '#89CFF0', '#FFA500']}
      style={styles.container}
    >
        <Image
        source={require('../images/logo.png')}
        style={styles.reactLogo}
      />
    {/* <Button
        title="Commencer"
        onPress={() => {
            navigation.push('Login');
        }}
        color={styles.button.color}
    /> */}

<Animated.View style={animatedStyle}>
                <TouchableOpacity
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={styles.button}
                >
                    <View style={styles.buttonTextContainer}>
                        <Text style={styles.buttonText}>Commencer</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
     
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
      button: {
        backgroundColor: '#4C4C9D', // Blue color
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonTextContainer: {
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF', // White text color
        fontSize: 16,
    },
    
  });
  



