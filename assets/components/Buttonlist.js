import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const ButtonListScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {[...Array(10)].map((_, index) => (
        <Button
          key={index}
          title={`Button ${index + 1}`}
          onPress={() => navigation.navigate(`Screen${index + 1}`)}
          disabled={true} // Set to true to disable button
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});

export default ButtonListScreen;
