import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

const BilletScreen = ({ navigation }) => {
  const tickets = [
    {
      id: "1",
      title: "Ticket 1",
      description: "Description pour le billet 1",
      color: "#89CFF0",
      date: "2023-10-01",
    },
    {
      id: "2",
      title: "Ticket 2",
      description: "Description pour le billet 2",
      color: "#FFA500",
      date: "2023-10-02",
    }
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.sectionHeader}>Vos Billets</Text>
        <FlatList
          data={tickets}
          renderItem={({ item }) => (
            <View style={[styles.ticketCard, { backgroundColor: item.color }]}>
              <Text style={styles.ticketTitle}>{item.title}</Text>
              <Text style={styles.ticketDescription}>{item.description}</Text>
              <Text style={styles.ticketDate}>{item.date}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  ticketCard: {
    borderRadius: 15,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  ticketDescription: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  ticketDate: {
    fontSize: 12,
    color: "#FFFFFF",
    marginTop: 4,
  },
});

export default BilletScreen;
