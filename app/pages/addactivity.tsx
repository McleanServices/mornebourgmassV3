
import AddActivityMobileScreen from '../../assets/screens/AdminEdit/EditActivity/AddactivityMobile';

import { Stack } from 'expo-router';
export default function AddActivity() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Add Activity',
          headerShown: true,
        }} 
      />
      <AddActivityMobileScreen />
    </>
  );
}