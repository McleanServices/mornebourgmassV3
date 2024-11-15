import * as React from 'react';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { StyleSheet, View, FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

const data = [
  {
    title: "Accueil",
    subtitle: "Modifier la page d'accueil",
    icon: "home",
    navigateTo: "EditHome"
  },
  {
    title: "Ajouter Utilisateur",
    subtitle: "Ajouter un nouvel utilisateur",
    icon: "account-plus",
    navigateTo: "Inscription"
  },
  {
    title: "Voir Utilisateur",
    subtitle: "Voir les détails de l'utilisateur",
    icon: "account",
    navigateTo: "ViewUsers"
  },
  {
    title: "Voir Activités",
    subtitle: "Voir et modifier les activités",
    icon: "calendar",
    navigateTo: "ViewActivities"
  },
  {
    title: "Ajouter Palmarès",
    subtitle: "Ajouter un nouveau palmarès",
    icon: "trophy",
    navigateTo: "AddPalmares"
  },
  {
    title: "Modifier Palmarès",
    subtitle: "Modifier un palmarès existant",
    icon: "trophy",
    navigateTo: "ViewPalmares"
  }
];

const EditPage = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.title}
        subtitle={item.subtitle}
        left={(props) => <Avatar.Icon {...props} icon={item.icon} />}
        right={(props) => (
          <IconButton {...props} icon="pencil" onPress={() => navigation.navigate(item.navigateTo)} />
        )}
      />
    </Card>
  );

  return (
    <LinearGradient
      colors={['#89CFF0', '#89CFF0', '#FFA500']}
      style={styles.gradient}
    >
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
        contentContainerStyle={{ aspectRatio: 1 }}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
  },
  card: {
    width: '90%',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    alignSelf: 'center',
  },
});

export default EditPage;