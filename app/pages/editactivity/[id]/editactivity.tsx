import EditActivityMobile from '../../../../assets/screens/AdminEdit/EditActivity/EditActivityMobile';
import EditActivityScreen from '../../../../assets/screens/AdminEdit/EditActivity/EditActivityScreen';
import { Platform } from 'react-native';
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
      {Platform.OS === 'web' ? <EditActivityScreen /> : <EditActivityMobile />}
    </>
  );
}
