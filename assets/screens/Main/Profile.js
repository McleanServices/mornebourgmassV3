import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false); // Add state for loader
  const [modalVisible, setModalVisible] = useState(false); // Add state for modal visibility
  const [modalMessage, setModalMessage] = useState(""); // Add state for modal message
  const [modalIcon, setModalIcon] = useState(null); // Add state for modal icon
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        const storedUserRole = await AsyncStorage.getItem("userRole");
        if (storedUserId) {
          setUserId(storedUserId);
        }
        if (storedUserRole) {
          setUserRole(storedUserRole);
        }
      } catch (error) {
        console.error("Failed to load user data from AsyncStorage:", error);
      }
    };

    loadUserData();
  }, []);

  const sendMessage = async () => {
    if (email && message) {
      setIsSending(true); // Show loader
      try {
        const response = await fetch('https://e043-190-102-2-173.ngrok-free.app/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: email, // Include the 'from' email
            to: 'pianomaster676767@gmail.com',
            subject: `Contact from ${email}`,
            message: message,
            userId: userId, // Include userId in the email body
          }),
        });

        if (response.ok) {
          setModalMessage("Your message has been sent successfully!");
          setModalIcon("✔️"); // Set success icon
          setEmail("");
          setMessage("");
        } else {
          setModalMessage("Failed to send message. Please try again.");
          setModalIcon("❌"); // Set failure icon
        }
      } catch (error) {
        setModalMessage("An error occurred. Please try again.");
        setModalIcon("❌"); // Set failure icon
      } finally {
        setIsSending(false); // Hide loader
        setModalVisible(true); // Show modal
      }
    } else {
      setModalMessage("Please fill in both fields.");
      setModalIcon("❌"); // Set failure icon
      setModalVisible(true); // Show modal
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {userId ? (
        <>
          {userRole !== "admin" && (
            <>
              <Text style={styles.welcomeText}>
                Numéro Adhérent: {userId}
              </Text>
              <Text style={styles.title}>Votre QR Code Personnel</Text>
              <View >
                <QRCode value={String(userId)} size={200} />
              </View>
            </>
          )}

          {userRole === "admin" && (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("ScanCode")}
              >
                <Text style={styles.buttonText}>Scanner un QR Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("EditPage")}
              >
                <Text style={styles.buttonText}>Administration</Text>
              </TouchableOpacity>
            </>
          )}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Contact Us</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Your Message"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity style={styles.button} onPress={sendMessage} disabled={isSending}>
              {isSending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send Message</Text>
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
            <Text style={styles.modalIcon}>{modalIcon}</Text> {/* Display the icon */}
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
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Replace shadow properties with boxShadow
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
});

export default Profile;
