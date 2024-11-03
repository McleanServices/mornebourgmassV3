import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import axios from "axios";

const HomeScreen = () => {
  // Array of image sources
  const images = [
    require("../images/photo1.jpg"),
    require("../images/photo2.jpg"),
    require("../images/photo3.jpg"),
    require("../images/photo4.jpg"),
  ];

  const [activities, setActivities] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 3 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("https://mornebourgmass.com/api/activity"); // Replace with your server URL
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView style={styles.container}>
      {/* Image Carousel Section */}
      <Image
        source={images[currentIndex]}
        style={[styles.image, { width: screenWidth * 1 }]} // 90% of screen width
      />
      <View>
        <FlatList
          data={images}
          
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          pagingEnabled
          style={styles.carousel}
        />
      </View>

      {/* Recent Activity Section */}
      <View style={styles.activitySection}>
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <View key={index} style={styles.activityCard}>
              <Text style={styles.sectionTitle}>{activity.title}</Text>
              <Text style={styles.activityDescription}>{activity.description}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noActivityText}>Aucune activité récente.</Text>
        )}
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaText}>Explorez maintenant</Text>
        </TouchableOpacity>
      </View>

      {/* About Us Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>À propos de nous</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Notre mission</Text>
          <Text style={styles.aboutDescription}>
            Nous sommes dédiés à la création d'une communauté dynamique qui célèbre l'esprit du carnaval. Notre objectif est d'autonomiser les individus en offrant des opportunités d'expression artistique, de travail d'équipe et d'enrichissement culturel. Rejoignez-nous pour partager notre passion pour le carnaval tout en favorisant un environnement accueillant et solidaire pour tous. Ensemble, nous pouvons créer des expériences inoubliables et des connexions durables !
          </Text>
        </View>
      </View>

      {/* Achievements Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Palmarès</Text>
        <View style={styles.grid}>
          {[
            { title: "Meilleur contributeur 2023", description: "Récompensé pour avoir apporté les ressources et les idées les plus précieuses à la communauté en 2023." },
            { title: "Prix du meilleur design", description: "Reconnu pour la création d'un design d'application innovant et centré sur l'utilisateur, augmentant l'engagement des utilisateurs." },
            { title: "Excellence en leadership", description: "Présenté pour avoir démontré un leadership exceptionnel et avoir guidé plusieurs projets réussis." },
            { title: "Engagement communautaire", description: "Honoré pour son engagement actif avec la communauté, l'organisation d'événements et la promotion de la collaboration." },
          ].map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  imageSection: {
    height: 220,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  carousel: {
    flexGrow: 0,
  },
  carouselImage: {
    width: 300, // Adjust width as needed
    height: "100%",
    borderRadius: 20,
  },
  activitySection: {
    padding: 16,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24, // Increased size for better visibility
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2C3E50", // Changed to a deeper color for contrast
  },
  activityDescription: {
    fontSize: 16,
    color: "#7F8C8D", // Softer color
    marginBottom: 15,
  },
  ctaButton: {
    backgroundColor: "#3498DB", // Changed to a different shade
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  aboutCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  aboutTitle: {
    fontSize: 20, // Increased size for the title
    fontWeight: "bold",
    color: "#2C3E50", // Changed to a deeper color
    marginBottom: 10,
  },
  aboutDescription: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 5
  },
  cardDescription: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  image: {
    height: 300,
    resizeMode: "cover",
    alignSelf: "center", // Center the image horizontally
  },
});

export default HomeScreen;
