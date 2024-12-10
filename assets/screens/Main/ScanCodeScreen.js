import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import axios from 'axios';
import { useRouter, useFocusEffect, Link } from 'expo-router';
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScanCodeScreen = () => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState(''); 
  const [navigated, setNavigated] = useState(false);
  
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
    if (!navigated) {
      try {
        setNavigated(true);
        await AsyncStorage.setItem('userData', data);
        router.replace({
          pathname: '/pages/userdetails/[id]/userdetails',
          params: { id: data }
        });
      } catch (err) {
        setError('Failed to save user data.');
        setNavigated(false);
      }
    }
  };

  useFocusEffect(() => {
    if (hasPermission === null || hasPermission === false) {
      return;
    }
    return () => {
      setScanned(false);
      setNavigated(false);
    };
  });

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
          barcodeTypes: ['qr'], 
        }}
      />
      
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
