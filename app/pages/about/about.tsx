import React from "react";
import About  from "../../../assets/screens/Main/About";

import { Stack } from "expo-router";

export default function Billet() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Accueil",
          headerShown: true,
        }}
      />
      <About />
    </>
  );
}
