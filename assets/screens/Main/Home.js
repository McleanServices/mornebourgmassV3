import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  Animated, // Import Animated
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { IconButton } from 'react-native-paper'; // Add this import

const HomeScreen = () => {
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const slideAnim1 = useRef(new Animated.Value(-1000)).current; // Initial value for first view slide animation
  const slideAnim2 = useRef(new Animated.Value(-1000)).current; // Initial value for second view slide animation
  const slideAnim3 = useRef(new Animated.Value(-1000)).current; // Initial value for third view slide animation

  useEffect(() => {
    // Start slide animations one after the other
    Animated.sequence([
      Animated.timing(slideAnim1, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim2, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim3, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const categories = [
    { id: "1", name: "Billets", icon: "ticket", onPress: () => router.push('/(tabs)/billet') },
    { id: "2", name: "Événement", icon: "calendar", onPress: () => router.push('/activity-main') },
    { id: "3", name: "Actualités", icon: "newspaper", onPress: () => router.push('/reglementation') },
    { id: "4", name: "Palmarès", icon: "trophy", onPress: () => router.push('/palmares') },
    { id: "5", name: "À propos", icon: "information-circle", onPress: () => router.push('/about') },
  ];

  const iconColor = "#B19CD9"; // Even lighter shade of #8A2BE2

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
          <Animated.View style={{ transform: [{ translateX: slideAnim1 }] }}>
            <Text style={styles.sectionHeader}>Explorer</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map((category) => (
                <TouchableOpacity key={category.id} style={styles.categoryCard} onPress={category.onPress}>
                  <Ionicons name={category.icon} size={30} color={iconColor} style={styles.categoryIcon} />
                  <Text style={styles.categoryText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          <View style={styles.spacing} />

          <Animated.View style={{ transform: [{ translateX: slideAnim3 }] }}>
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

            <Animated.View style={{ transform: [{ translateX: slideAnim2 }] }}>
              <View style={styles.sectionSeparator} />
              <View style={styles.eventCard}>
                <Text style={styles.eventTitle}>Prêt pour le prochain événement de MorneBourgMass?</Text>
                
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => router.push('/activite')}
                >
                  <Text style={styles.joinButtonText}>Inscrire</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <View style={styles.customRecommendationsContainer}>
              <Text style={styles.sectionTitle}>Nos Suggestions</Text>
              <View style={styles.customRecommendationCard}>
                <Ionicons name="document-text" size={50} color="#89CFF0" />
                <Text style={styles.customRecommendationText}>Lisez la réglementation de MorneBourgMass</Text>
                <IconButton icon="chevron-right" onPress={() => router.push('/reglementation')} />
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
          </Animated.View>
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
    textAlign: "left", // Align text to the left
    alignSelf: "stretch", // Ensure the text takes the full width
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
    justifyContent: "space-between", // Add this line to space out the items
  },
  customRecommendationText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginLeft: 16,
    flex: 1, // Add this line to take available space
  },
  spacing: {
    height: 40, // Adjust the height as needed for spacing
  },
  arrowIcon: {
    marginLeft: 'auto', // Align the arrow icon to the right
  },
});

export default HomeScreen;
