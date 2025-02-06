import EditActivityMobile from '../../../../assets/screens/AdminEdit/EditActivity/EditActivityMobile';
import { Platform, ScrollView} from 'react-native';
import { Stack } from 'expo-router';

export default function EditActivity() {
  return (
    <ScrollView>
      <Stack.Screen 
        options={{
          title: 'Edit Activity',
          headerShown: true,
        }} 
      />
      {Platform.OS === 'web' ? <EditActivityMobile /> : <EditActivityMobile />}
    </ScrollView>
  );
}
