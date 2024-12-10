import RegisterScreen from '../../assets/screens/AdminEdit/EditUsers/Register';

import { Stack } from 'expo-router';
export default function Register() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Edit Page',
          headerShown: true,
        }} 
      />
      <RegisterScreen />
    </>
  );
}
