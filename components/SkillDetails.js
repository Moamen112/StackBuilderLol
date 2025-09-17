import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { COLORS, TEXT_COLORS } from "../constants/Colors";

const DetailRow = ({ label, value, resourceType }) => {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {value} {resourceType}
      </Text>
    </View>
  );
};

export default function SkillDetails({ spell, level, resourceType }) {
  if (!spell || level === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholder}>
          Level up the skill to see details.
        </Text>
      </View>
    );
  }

  const levelIndex = level - 1;
  const cooldown = spell.cooldown[levelIndex];
  const cost = spell.cost[levelIndex];
  const range = spell.range[levelIndex];

  return (
    <View style={styles.container}>
      <DetailRow label="Cooldown" value={`${cooldown}s`} />
      <DetailRow label="Cost" value={cost} resourceType={resourceType} />
      <DetailRow label="Range" value={range} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    width: "100%",
  },
  placeholder: {
    color: TEXT_COLORS.gray,
    textAlign: "center",
    fontStyle: "italic",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: COLORS.textSecondary,
    fontWeight: "bold",
    fontSize: 16,
  },
  value: {
    color: "white",
    fontSize: 16,
  },
});