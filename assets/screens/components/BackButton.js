import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BackButton({ goBack }) {
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity onPress={goBack} style={[styles.container, { top: insets.top + 10 }]}>
      {/* <Image
        style={styles.image}
        source={require("../../assets/items/back.png")}
      /> */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 4,
  },
  image: {
    width: 24,
    height: 24,
  },
});