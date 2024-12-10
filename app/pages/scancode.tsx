import  ScanCodeScreen  from "../../assets/screens/Main/ScanCodeScreen";

import { Stack } from 'expo-router';
export default function Scancode() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Edit Page',
          headerShown: true,
        }} 
      />
      <ScanCodeScreen />
    </>
  );
}
