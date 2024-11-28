import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Reglementation = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>En développement</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
});

export default Reglementation;
