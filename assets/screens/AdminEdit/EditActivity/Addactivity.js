import React, { useState, useCallback } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Modal, Pressable, Alert, ScrollView } from 'react-native';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import { fr } from 'date-fns/locale';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from "@env";
registerLocale('fr', fr);

const AddActivity = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [nombreMaxTickets, setNombreMaxTickets] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputErrors, setInputErrors] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedImage(file);
    setImageUrl(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
  });

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('No image selected', 'Please select an image first');
      console.log('No image selected');
      return null;
    }

    const fileName = selectedImage.name;
    const fileType = selectedImage.type;

    let formData = new FormData();
    formData.append('image', selectedImage, fileName);

    try {
      console.log('Uploading image...');
      let response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      let result = await response.json();
      if (response.ok) {
        Alert.alert('Upload successful', 'Image uploaded successfully');
        console.log('Uploaded image URL:', result.imageUrl);
        setImageUrl(result.imageUrl);
        return result.imageUrl;
      } else {
        Alert.alert('Upload failed', result.message);
        console.log('Upload failed:', result.message);
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload error', 'An error occurred while uploading the image');
      return null;
    }
  };

  const validateInputs = () => {
    const errors = {};
    if (!title) errors.title = 'Please input the title';
    if (!description) errors.description = 'Please input the description';
    if (!date) errors.date = 'Please input the date';
    if (!time) errors.time = 'Please input the time';
    if (!imageUrl) errors.imageUrl = 'Please input the image URL';
    if (!nombreMaxTickets) errors.nombreMaxTickets = 'Please input the number of max tickets';

    setInputErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddActivity = async () => {
    if (!validateInputs()) {
      return;
    }

    let newImageUrl = imageUrl;

    if (selectedImage) {
      newImageUrl = await uploadImage();
      console.log('New Image URL:', newImageUrl);
    } else {
      console.log('No new image selected, using existing image URL');
    }

    try {
      const response = await axios.post(`${API_URL}/api/activity`, {
        title,
        description,
        date,
        time,
        imageUrl: newImageUrl,
        nombre_max_tickets: nombreMaxTickets,
      });
      if (response.status === 201) {
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Failed to add activity');
    }
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate.toISOString().split('T')[0]);
  };

  const inputStyle = (value, error) => [
    styles.input,
    value ? styles.inputFilled : null,
    error ? styles.inputError : null,
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
              <Text style={styles.modalText}>Activity added successfully</Text>
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
          style={inputStyle(title, inputErrors.title)}
          value={title}
          onChangeText={setTitle}
        />
        {inputErrors.title && <Text style={styles.errorText}>{inputErrors.title}</Text>}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={inputStyle(description, inputErrors.description)}
          value={description}
          onChangeText={setDescription}
        />
        {inputErrors.description && <Text style={styles.errorText}>{inputErrors.description}</Text>}
        <Text style={styles.label}>Date</Text>
        <View>
          <DatePicker
            selected={date ? new Date(date) : null}
            onChange={handleDateChange}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            locale="fr"
            customInput={
              <TextInput
                style={inputStyle(date, inputErrors.date)}
                value={date}
                placeholder="Select Date"
                editable={false}
              />
            }
          />
        </View>
        {inputErrors.date && <Text style={styles.errorText}>{inputErrors.date}</Text>}
        <Text style={styles.label}>Time (HH:mm)</Text>
        <View>
          <TimePicker
            onChange={setTime}
            value={time}
            disableClock={true}
            format="HH:mm"
            clearIcon={null}
            clockIcon={null}
            className="time-picker-input"
          />
        </View>
        {inputErrors.time && <Text style={styles.errorText}>{inputErrors.time}</Text>}
        <View style={styles.spacing} />
        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={inputStyle(imageUrl, inputErrors.imageUrl)}
          placeholder="Image URL"
          value={imageUrl || ''}
          onChangeText={setImageUrl}
          editable={false}
        />
        {inputErrors.imageUrl && <Text style={styles.errorText}>{inputErrors.imageUrl}</Text>}
        <View {...getRootProps()} style={styles.dropzone}>
          <input {...getInputProps()} />
          <Ionicons name="cloud-upload-outline" size={32} color="gray" />
          <Text>Drag 'n' drop an image here, or click to select one</Text>
        </View>
        <Text style={styles.label}>Nombre Max Tickets</Text>
        <TextInput
          style={inputStyle(nombreMaxTickets, inputErrors.nombreMaxTickets)}
          value={nombreMaxTickets}
          onChangeText={setNombreMaxTickets}
          keyboardType="numeric"
        />
        {inputErrors.nombreMaxTickets && <Text style={styles.errorText}>{inputErrors.nombreMaxTickets}</Text>}
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
        <Button title="Add Activity" onPress={handleAddActivity} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
  'time-picker-input': {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  inputFilled: {
    borderColor: 'green',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
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
  dropzone: {
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
  errorMessage: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default AddActivity;
