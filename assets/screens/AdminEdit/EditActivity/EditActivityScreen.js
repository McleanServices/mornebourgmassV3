import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDropzone } from 'react-dropzone';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Add this import statement

const EditActivityScreen = () => {
  const route = useRoute();
  const { id } = route.params || {}; // Add default value to handle undefined params
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();

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
          setDate(data.date.replace(/T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, '')); // Remove trailing time and milliseconds
          setTime(data.time);
        } catch (error) {
          console.error('Error fetching activity:', error);
        }
      };

      fetchActivity();
    }
  }, [id]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedImage(file);
    setImageUrl(URL.createObjectURL(file)); // Update the image URL input box
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
  });

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('No image selected', 'Please select an image first');
      console.log('No image selected'); // Log if no image is selected
      return null;
    }

    const fileName = selectedImage.name; // Use the file name from the selected file
    const fileType = selectedImage.type; // Use the MIME type from the selected file

    let formData = new FormData();
    formData.append('image', selectedImage, fileName);

    try {
      console.log('Uploading image...'); // Log before uploading
      let response = await fetch('https://mornebourgmass.com/api/upload', {
        method: 'POST',
        body: formData,
        // Remove the Content-Type header to let fetch set it automatically
      });

      let result = await response.json();
      if (response.ok) {
        Alert.alert('Upload successful', 'Image uploaded successfully');
        console.log('Uploaded image URL:', result.imageUrl); // Log the uploaded image URL
        setImageUrl(result.imageUrl); // Update the image URL input box
        return result.imageUrl;
      } else {
        Alert.alert('Upload failed', result.message);
        console.log('Upload failed:', result.message); // Log the failure message
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload error', 'An error occurred while uploading the image');
      return null;
    }
  };

  const updateActivity = async () => {
    console.log('Update Activity button clicked'); // Log button click
    let newImageUrl = imageUrl; // Use existing imageUrl by default

    if (selectedImage) {
      newImageUrl = await uploadImage();
      console.log('New Image URL:', newImageUrl); // Log the new image URL
    } else {
      console.log('No new image selected, using existing image URL'); // Log if no new image is selected
    }

    if (newImageUrl) {
      try {
        console.log('Sending update request to server...'); // Log before sending request
        const response = await fetch(`https://mornebourgmass.com/api/activityscreen/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description, imageUrl: newImageUrl, date, time }),
        });

        console.log('Update request sent to server'); // Log after sending request

        if (response.ok) {
          Alert.alert('Update successful', 'Activity updated successfully');
          console.log('Activity updated successfully'); // Log successful update
          navigation.goBack();
        } else {
          const result = await response.json();
          Alert.alert('Update failed', result.message);
          console.log('Update failed:', result.message); // Log the failure message
        }
      } catch (error) {
        console.error('Update error:', error);
        Alert.alert('Update error', 'An error occurred while updating the activity');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title || ''} 
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description || ''}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={date || ''} 
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Time"
        value={time || ''}
        onChangeText={setTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imageUrl || ''} 
        onChangeText={setImageUrl}
        editable={false} 
      />
      <View {...getRootProps()} style={styles.dropzone}>
        <input {...getInputProps()} />
        <Ionicons name="cloud-upload-outline" size={32} color="gray" />
        <Text>Drag 'n' drop an image here, or click to select one</Text>
      </View>
      <Button title="Update Activity" onPress={updateActivity} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  dropzone: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditActivityScreen;