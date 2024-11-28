import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";
import { useNavigation } from "@react-navigation/native";
import * as LocalAuthentication from 'expo-local-authentication';

const Profile = () => {
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
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
        </>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
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
});

export default Profile;
