import React from 'react';
import EditUser from '../../../../assets/screens/AdminEdit/EditUsers/EditUser';
import { Stack } from 'expo-router';

export default function EditUserPage() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Edit User',
          headerShown: true,
        }} 
      />
      <EditUser />
    </>
  )
};

