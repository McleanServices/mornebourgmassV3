import React, { useState, useEffect } from "react";
//test
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import axios from "axios";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const About = () => {
  const images = [
    require("../Screenimages/photo1.jpg"),
    require("../Screenimages/photo2.jpg"),
    require("../Screenimages/photo3.jpg"),
    require("../Screenimages/photo4.jpg"),
  ];

  const [activities, setActivities] = useState([]);
  const [notreMission, setNotreMission] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`https://mornebourgmass.com/api/homescreen`);
        setActivities(response.data);
        if (response.data.length > 0) {
          setNotreMission(response.data[0].NotreMission);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  const renderHeader = () => (
    <View>
      <Text style={styles.sectionHeader}>À propos de nous</Text>
      <View style={styles.imagesContainer}>
        {images.map((image, index) => (
          <Image key={index} source={image} style={styles.image} />
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notre mission</Text>
        <Text style={styles.sectionDescription}>{notreMission}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={activities}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.activityCard}>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.activityDescription}>{item.description}</Text>
            </View>
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <Text style={styles.noActivityText}>Aucune activité récente.</Text>
          }
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
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  image: {
    width: "48%",
    height: 150,
    marginBottom: 16,
    borderRadius: 10,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Replace shadow properties with boxShadow
    elevation: 5,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  noActivityText: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
    marginVertical: 20,
  },
});

export default About;