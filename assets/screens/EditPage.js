import * as React from 'react';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

const EditPage = () => {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={['#89CFF0', '#89CFF0', '#FFA500']}
      style={styles.container}
    >
      <View style={styles.cardContainer}>
        <Card style={styles.card}>
          <Card.Title
            title="Accueil"
            subtitle="Modifier la page d'accueil"
            left={(props) => <Avatar.Icon {...props} icon="home" />}
            right={(props) => (
              <IconButton {...props} icon="pencil" onPress={() => navigation.navigate("EditHome")} />
            )}
          />
        </Card>
        <Card style={styles.card}>
          <Card.Title
            title="Ajouter Utilisateur"
            subtitle="Ajouter un nouvel utilisateur"
            left={(props) => <Avatar.Icon {...props} icon="account-plus" />}
            right={(props) => (
              <IconButton {...props} icon="pencil" onPress={() => navigation.navigate("Register")} />
            )}
          />
        </Card>
        <Card style={styles.card}>
          <Card.Title
            title="Voir Utilisateur"
            subtitle="Voir les détails de l'utilisateur"
            left={(props) => <Avatar.Icon {...props} icon="account" />}
            right={(props) => (
              <IconButton {...props} icon="eye" onPress={() => navigation.navigate("ViewUsers")} />
            )}
          />
        </Card>
        {/* <Card style={styles.card}>
          <Card.Title
            title="Ajouter Événement"
            subtitle="Ajouter un nouvel événement"
            left={(props) => <Avatar.Icon {...props} icon="calendar-plus" />}
            right={(props) => (
              <IconButton {...props} icon="pencil" onPress={() => navigation.navigate("AddEvent")} />
            )}
          />
        </Card> */}
        {/* <Card style={styles.card}>
          <Card.Title
            title="View Événement"
            subtitle="Voir les détails de l'événement"
            left={(props) => <Avatar.Icon {...props} icon="calendar" />}
            right={(props) => (
              <IconButton {...props} icon="eye" onPress={() => navigation.navigate("ViewEvent")} />
            )}
          />
        </Card> */}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: '90%',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
});

export default EditPage;