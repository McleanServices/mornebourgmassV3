import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";
import { useNavigation } from "@react-navigation/native";
import * as LocalAuthentication from 'expo-local-authentication';
const Profile = () => {
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null); // Add state for user role
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        const storedUserRole = await AsyncStorage.getItem("userRole"); // Load user role
        // console.log("Stored User ID:", storedUserId); // Remove or comment out this line
        // console.log("Stored User Role:", storedUserRole); // Remove or comment out this line
        if (storedUserId) {
          setUserId(storedUserId);
        }
        if (storedUserRole) {
          setUserRole(storedUserRole);
          console.log("User Role:", storedUserRole); // Log the user role
          if (storedUserRole === "admin") {
            console.log("User is an admin"); // Log if the user is an admin
          }
        }
      } catch (error) {
        console.error("Failed to load user data from AsyncStorage:", error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    // console.log("User ID:", userId); // Remove or comment out this line
    // console.log("User Role:", userRole); // Remove or comment out this line
  }, [userId, userRole]);

  return (
    <View style={styles.container}>
      {userId ? (
        <>
          {userRole !== "admin" && (
            <>
              <Text style={styles.welcomeText}>
                Bonjour, ID Utilisateur: {userId}
              </Text>
              <Text style={styles.title}>Votre QR Code Personnel</Text>
              <View style={styles.qrCodeContainer}>
                <QRCode
                  value={String(userId)} // Generate QR code with user ID
                  size={150}
                />
              </View>
            </>
          )}

          {userRole === "admin" && (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("scancode")}
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
        </>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  qrCodeContainer: {
    backgroundColor: '#89CFF0',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
