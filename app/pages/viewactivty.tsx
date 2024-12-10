import ViewActivities from '../../assets/screens/AdminEdit/EditActivity/ViewActivities';

import { Stack } from 'expo-router';
export default function ViewActivity() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Edit Activity',
          headerShown: true,
        }} 
      />
      <ViewActivities />
    </>
  );
}
