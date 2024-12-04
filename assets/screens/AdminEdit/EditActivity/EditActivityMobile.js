import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Modal, Pressable, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

const EditActivityMobile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [paymentLink, setPaymentLink] = useState(''); // Add state for payment link

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
          setDescription(data.description);
          setImageUrl(data.imageUrl);
          setDate(new Date(data.date));
          setTime(new Date(`1970-01-01T${data.time}Z`));
          setPaymentLink(data.payment_link); // Set payment link
        } catch (error) {
          console.error('Error fetching activity:', error);
        }
      };

      fetchActivity();
    }
  }, [id]);

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
      Alert.alert('Error', 'An error occurred while picking the image');
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('No image selected', 'Please select an image first');
      return null;
    }

    let formData = new FormData();
    formData.append('image', {
      uri: selectedImage,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    try {
      let response = await fetch('https://mornebourgmass.com/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });

      let result = await response.json();
      if (response.ok) {
        Alert.alert('Upload successful', 'Image uploaded successfully');
        setImageUrl(result.imageUrl);
        return result.imageUrl;
      } else {
        Alert.alert('Upload failed', result.message);
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload error', 'An error occurred while uploading the image');
      return null;
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
        payment_link: paymentLink, // Include payment link
      });
      if (response.status === 200) {
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error updating activity:', error);
      alert('Failed to update activity');
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

  return (
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
            <Text style={styles.modalText}>Activity updated successfully</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Text style={styles.label}>Title</Text>
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
      <Pressable onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          value={date.toISOString().split('T')[0]}
          placeholder="Select Date"
          editable={false}
        />
      </Pressable>
      <Text style={styles.tapMeText}>Tap me</Text>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Text style={styles.label}>Time</Text>
      <Pressable onPress={() => setShowTimePicker(true)}>
        <TextInput
          style={styles.input}
          value={time.toTimeString().split(' ')[0]}
          placeholder="Select Time"
          editable={false}
        />
      </Pressable>
      <Text style={styles.tapMeText}>Tap me</Text>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={handleTimeChange}
          is24Hour={true} // Use 24-hour format
          locale="fr-FR" // Set locale to French
        />
      )}
      <View style={styles.spacing} />
      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imageUrl || ''}
        onChangeText={setImageUrl}
        editable={false}
      />
      <Text style={styles.label}>Payment Link</Text>
      <TextInput
        style={styles.input}
        placeholder="Payment Link"
        value={paymentLink || ''} // Add input for payment link
        onChangeText={setPaymentLink}
      />
      <Pressable style={styles.imagePicker} onPress={pickImage}>
        <Ionicons name="cloud-upload-outline" size={32} color="gray" />
        <Text>Pick an image from gallery</Text>
      </Pressable>
      <Button title="Update Activity" onPress={handleUpdateActivity} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
});

export default EditActivityMobile;
