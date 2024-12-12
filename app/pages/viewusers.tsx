
import React from 'react';
import ViewUsers from '../../assets/screens/AdminEdit/EditUsers/ViewUsers';

import { Stack } from 'expo-router';

export default function ViewUsersPage() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'View Users',
          headerShown: true,
        }}
      />
      <ViewUsers />
    </>
  );
}