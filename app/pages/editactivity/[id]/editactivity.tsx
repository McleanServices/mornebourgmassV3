import EditActivityMobile from '../../../../assets/screens/AdminEdit/EditActivity/EditActivityMobile';

import { Stack } from 'expo-router';
export default function EditActivity() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Edit Activity',
          headerShown: true,
        }} 
      />
      <EditActivityMobile />
    </>
  );
}
