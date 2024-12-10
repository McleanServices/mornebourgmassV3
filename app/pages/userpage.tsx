
import EditUserPage from '../../assets/screens/AdminEdit/EditUsers/EditUserPage';

import { Stack } from 'expo-router';
export default function UserPage() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'User Page',
          headerShown: true,
        }} 
      />
      <EditUserPage />
    </>
  );
}