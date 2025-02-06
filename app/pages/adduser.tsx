import RegisterScreen from '../../assets/screens/AdminEdit/EditUsers/Register';
import { Stack } from "expo-router";
import {ScrollView} from "react-native";

export default function Register() {
  return (
    <ScrollView>
      <Stack.Screen 
        options={{
          title: 'Edit Page',
          headerShown: true, // Hide the header as it's now in RegisterScreen
        }} 
      />
      <RegisterScreen />
    </ScrollView>
  );
}
