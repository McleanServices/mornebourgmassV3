import { Stack } from "expo-router";
import Reglementation from "../../assets/screens/Main/rules";
import { ScrollView } from "react-native"
export default function Rules() {
  return (
    <ScrollView>
    <Stack.Screen 
      options={{
        title: 'reglementation',
        headerShown: true,
      }} 
    />
    <Reglementation />
  </ScrollView>
  );
}

