import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
    });
    return unsubscribe;
  }, [navigation]);

  const categories = [
    { id: "1", name: "Billet", icon: "ticket" },
    { id: "2", name: "Événement", icon: "calendar", onPress: () => navigation.navigate('Activité') },
    { id: "3", name: "Actualités", icon: "newspaper" },
    { id: "4", name: "Palmarès", icon: "trophy", onPress: () => navigation.navigate('Palmares') },
    { id: "5", name: "À propos", icon: "information-circle", onPress: () => navigation.navigate('About') },
  ];

  const recommendations = [
    {
      id: "1",
      title: "Costumes de MorneBourgMass",
      description: "Découvrez les meilleurs costumes pour MorneBourgMass.",
      color: "#89CFF0",
    },
    {
      id: "2",
      title: "Musique de MorneBourgMass",
      description: "Écoutez les meilleurs morceaux pour MorneBourgMass.",
      color: "#FFA500",
    }
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.sectionHeader}>Explorer</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard} onPress={category.onPress}>
                <Ionicons name={category.icon} size={30} color="#2C3E50" style={styles.categoryIcon} />
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.sectionSeparator} />
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>Prêt pour le prochain événement de MorneBourgMass?</Text>
            <Text style={styles.eventDetails}>Événement: Parade de MorneBourgMass</Text>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => navigation.navigate('Auth')}
            >
              <Text style={styles.joinButtonText}>REJOINDRE</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recommendationsContainer}>
            <Text style={styles.sectionTitle}>Recommandé pour vous</Text>
            <FlatList
              data={recommendations}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View
                  key={item.id}
                  style={[styles.recommendationCard, { backgroundColor: item.color }]}
                >
                  <Text style={styles.recommendationTitle}>{item.title}</Text>
                  <Text style={styles.recommendationDescription}>{item.description}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>

          <View style={styles.customRecommendationsContainer}>
            <Text style={styles.sectionTitle}>Nos Suggestions</Text>
            <View style={styles.customRecommendationCard}>
              <Ionicons name="musical-notes" size={50} color="#89CFF0" />
              <Text style={styles.customRecommendationText}>Écoutez de la musique de MorneBourgMass</Text>
            </View>
            <View style={styles.customRecommendationCard}>
              <Ionicons name="book" size={50} color="#89CFF0" />
              <Text style={styles.customRecommendationText}>Lisez l'histoire de MorneBourgMass</Text>
            </View>
            <View style={styles.customRecommendationCard}>
              <Ionicons name="walk" size={50} color="#FFA500" />
              <Text style={styles.customRecommendationText}>Participez à une marche de MorneBourgMass</Text>
            </View>
          </View>
        </ScrollView>
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
  categoriesContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "center", // Center horizontally
  },
  categoryCard: {
    alignItems: "center",
    marginHorizontal: 8, // Adjust margin to center items
  },
  categoryIcon: {
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  sectionSeparator: {
    height: 20,
  },
  eventCard: {
    backgroundColor: "#E6E6FA",
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  eventDetails: {
    fontSize: 14,
    color: "#2C3E50",
    marginBottom: 16,
  },
  eventImageContainer: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  eventImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  joinButton: {
    backgroundColor: "#8A2BE2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  joinButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  recommendationsContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 12,
  },
  recommendationCard: {
    width: 200,
    borderRadius: 15,
    padding: 12,
    marginRight: 12,
    justifyContent: "center",
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  customRecommendationsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  customRecommendationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
  },
  customRecommendationText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginLeft: 16,
  },
});

export default HomeScreen;
