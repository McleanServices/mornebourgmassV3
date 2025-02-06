import EditHomeScreen from '../../assets/screens/AdminEdit/EditHome/EditHome';
import { Stack } from 'expo-router';
import { ScrollView} from 'react-native';

export default function EditHome() {
  return (
    <ScrollView>
      <Stack.Screen
        options={{
          title: 'Modifier Accueil', 
          headerShown: true,
        }}
      />
      <EditHomeScreen />
      </ScrollView>
  );
}

// TODO : CREATE API FOR EDIT HOME PAGE
// ! CREATE API FOR EDIT HOME PAGE
