// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Modal, Pressable } from 'react-native';
// import DatePicker, { registerLocale } from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import TimePicker from 'react-time-picker';
// import 'react-time-picker/dist/TimePicker.css';
// import { fr } from 'date-fns/locale';
// import { useDropzone } from 'react-dropzone';
// import { Ionicons } from '@expo/vector-icons';
// //test
// import { useRouter, useLocalSearchParams } from 'expo-router';
// registerLocale('fr', fr);

// const EditActivityScreen = () => {
//   const { id } = useLocalSearchParams();
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [imageUrl, setImageUrl] = useState('');
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('00:00');
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [paymentLink, setPaymentLink] = useState('');
//   const [deleteModalVisible, setDeleteModalVisible] = useState(false);
//   const [deleteConfirmation, setDeleteConfirmation] = useState('');
//   const [nombreMaxTickets, setNombreMaxTickets] = useState('');

//   useEffect(() => {
//     if (id) {
//       const fetchActivity = async () => {
//         try {
//           const response = await fetch(`https://mornebourgmass.com/api/activityscreen/${id}`);
//           if (!response.ok) {
//             throw new Error('Failed to fetch activity');
//           }
//           const data = await response.json();
//           setTitle(data.title);
//           setDescription(data.description);
//           setImageUrl(data.imageUrl);
//           setDate(data.date.replace(/T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, ''));
//           setTime(data.time || '00:00');
//           setPaymentLink(data.payment_link);
//           setNombreMaxTickets(data.nombre_max_tickets || '');
//           console.log('Fetched activity data:', data);
//         } catch (error) {
//           console.error('Error fetching activity:', error);
//         }
//       };

//       fetchActivity();
//     }
//   }, [id]);

//   const onDrop = useCallback((acceptedFiles) => {
//     const file = acceptedFiles[0];
//     setSelectedImage(file);
//     setImageUrl(URL.createObjectURL(file));
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: 'image/jpeg, image/png',
//   });

//   const uploadImage = async () => {
//     if (!selectedImage) {
//       Alert.alert('No image selected', 'Please select an image first');
//       console.log('No image selected');
//       return null;
//     }

//     const fileName = selectedImage.name;
//     const fileType = selectedImage.type;

//     let formData = new FormData();
//     formData.append('image', selectedImage, fileName);

//     try {
//       console.log('Uploading image...');
//       let response = await fetch(`https://2446-104-250-11-62.ngrok-free.app/api/upload`, {
//         method: 'POST',
//         body: formData,
//       });

//       let result = await response.json();
//       if (response.ok) {
//         Alert.alert('Upload successful', 'Image uploaded successfully');
//         console.log('Uploaded image URL:', result.imageUrl);
//         setImageUrl(result.imageUrl);
//         return result.imageUrl;
//       } else {
//         Alert.alert('Upload failed', result.message);
//         console.log('Upload failed:', result.message);
//         return null;
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       Alert.alert('Upload error', 'An error occurred while uploading the image');
//       return null;
//     }
//   };

//   const updateActivity = async () => {
//     console.log('Update Activity button clicked');
//     let newImageUrl = imageUrl;

//     if (selectedImage) {
//       newImageUrl = await uploadImage();
//       console.log('New Image URL:', newImageUrl);
//     } else {
//       console.log('No new image selected, using existing image URL');
//     }

//     if (newImageUrl) {
//       try {
//         console.log('Sending update request to server...');
//         const response = await fetch(`https://mornebourgmass.com/api/activityscreen/${id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ title, description, imageUrl: newImageUrl, date, time, payment_link: paymentLink, nombre_max_tickets: nombreMaxTickets }),
//         });

//         console.log('Update request sent to server');

//         if (response.ok) {
//           Alert.alert('Update successful', 'Activity updated successfully');
//           console.log('Activity updated successfully');
//         } else {
//           const result = await response.json();
//           Alert.alert('Update failed', result.message);
//           console.log('Update failed:', result.message);
//         }
//       } catch (error) {
//         console.error('Update error:', error);
//         Alert.alert('Update error', 'An error occurred while updating the activity');
//       }
//     } else {
//       console.log('New image URL is null, update aborted');
//     }
//   };

