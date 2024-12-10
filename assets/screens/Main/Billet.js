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
import { useRouter } from 'expo-router';

const BilletScreen = () => {
  const router = useRouter();
  
  const tickets = [
    {
      id: "1",
      title: "Pass Général",
      description: "Accès à tous les événements de MorneBourgMass",
      color: "#89CFF0",
      date: "2024-02-01",
      price: "50€"
    },
    {
      id: "2",
      title: "Pass Journée",
      description: "Accès aux événements pour une journée",
      color: "#FFA500",
      date: "2024-02-02",
      price: "20€"
    }
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.sectionHeader}>Billets Disponibles</Text>
        <FlatList
          data={tickets}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.ticketCard, { backgroundColor: item.color }]}
              onPress={() => router.push({
                pathname: '/payment',
                params: { ticketId: item.id }
              })}
            >
              <Text style={styles.ticketTitle}>{item.title}</Text>
              <Text style={styles.ticketDescription}>{item.description}</Text>
              <View style={styles.ticketFooter}>
                <Text style={styles.ticketDate}>Valide jusqu'au {item.date}</Text>
                <Text style={styles.ticketPrice}>{item.price}</Text>
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
});

export default BilletScreen;
