import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ScanCodeScreen = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState(''); 
  

  // Request camera permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Handle scanning the QR code
  const handleBarcodeScanned = async ({ data }) => {
    setScanned(true);
    try {
      const response = await axios.get(`https://keigonwilson.com/api/user/${data}`);
      if (response.status === 200) {
        navigation.navigate('UserDetails', { userInfo: response.data.user });
      }
    } catch (err) {
      setError('Failed to fetch user info.');
    }
  };

  if (hasPermission === null) {
    return <Text style={styles.permissionText}>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.errorText}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'], // You can add more types if needed
        }}
      />

      {scanned && (
        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  camera: {
    flex: 1,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ScanCodeScreen;