//   const handleDelete = () => {
//     setDeleteModalVisible(true);
//   };

//   const confirmDeleteActivity = async () => {
//     if (deleteConfirmation === 'SUPPRIMER') {
//       try {
//         await fetch(`https://mornebourgmass.com/api/activityscreen/${id}`, { method: 'DELETE' });
//         setDeleteModalVisible(false);
//         setDeleteConfirmation('');
//       } catch (error) {
//         console.error("Erreur lors de la suppression de l'activité:", error);
//       }
//     } else {
//       alert('Veuillez taper SUPPRIMER pour confirmer.');
//     }
//   };

//   const cancelDeleteActivity = () => {
//     setDeleteModalVisible(false);
//     setDeleteConfirmation('');
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.container}>
//         <TextInput
//           style={styles.input}
//           placeholder="Title"
//           value={title || ''}
//           onChangeText={setTitle}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Description"
//           value={description || ''}
//           onChangeText={setDescription}
//         />
//         <Text style={styles.label}>Date</Text>
//         <DatePicker
//           selected={date ? new Date(date) : null}
//           onChange={(selectedDate) => setDate(selectedDate.toISOString().split('T')[0])}
//           minDate={new Date()}
//           dateFormat="yyyy-MM-dd"
//           locale="fr"
//           customInput={
//             <TextInput
//               style={styles.input}
//               value={date}
//               placeholder="Select Date"
//               editable={false}
//             />
//           }
//         />
//         <Text style={styles.label}>Time</Text>
//         <TimePicker
//           onChange={(newTime) => {
//             console.log('TimePicker onChange:', newTime);
//             setTime(newTime || '00:00');
//           }}
//           value={time}
//           disableClock={true}
//           format="HH:mm"
//           clearIcon={null}
//           clockIcon={null}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Image URL"
//           value={imageUrl || ''}
//           onChangeText={setImageUrl}
//           editable={false}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Payment Link"
//           value={paymentLink || ''}
//           onChangeText={setPaymentLink}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Nombre Max Tickets"
//           value={nombreMaxTickets || ''}
//           onChangeText={setNombreMaxTickets}
//         />
//         <View {...getRootProps()} style={styles.dropzone}>
//           <input {...getInputProps()} />
//           <Ionicons name="cloud-upload-outline" size={32} color="gray" />
//           <Text>Drag 'n' drop an image here, or click to select one</Text>
//         </View>
//         <Button title="Update Activity" onPress={updateActivity} />
//         <Button title="Delete Activity" onPress={handleDelete} />
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={deleteModalVisible}
//           onRequestClose={() => {
//             setDeleteModalVisible(!deleteModalVisible);
//           }}
//         >
//           <View style={styles.centeredView}>
//             <View style={styles.modalView}>
//               <Text style={styles.modalText}>Êtes-vous sûr de vouloir supprimer l'activité "{title}" ? Tapez SUPPRIMER pour confirmer.</Text>
//               <TextInput
//                 style={styles.input}
//                 onChangeText={setDeleteConfirmation}
//                 value={deleteConfirmation}
//               />
//               <View style={styles.modalButtonContainer}>
//                 <Pressable
//                   style={[styles.button, deleteConfirmation === 'SUPPRIMER' ? styles.buttonConfirmActive : styles.buttonConfirmInactive]}
//                   onPress={confirmDeleteActivity}
//                   disabled={deleteConfirmation !== 'SUPPRIMER'}
//                 >
//                   <Text style={styles.textStyle}>Confirmer</Text>
//                 </Pressable>
//                 <Pressable
//                   style={[styles.button, styles.buttonCancel]}
//                   onPress={cancelDeleteActivity}
//                 >
//                   <Text style={styles.textStyle}>Annuler</Text>
//                 </Pressable>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
//   dropzone: {
//     height: 100,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 22,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   modalButtonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   button: {
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//   },
//   buttonConfirmActive: {
//     backgroundColor: '#2196F3',
//   },
//   buttonConfirmInactive: {
//     backgroundColor: '#B0C4DE',
//   },
//   buttonCancel: {
//     backgroundColor: '#f44336',
//   },
//   textStyle: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

// export default EditActivityScreen;