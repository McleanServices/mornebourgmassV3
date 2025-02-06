import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Modal, Pressable, Alert, Platform, ScrollView, Image, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { useNavigation } from '@react-navigation/native';
//test

const AddActivityMobileScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [nombreMaxTickets, setNombreMaxTickets] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputErrors, setInputErrors] = useState({});
  const [paymentLink, setPaymentLink] = useState('');
  const [showPaymentLink, setShowPaymentLink] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Désolé, nous avons besoin des autorisations de la bibliothèque de médias pour que cela fonctionne!');
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
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de la sélection de l\'image');
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

    try {
      let response = await fetch(`https://mornebourgmass.com/api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });

      let result = await response.json();
      if (response.ok) {
        Alert.alert('Téléchargement réussi', 'Image téléchargée avec succès');
        setImageUrl('http://mornebourgmass.com/api/uploads/1733946884558-photo.jpg');
        return 'http://mornebourgmass.com/api/uploads/1733946884558-photo.jpg';
      } else {
        Alert.alert('Échec du téléchargement', result.message);
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Erreur de téléchargement', 'Une erreur s\'est produite lors du téléchargement de l\'image');
      return null;
    }
  };

  const validateInputs = () => {
    const errors = {};
    if (!title.trim()) errors.title = 'Veuillez entrer le titre';
    if (!description.trim()) errors.description = 'Veuillez entrer la description';
    if (!date) errors.date = 'Veuillez entrer la date';
    if (!time) errors.time = 'Veuillez entrer l\'heure';
    if (!nombreMaxTickets.trim()) {
      errors.nombreMaxTickets = 'Veuillez entrer le nombre maximum de billets';
    } else if (isNaN(nombreMaxTickets) || parseInt(nombreMaxTickets) <= 0) {
      errors.nombreMaxTickets = 'Le nombre de billets doit être un nombre positif';
    }
    if (showPaymentLink && !paymentLink.trim()) {
      errors.paymentLink = 'Veuillez entrer le lien de paiement';
    }
    if (!selectedImage && !imageUrl) {
      errors.image = 'Veuillez sélectionner une image';
    }

    setInputErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      Alert.alert('Erreur de validation', 'Veuillez remplir tous les champs requis correctement');
      return false;
    }
    return true;
  };

  const handleAddActivity = async () => {
    if (!validateInputs()) {
      return;
    }

    let newImageUrl = imageUrl;

    if (selectedImage) {
      newImageUrl = await uploadImage();
    }

    try {
      const response = await axios.post(`https://mornebourgmass.com/api/activity`, {
        title,
        description,
        date: date.toISOString().split('T')[0],
        time: time.toTimeString().split(' ')[0],
        imageUrl: newImageUrl,
        nombre_max_tickets: nombreMaxTickets,
        payment_link: paymentLink,
      });
      if (response.status === 201) {
        setModalVisible(true);
        navigation.goBack();
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Échec de l\'ajout de l\'activité');
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

  const handleWebTimeChange = (newTime) => {
    if (newTime) {
      const [hours, minutes] = newTime.split(':');
      const newTimeDate = new Date();
      newTimeDate.setHours(parseInt(hours));
      newTimeDate.setMinutes(parseInt(minutes));
      setTime(newTimeDate);
    }
  };

  const togglePaymentLink = () => {
    setShowPaymentLink(true);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 100 }]}>
      <View style={styles.container}>
      <Text style={styles.infoText}>
        Après avoir créé l'image, allez à l'édition de l'activité pour ajouter l'image et le lien de paiement.
      </Text>
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
            <Text style={styles.modalText}>Activité ajoutée avec succès</Text>
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
      {inputErrors.title && <Text style={styles.errorText}>{inputErrors.title}</Text>}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      {inputErrors.description && <Text style={styles.errorText}>{inputErrors.description}</Text>}
      <Text style={styles.label}>Date</Text>
      {Platform.OS === 'web' ? (
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="yyyy-MM-dd"
          className="web-datepicker"
        />
      ) : (
        <Pressable onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            value={date.toISOString().split('T')[0]}
            placeholder="Sélectionner la date"
            editable={false}
          />
        </Pressable>
      )}
      <Text style={styles.tapMeText}>Tapez-moi</Text>
      {showDatePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {inputErrors.date && <Text style={styles.errorText}>{inputErrors.date}</Text>}
      <Text style={styles.label}>Heure</Text>
      {Platform.OS === 'web' ? (
        <TimePicker
          onChange={handleWebTimeChange}
          value={`${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`}
          className="web-timepicker"
          clearIcon={null}
          disableClock={true}
          format="HH:mm"
        />
      ) : (
        <Pressable onPress={() => setShowTimePicker(true)}>
          <TextInput
            style={styles.input}
            value={time.toTimeString().split(' ')[0]}
            placeholder="Sélectionner l'heure"
            editable={false}
          />
        </Pressable>
      )}
      {!Platform.OS === 'web' && <Text style={styles.tapMeText}>Tapez-moi</Text>}
      {showTimePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
      <View style={styles.spacing} />
      <Text style={styles.label}>Nombre Max Tickets</Text>
      <TextInput
        style={styles.input}
        value={nombreMaxTickets}
        onChangeText={setNombreMaxTickets}
      />
      {inputErrors.nombreMaxTickets && <Text style={styles.errorText}>{inputErrors.nombreMaxTickets}</Text>}
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
      <Text style={styles.label}>Image</Text>
      <Pressable onPress={pickImage} style={styles.imagePicker}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={{ width: 100, height: 100 }} />
        ) : (
          <Text>Sélectionner une image</Text>
        )}
      </Pressable>
      {inputErrors.image && <Text style={styles.errorText}>{inputErrors.image}</Text>}
      {showPaymentLink && (
        <View>
          <Text style={styles.label}>Lien de paiement</Text>
          <TextInput
            style={styles.input}
            placeholder="Lien de paiement"
            value={paymentLink}
            onChangeText={setPaymentLink}
          />
          {inputErrors.paymentLink && <Text style={styles.errorText}>{inputErrors.paymentLink}</Text>}
        </View>
      )}
      <TouchableOpacity
        style={[styles.button, { margin: 20 }]}
        onPress={handleAddActivity}
      >
        <Text style={styles.buttonText}>Ajouter l'activité</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    fontStyle: 'italic',
    color: 'blue',
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
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    elevation: 5,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    width: "80%",
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  'web-timepicker': {
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonAjouter: {
    marginBottom: 50,
  }
});

export default AddActivityMobileScreen;

// TODO : add prix input and update api for it



