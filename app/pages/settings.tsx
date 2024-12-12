import SettingsScreen from '../../assets/screens/Main/Settings';

import { Stack } from 'expo-router';
export default function Settings() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Settings',
          headerShown: true,
          headerBackTitle: 'retour', // Add this line to remove the back button title
        }} 
      />
      <SettingsScreen />
    </>
  );
}