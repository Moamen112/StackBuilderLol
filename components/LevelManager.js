import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MinusIcon, PlusIcon } from "react-native-heroicons/solid";
import { COLORS } from "../constants/Colors";

export default function LevelManager({
  level,
  skillPoints,
  onLevelUp,
  onLevelDown,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.levelControl}>
        <TouchableOpacity onPress={onLevelDown} style={styles.button}>
          <MinusIcon size={20} color="white" />
        </TouchableOpacity>
        <View style={styles.levelDisplay}>
          <Text style={styles.levelText}>Lv {level}</Text>
        </View>
        <TouchableOpacity onPress={onLevelUp} style={styles.button}>
          <PlusIcon size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.skillPointDisplay}>
        <Text style={styles.skillPointText}>
          Skill Points: {skillPoints}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 20,
    alignItems: "center",
  },
  levelControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  button: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 10,
    borderRadius: 12,
  },
  levelDisplay: {
    marginHorizontal: 20,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  levelText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  skillPointDisplay: {
    marginTop: 12,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  skillPointText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
