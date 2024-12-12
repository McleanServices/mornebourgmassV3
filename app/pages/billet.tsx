import BilletScreen  from "../../assets/screens/Main/Billet";

import { Stack } from "expo-router";

export default function Billet() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Billet",
          headerShown: true,
        }}
      />
      <BilletScreen />
    </>
  );
}
