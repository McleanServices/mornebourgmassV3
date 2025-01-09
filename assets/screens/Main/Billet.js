import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/auth';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

const BilletScreen = () => {
  const router = useRouter();
  const { session } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    // Removed API calls
  }, [session]);

  useEffect(() => {
    const presentNotification = async () => {
      if (Platform.OS !== 'web') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Nouveau Billet Disponible!",
            body: "Consultez les billets disponibles pour MorneBourgMass.",
          },
          trigger: { seconds: 30, repeats: true },
        });
      } else {
        console.log("Notifications are not supported on web.");
      }
    };

    presentNotification();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedDetails = await AsyncStorage.getItem('userDetails');
        if (storedDetails) {
          setUserDetails(JSON.parse(storedDetails));
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      if (userDetails?.id_user) {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:8080/api/paiement/${userDetails.id_user}`);
          setTickets(response.data);
        } catch (error) {
          console.error("Failed to fetch tickets:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTickets();
  }, [userDetails]);

  const generatePDF = async (ticket) => {
    try {
      const html = `
        <html>
          <body>
            <h1>${ticket.title}</h1>
            <p>${ticket.description}</p>
            <p>Prix: ${ticket.prix_unitaire}</p>
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html });
      if (uri) {
        const pdfName = `${FileSystem.documentDirectory}${ticket.title}.pdf`;
        await FileSystem.moveAsync({
          from: uri,
          to: pdfName,
        });
        alert(`PDF downloaded to: ${pdfName}`);
      } else {
        throw new Error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.sectionHeader}>Billets Disponibles</Text>
        {userDetails && (
          <Text style={styles.userIdText}>ID Utilisateur: {userDetails.id_user}</Text>
        )}
        {loading ? (
          <ActivityIndicator size="large" color="#8A2BE2" />
        ) : (
          <FlatList
            data={tickets}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.ticketCard, { backgroundColor: item.color || "#89CFF0" }]}
                onPress={() => generatePDF(item)}
              >
                <Text style={styles.ticketTitle}>{item.title}</Text>
                <Text style={styles.ticketDescription}>{item.description}</Text>
                <View style={styles.ticketFooter}>
                  <Text style={styles.ticketPrice}>{item.prix_unitaire}</Text>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={24} 
                  color="#FFFFFF" 
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  ticketCard: {
    borderRadius: 15,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    position: 'relative',
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  ticketDescription: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketDate: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  ticketPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#FFFFFF",
  },
  arrowIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -12,
  },
  userIdText: {
    fontSize: 16,
    color: "#2C3E50",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
});

export default BilletScreen;

// TODO : Finish pdf design