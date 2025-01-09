import React, { useEffect, useState } from 'react';
import { Alert, View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Pressable, Platform, ScrollView, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Reglementation = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [primaryImage, setPrimaryImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageName, setImageName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Désolé, nous avons besoin des permissions de la galerie pour que cela fonctionne !');
        }
      }
    })();
    const fetchImages = async () => {
      try {
        const response = await axios.get('https://332b-190-102-23-156.ngrok-free.app/api/uploads');
        setImages(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des images :', error);
      }
    };

    const fetchPrimaryImage = async () => {
      try {
        const response = await axios.get('https://332b-190-102-23-156.ngrok-free.app/api/primary-image');
        setPrimaryImage(response.data.image);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'image principale :', error);
      }
    };

    const fetchUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('Role');
        if (role !== null) {
          setUserRole(role);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle de l\'utilisateur :', error);
      }
    };

    fetchImages();
    fetchPrimaryImage();
    fetchUserRole();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setImageUrl(result.assets[0].uri);
        console.log('URL de l\'image sélectionnée :', result.assets[0].uri); // Ajouté console log
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image');
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('Aucune image sélectionnée', 'Veuillez d\'abord sélectionner une image');
      return null;
    }

    if (!imageName.trim()) {
      Alert.alert('Nom de l\'image manquant', 'Veuillez entrer un nom pour l\'image');
      return null;
    }

    setLoading(true); // Start loading
    let formData = new FormData();
    formData.append('image', {
      uri: selectedImage,
      name: `${imageName}.jpg`,
      type: 'image/jpeg',
    });

    try {
      let response = await fetch(`https://332b-190-102-23-156.ngrok-free.app/api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });

      let result;
      try {
        result = await response.json();
      } catch (error) {
        console.error('Erreur lors de l\'analyse du JSON :', error);
        const text = await response.text();
        console.error('Texte de la réponse :', text);
        Alert.alert('Erreur de téléchargement', 'Une erreur est survenue lors du téléchargement de l\'image');
        return null;
      }

      if (response.ok) {
        Alert.alert('Téléchargement réussi', 'Image téléchargée avec succès');
        setImageUrl(result.imageUrl);
        return result.imageUrl;
      } else {
        Alert.alert('Échec du téléchargement', result.message);
        return null;
      }
    } catch (error) {
      console.error('Erreur de téléchargement :', error);
      Alert.alert('Erreur de téléchargement', 'Une erreur est survenue lors du téléchargement de l\'image');
      return null;
    } finally {
      setLoading(false); // Stop loading
      console.log('Téléchargement terminé.');
    }
  };

  const setPrimaryImageDirectory = async (image) => {
    try {
      await axios.put('https://332b-190-102-23-156.ngrok-free.app/api/primary-image', { image });
      setPrimaryImage(image);
    } catch (error) {
      console.error('Erreur lors de la définition de l\'image principale :', error);
    }
  };

  const resetPrimaryImage = () => {
    setPrimaryImage(null);
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.userRoleText}>Rôle de l'utilisateur : {userRole}</Text>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.text}>Réglementation</Text>
            {primaryImage && (
              <View style={styles.webviewContainer}>
                <WebView
                  source={{ uri: `https://332b-190-102-23-156.ngrok-free.app/api/uploads/${primaryImage}` }}
                  style={styles.webview}
                />
                {userRole === 'admin' && (
                  <Button title="Réinitialiser" onPress={resetPrimaryImage} />
                )}
              </View>
            )}
          </>
        }
        data={primaryImage ? [] : images}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedImage(item)}>
            <Text style={styles.imageText}>{item}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <>
            {userRole === 'admin' && (
              <>
                {selectedImage && (
                  <>
                    <Button
                      title="Définir comme principal"
                      onPress={() => setPrimaryImageDirectory(selectedImage)}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Entrez le nom de l'image"
                      value={imageName}
                      onChangeText={setImageName}
                    />
                    <Pressable style={styles.uploadButton} onPress={uploadImage}>
                      <Text>Télécharger l'image</Text>
                    </Pressable>
                  </>
                )}
                <Pressable style={styles.imagePicker} onPress={pickImage}>
                  <Text>Sélectionner une image depuis la galerie</Text>
                </Pressable>
                {loading && <Text>Téléchargement...</Text>}
              </>
            )}
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginVertical: 20,
  },
  imageText: {
    fontSize: 16,
    color: '#34495E',
    textAlign: 'center',
    marginVertical: 5,
  },
  webviewContainer: {
    height: 300, // Définir une hauteur fixe pour le conteneur
    marginBottom: 20,
  },
  webview: {
    flex: 1,
  },
  imagePicker: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  userRoleText: {
    fontSize: 18,
    color: '#34495E',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default Reglementation;
