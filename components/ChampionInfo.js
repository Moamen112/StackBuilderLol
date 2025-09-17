import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  TagIcon,
} from "react-native-heroicons/solid";
import { COLORS } from "../constants/Colors";

const InfoRow = ({ icon, label, children }) => (
  <View style={styles.infoRow}>
    <View style={styles.labelContainer}>
      {icon}
      <Text style={styles.labelText}>{label}</Text>
    </View>
    <View style={styles.valueContainer}>{children}</View>
  </View>
);

const RatingBar = ({ value, color }) => (
  <View style={styles.ratingBarBackground}>
    <LinearGradient
      colors={color}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.ratingBarFill, { width: `${value * 10}%` }]}
    />
  </View>
);

export default function ChampionInfo({ tags, info }) {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.07)", "rgba(255,255,255,0.0)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <InfoRow
        label="Class"
        icon={<TagIcon size={20} color={COLORS.secondary} />}
      >
        <View style={styles.tagsGrid}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagLabel}>{tag}</Text>
            </View>
          ))}
        </View>
      </InfoRow>

      <View style={styles.separator} />

      <InfoRow
        label="Difficulty"
        icon={<StarIcon size={20} color={COLORS.secondary} />}
      >
        <RatingBar
          value={info.difficulty}
          color={
            info.difficulty <= 3
              ? ["#2ecc71", "#27ae60"]
              : info.difficulty <= 7
              ? ["#f1c40f", "#f39c12"]
              : ["#e74c3c", "#c0392b"]
          }
        />
      </InfoRow>

      <View style={styles.separator} />

      <InfoRow
        label="Attack"
        icon={<SparklesIcon size={20} color={"#e74c3c"} />}
      >
        <RatingBar value={info.attack} color={["#e74c3c", "#c0392b"]} />
      </InfoRow>

      <View style={styles.separator} />

      <InfoRow
        label="Defense"
        icon={<ShieldCheckIcon size={20} color={"#3498db"} />}
      >
        <RatingBar value={info.defense} color={["#3498db", "#2980b9"]} />
      </InfoRow>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "35%",
  },
  labelText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  valueContainer: {
    width: "65%",
    alignItems: "flex-start",
  },
  tagsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    margin: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  tagLabel: {
    color: "#f1c40f",
    fontWeight: "700",
    fontSize: 13,
  },
  ratingBarBackground: {
    height: 14,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 7,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  ratingBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 8,
  },
});