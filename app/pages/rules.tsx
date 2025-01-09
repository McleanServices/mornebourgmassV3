import { Stack } from "expo-router";
import Reglementation from "../../assets/screens/Main/rules";
export default function Rules() {
  return (
    <>
    <Stack.Screen 
      options={{
        title: 'reglementation',
        headerShown: true,
      }} 
    />
    <Reglementation />
  </>
  );
}

