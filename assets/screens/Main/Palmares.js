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
import { useCookies } from 'react-cookie';
import { Ionicons } from '@expo/vector-icons';

const Palmares = () => {
  const [palmares, setPalmares] = useState([]);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    const fetchPalmares = async () => {
      try {
        const response = await axios.get("https://mornebourgmass.com/api/palmares");
        setPalmares(response.data);
      } catch (error) {
        console.error("Error fetching palmares:", error);
      }
    };

    fetchPalmares();
  }, []);

  const renderDescription = (description, index) => {
    const words = description.split(" ");
    if (words.length <= 20 || expanded[index]) {
      return description;
    }
    return words.slice(0, 20).join(" ") + "...";
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container} pointerEvents="auto">
          <Text style={styles.header}>Palmarès</Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nos Réalisations</Text>
            <FlatList
              data={palmares}
              numColumns={1}
              renderItem={({ item, index }) => (
                <View style={styles.card}>
                  <Ionicons name="trophy" size={40} color="#FFD700" style={styles.cardIcon} />
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>
                    {renderDescription(item.description, index)}
                  </Text>
                  {item.description.split(" ").length > 20 && (
                    <TouchableOpacity onPress={() => toggleExpand(index)}>
                      <Text style={styles.showMore}>
                        {expanded[index] ? "Voir moins" : "Voir plus"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
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
    backgroundColor: "#FFF5EE",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF4500",
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
    width: "100%",
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
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
  showMore: {
    color: "#FF4500",
    marginTop: 5,
    textAlign: "center",
  },
});

export default Palmares;
