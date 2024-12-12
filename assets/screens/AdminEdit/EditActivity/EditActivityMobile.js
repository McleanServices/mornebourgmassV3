import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Modal, Pressable, Alert, Platform, ScrollView, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
//test

const EditActivityMobile = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [showPaymentLink, setShowPaymentLink] = useState(false);
  const [activityTitle, setActivityTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [disableDelete, setDisableDelete] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchActivity = async () => {
        try {
          const response = await fetch(`https://mornebourgmass.com/api/activityscreen/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch activity');
          }
          const data = await response.json();
          setTitle(data.title);
          setActivityTitle(data.title);
          setDescription(data.description);
          setImageUrl(data.imageUrl);
          setDate(new Date(data.date));
          setTime(new Date(`1970-01-01T${data.time}Z`));
          setPaymentLink(data.payment_link);

          // Check if the activity has payments
          const paymentResponse = await fetch(`https://mornebourgmass.com/api/activities-with-payments`);
          const paymentData = await paymentResponse.json();
          const activityIdsWithPayments = paymentData.map(activity => activity.id);
          setDisableDelete(activityIdsWithPayments.includes(parseInt(id)));
        } catch (error) {
          console.error('Error fetching activity:', error);
        }
      };

      fetchActivity();
    }
  }, [id]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
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
        console.log('Selected Image URL:', result.assets[0].uri); // Added console log
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image');
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('Aucune image sélectionnée', 'Veuillez d\'abord sélectionner une image');
      return null;
    }

    let formData = new FormData();
    formData.append('image', {
      uri: selectedImage,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    setUploading(true);

    try {
      let response = await fetch(`https://mornebourgmass.com/api/upload`, {
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
        console.error('Error parsing JSON:', error);
        const text = await response.text();
        console.error('Response text:', text);
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
      console.error('Upload error:', error);
      Alert.alert('Erreur de téléchargement', 'Une erreur est survenue lors du téléchargement de l\'image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateActivity = async () => {
    let newImageUrl = imageUrl;

    if (selectedImage) {
      newImageUrl = await uploadImage();
    }

    try {
      const response = await axios.put(`https://mornebourgmass.com/api/activityscreen/${id}`, {
        title,
        description,
        date: date.toISOString().split('T')[0],
        time: time.toTimeString().split(' ')[0],
        imageUrl: newImageUrl,
        payment_link: paymentLink,
      });
      if (response.status === 200) {
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error updating activity:', error);
      alert('Échec de la mise à jour de l\'activité');
    }
  };

  const confirmDeleteActivity = () => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette activité ? Tapez "supprimer" pour confirmer.',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.prompt(
              'Confirmer la suppression',
              'Tapez "supprimer" pour confirmer la suppression.',
              [
                {
                  text: 'Annuler',
                  style: 'cancel',
                },
                {
                  text: 'Supprimer',
                  style: 'destructive',
                  onPress: (input) => {
                    if (input === 'supprimer') {
                      handleDeleteActivity();
                    } else {
                      Alert.alert('Erreur', 'Texte de confirmation incorrect');
                    }
                  },
                },
              ],
              'plain-text'
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteActivity = async () => {
    try {
      const response = await axios.delete(`https://mornebourgmass.com/api/activityscreen/${id}`);
      if (response.status === 200) {
        Alert.alert('Succès', 'Activité supprimée avec succès');
        router.back(); // Use router.back() to navigate back
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        Alert.alert('Erreur', `Échec de la suppression de l\'activité : ${error.response.data.message || 'Erreur inconnue'}`);
      } else if (error.request) {
        console.error('Request data:', error.request);
        Alert.alert('Erreur', 'Aucune réponse reçue du serveur');
      } else {
        console.error('Error message:', error.message);
        Alert.alert('Erreur', `Échec de la suppression de l\'activité : ${error.message}`);
      }
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const togglePaymentLink = () => {
    setShowPaymentLink(!showPaymentLink);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Activité mise à jour avec succès</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text style={styles.textStyle}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Text style={styles.label}>Titre</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />
        <Text style={styles.label}>Date</Text>
        <Pressable onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text style={{ fontSize: 16, color: '#000' }}>
            {date.toISOString().split('T')[0] || "Sélectionner la date"}
          </Text>
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Text style={styles.label}>Heure</Text>
        <Pressable onPress={() => setShowTimePicker(true)}>
          <TextInput
            style={styles.input}
            value={time.toTimeString().split(' ')[0]}
            placeholder="Sélectionner l'heure"
            editable={false}
          />
        </Pressable>
        
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={handleTimeChange}
            is24Hour={true}
            locale="fr-FR"
          />
        )}
        <View style={styles.spacing} />
        <Text style={styles.label}>URL de l'image</Text>
        <TextInput
          style={styles.input}
          placeholder="URL de l'image"
          value={imageUrl || ''}
          onChangeText={setImageUrl}
          editable={false}
        />
        {uploading && <ActivityIndicator size="large" color="#0000ff" />}
        <Pressable 
          style={styles.toggleButton}
          onPress={togglePaymentLink}
        >
          <Text style={styles.toggleButtonText}>
            {showPaymentLink ? 'Masquer le lien de paiement' : 'Afficher le lien de paiement'}
          </Text>
        </Pressable>

        {showPaymentLink && (
          <View>
            <Text style={styles.warningText}>
              Attention: Cela modifiera le lien de paiement pour l'activité "{activityTitle}"
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Lien de paiement"
              value={paymentLink || ''}
              onChangeText={setPaymentLink}
            />
          </View>
        )}
        <Pressable style={styles.imagePicker} onPress={pickImage}>
          <Ionicons name="cloud-upload-outline" size={32} color="gray" />
          <Text>Sélectionner une image depuis la galerie</Text>
        </Pressable>
        <Button title="Mettre à jour l'activité" onPress={handleUpdateActivity} />
        <Button title="Supprimer l'activité" onPress={confirmDeleteActivity} disabled={disableDelete} />
        {disableDelete && <Text style={styles.warningText}>Impossible de supprimer une activité avec des paiements</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  tapMeText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  imagePicker: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacing: {
    height: 20,
  },
  toggleButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  warningText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default EditActivityMobile;
