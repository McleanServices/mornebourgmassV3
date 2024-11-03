import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error("Failed to load user ID from AsyncStorage:", error);
      }
    };

    loadUserId();
  }, []);

  return (
    <View style={styles.container}>
      {userId ? (
        <>
          {userId !== "21" && (
            <>
              <Text style={styles.welcomeText}>
                Bonjour, ID Utilisateur: {userId}
              </Text>
              <Text style={styles.title}>Votre QR Code Personnel</Text>
              <QRCode
                value={String(userId)} // Generate QR code with user ID
                size={150}
              />
            </>
          )}

          {userId === "21" && (
            <>
              <Button
                title="Scanner un QR Code"
                onPress={() => navigation.navigate("scancode")}
              />
              <Button
                title="Edit Page"
                onPress={() => navigation.navigate("EditPage")}
              />
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
});

export default Profile;
