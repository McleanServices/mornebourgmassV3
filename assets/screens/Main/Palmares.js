import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import axios from "axios";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useCookies } from 'react-cookie'; // Add this import
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const Palmares = () => {
  // ...existing code...
  const [palmares, setPalmares] = useState([]); // Add state for Palmares
  // ...existing code...

  useEffect(() => {
    const fetchPalmares = async () => {
      try {
        const response = await axios.get("https://mornebourgmass.com/api/palmares"); // Replace with your server URL
        setPalmares(response.data);
      } catch (error) {
        console.error("Error fetching palmares:", error);
      }
    };

    fetchPalmares();
  }, []);

  // ...existing code...

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container} pointerEvents="auto">
          {/* Page Header */}
          <Text style={styles.header}>Palmarès</Text>

          {/* Achievements Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nos Réalisations</Text>
            <FlatList
              data={palmares}
              numColumns={2}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Ionicons name="trophy" size={40} color="#FFD700" style={styles.cardIcon} /> {/* Gold color */}
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              columnWrapperStyle={styles.grid}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5EE", // Seashell color
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF4500", // OrangeRed color
    textAlign: "center",
    marginVertical: 20,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 16,
    textAlign: "center",
  },
  grid: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Replace shadow properties with boxShadow
    alignItems: "center",
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 5,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
  },
  // ...existing code...
});

export default Palmares;
