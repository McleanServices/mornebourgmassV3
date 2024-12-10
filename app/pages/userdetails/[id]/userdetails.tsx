import  UserDetailsScreen  from "../../../../assets/screens/AdminEdit/EditUsers/UserDetails";

import { Stack } from 'expo-router';
export default function UserDetails() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'User Details',
          headerShown: true,
        }} 
      />
      <UserDetailsScreen />
    </>
  );
}
