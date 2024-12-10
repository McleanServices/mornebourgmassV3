import EditPageScreen from '../../assets/screens/AdminEdit/EditPage';

import { Stack } from 'expo-router';
export default function EditPage() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Edit Page',
          headerShown: true,
        }} 
      />
      <EditPageScreen />
    </>
  );
}
