import * as React from 'react';
import { Avatar, Card, IconButton, Text } from 'react-native-paper';
import { StyleSheet, View, ScrollView } from 'react-native'; // Import ScrollView
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';


const data = [
  {
    title: "Voir Activités",
    subtitle: "Voir et modifier les activités",
    icon: "calendar",
    navigateTo: "ViewActivities"
  },
  {
    title: "Ajouter Activité",
    subtitle: "Ajouter une nouvelle activité",
    icon: "calendar-plus",
    navigateTo: "AddActivity"
  }
];

const EditActivtyPage = () => {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFFFFF', '#FFFFFF']} // Change gradient colors to white
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text>Accédez aux options d'administration ci-dessous</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
        {data.map((item) => (
          <Card key={item.title} style={styles.card} onPress={() => navigation.navigate(item.navigateTo)}>
            <Card.Title
              title={item.title}
              subtitle={item.subtitle}
              left={(props) => <Avatar.Icon {...props} icon={item.icon} />}
              right={(props) => (
                <IconButton {...props} icon="chevron-right" />
              )}
            />
          </Card>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    paddingVertical: 10,
  },
  card: {
    width: '90%',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    backgroundColor: '#007BFF',
  },
  headerTextContainer: {
    marginLeft: 15,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 14,
    color: '#666',
  },
  adminName: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditActivtyPage;