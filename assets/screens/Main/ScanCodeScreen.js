import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import axios from 'axios';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const ScanCodeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
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
      const response = await axios.get(`https://mornebourgmass.com/api/user/${data}`);
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

      {isFocused && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'], 
          }}
        />
      )}
      
      <View style={styles.overlay}>
        <View style={styles.topOverlay} />
        <View style={styles.middleOverlay}>
          <View style={styles.sideOverlay} />
          <View style={styles.frame} />
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay} />
      </View>

      {scanned && (
        <Button title={'Scanner à nouveau'} onPress={() => setScanned(false)} />
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  middleOverlay: {
    flexDirection: 'row',
  },
  sideOverlay: {
    flex: 1,
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  frame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#00FF00',
  },
  bottomOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
