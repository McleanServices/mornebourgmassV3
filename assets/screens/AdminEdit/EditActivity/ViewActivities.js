/**
 * Explication pour l'utilisateur admin :
 * 
 * Vous pouvez glisser chaque carte vers la gauche ou vers la droite pour effectuer des actions :
 * - Glisser vers la gauche pour éditer l'activité.
 * - Glisser vers la droite pour supprimer l'activité.
 * 
 * Pour éditer une activité, glissez simplement la carte vers la gauche et appuyez sur "Edit".
 * Pour supprimer une activité, glissez la carte vers la droite et appuyez sur "Delete".
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Platform, Modal, TextInput, Pressable } from 'react-native';
import { Card, Avatar, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler'; // Import Swipeable
import { RectButton } from 'react-native-gesture-handler'; // Import RectButton

const ViewActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const navigation = useNavigation();
  const swipeableRefs = useRef([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('https://mornebourgmass.com/api/activityscreen');
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
        if (Platform.OS === 'web') {
          alert('Erreur: Une erreur s\'est produite lors de la récupération des activités');
        } else {
          Alert.alert('Erreur', 'Une erreur s\'est produite lors de la récupération des activités');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleDelete = (activity) => {
    setActivityToDelete(activity);
    setDeleteModalVisible(true);
  };

  const confirmDeleteActivity = async () => {
    if (deleteConfirmation === 'SUPPRIMER') {
      try {
        await fetch(`https://mornebourgmass.com/api/activityscreen/${activityToDelete.id}`, { method: 'DELETE' });
        setActivities(activities.filter(activity => activity.id !== activityToDelete.id));
        setDeleteModalVisible(false);
        setDeleteConfirmation('');
      } catch (error) {
        console.error("Erreur lors de la suppression de l'activité:", error);
      }
    } else {
      alert('Veuillez taper SUPPRIMER pour confirmer.');
    }
  };

  const cancelDeleteActivity = () => {
    setDeleteModalVisible(false);
    setDeleteConfirmation('');
  };

  const renderRightActions = (item, index) => (
    <RectButton style={styles.rightAction} onPress={() => handleDelete(item)}>
      <Text style={styles.actionText}>Supprimer</Text>
    </RectButton>
  );

  const renderLeftActions = (item, index) => (
    <RectButton style={styles.leftAction} onPress={() => navigation.navigate("EditActivity", { id: item.id })}>
      <Text style={styles.actionText}>Éditer</Text>
    </RectButton>
  );

  const renderItem = ({ item, index }) => (
    <Swipeable
      ref={(ref) => swipeableRefs.current[index] = ref}
      renderLeftActions={() => renderLeftActions(item, index)}
      renderRightActions={() => renderRightActions(item, index)}
    >
      <Card style={styles.card}>
        <Card.Title
          title={item.title}
          subtitle={item.description}
          left={(props) => <Avatar.Icon {...props} icon="calendar" />}
        />
      </Card>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.explanation}>
        Vous pouvez glisser chaque carte vers la gauche ou vers la droite pour effectuer des actions :
        - Glisser vers la gauche pour éditer l'activité.
        - Glisser vers la droite pour supprimer l'activité.
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={activities}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => {
          setDeleteModalVisible(!deleteModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Êtes-vous sûr de vouloir supprimer l'activité "{activityToDelete?.title}" ? Tapez SUPPRIMER pour confirmer.</Text>
            <TextInput
              style={styles.input}
              onChangeText={setDeleteConfirmation}
              value={deleteConfirmation}
            />
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.button, deleteConfirmation === 'SUPPRIMER' ? styles.buttonConfirmActive : styles.buttonConfirmInactive]}
                onPress={confirmDeleteActivity}
                disabled={deleteConfirmation !== 'SUPPRIMER'}
              >
                <Text style={styles.textStyle}>Confirmer</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={cancelDeleteActivity}
              >
                <Text style={styles.textStyle}>Annuler</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  explanation: {
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  rightAction: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  leftAction: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  actionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '80%',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 20,
    padding: 15, // Increased padding for larger buttons
    elevation: 2,
  },
  buttonConfirmInactive: {
    backgroundColor: 'gray',
  },
  buttonConfirmActive: {
    backgroundColor: 'green',
  },
  buttonCancel: {
    backgroundColor: 'gray',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Replace shadow properties with boxShadow
    elevation: 5,
  },
});

export default ViewActivities;