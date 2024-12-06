import React, { useEffect, useState } from 'react';
import { Animated, Image, StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressBar } from 'react-native-paper';

export default function Loading({ navigation }) {
  return (
    <LinearGradient
      colors={['#89CFF0', '#89CFF0', '#FFA500']}
      style={styles.container}
    >
      <Image
        source={require('../Screenimages/logo.webp')}
        style={styles.reactLogo}
      />
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} color="#4C4C9D" style={styles.progressBar} />
        <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#89CFF0', // Set a solid background color to avoid gradient rendering delay
  },
  reactLogo: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    marginBottom: 20, // Add margin to separate elements
  },
  progressContainer: {
    width: '80%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 10,
    borderRadius: 5,
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4C4C9D',
  },
});
