import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
  Platform,
  AppState,
} from "react-native";
import { Link, router } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";
import { API_URL } from "@env";
import axios from 'axios';
import { useAuth } from '../../../context/auth';

const ProfileScreen = () => {
  const { session } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIcon, setModalIcon] = useState(null);

  const refreshUserDetails = async () => {
    try {
      if (session?.user?.id) {
        const response = await axios.get(`${API_URL}/api/user/${session.user.id}`);
        const userData = response.data.user;
        await AsyncStorage.setItem('userDetails', JSON.stringify(userData));
        setUserDetails(userData);
      }
    } catch (error) {
      console.error("Failed to refresh user details:", error);
    }
  };

  useEffect(() => {
    refreshUserDetails();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        refreshUserDetails();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [session]);

  const sendMessage = async () => {
    if (email && message) {
      setIsSending(true);
      try {
        const response = await fetch(`${API_URL}/api/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: email,
            to: 'pianomaster676767@gmail.com',
            subject: `Contact from ${email}`,
            message: message,
            userId: userDetails.id_user,
          }),
        });

        if (response.ok) {
          setModalMessage("Votre message a été envoyé avec succès !");
          setModalIcon("✔️");
          setEmail("");
          setMessage("");
        } else {
          setModalMessage("Échec de l'envoi du message. Veuillez réessayer.");
          setModalIcon("❌");
        }
      } catch (error) {
        setModalMessage("Une erreur s'est produite. Veuillez réessayer.");
        setModalIcon("❌");
      } finally {
        setIsSending(false);
        setModalVisible(true);
      }
    } else {
      setModalMessage("Veuillez remplir tous les champs.");
      setModalIcon("❌");
      setModalVisible(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {userDetails ? (
        <>
          {userDetails.role && userDetails.role.toLowerCase() === "admin" ? (
            <>
              <Link href="/pages/scancode" asChild>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Scanner un QR Code</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/pages/editpage" asChild>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Administration</Text>
                </TouchableOpacity>
              </Link>
            </>
          ) : (
            <>
              <Text style={styles.welcomeText}>
                Numéro Adhérent: {userDetails.id_user}
              </Text>
              <Text style={styles.title}>Votre QR Code Personnel</Text>
              <View>
                <QRCode value={String(userDetails.id_user)} size={100} />
              </View>
            </>
          )}
          <View style={styles.divider} />
          <View style={styles.contactSection}>
            <Text style={styles.title}>Contactez-nous</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Votre message"
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity style={styles.button} onPress={sendMessage} disabled={isSending}>
              {isSending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Envoyer le message</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
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
            <Text style={styles.modalIcon}>{modalIcon}</Text>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2C3E50",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2C3E50",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  contactSection: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2C3E50",
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
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
  modalIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '80%',
    marginVertical: 20,
  },
});

export default ProfileScreen;
