import EditHomeScreen from '../../assets/screens/AdminEdit/EditHome/EditHome';

import { Stack } from 'expo-router';
export default function EditHome() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Edit Page', 
          headerShown: true,
        }} 
      />
      <EditHomeScreen />
    </>
  );
}

// TODO : CREATE API FOR EDIT HOME PAGE
// ! CREATE API FOR EDIT HOME PAGE