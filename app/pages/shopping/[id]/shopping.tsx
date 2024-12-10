import ShoppingScreen from '../../../../assets/screens/Main/Shopping';

import { Stack } from 'expo-router';

export default function Shopping() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Shopping',
          headerShown: true,
        }} 
      />
      <ShoppingScreen />
    </>
  );
}
