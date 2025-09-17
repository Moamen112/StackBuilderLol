import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { championPassiveImage } from "../championsdb/championsdb";
import { COLORS, TEXT_COLORS } from "../constants/Colors";

export default function ChampionPassive({ passive }) {
  if (!passive) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: championPassiveImage(passive.image.full) }}
          style={styles.passiveImage}
        />
        <Text style={styles.title}>Passive: {passive.name}</Text>
      </View>
      <Text style={styles.description}>{passive.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  passiveImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    flex: 1,
  },
  description: {
    color: "#d1d5db",
    lineHeight: 22,
  },
});