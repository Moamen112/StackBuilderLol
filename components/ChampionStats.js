import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, TEXT_COLORS } from "../constants/Colors";
import Icon from "react-native-vector-icons/FontAwesome5";

const StatItem = ({ label, value, iconName, iconColor }) => (
  <View style={styles.statItem}>
    <View style={styles.labelContainer}>
      <Icon
        name={iconName}
        size={14}
        color={iconColor || COLORS.secondary}
        style={styles.icon}
      />
      <Text style={styles.statLabel}>{label}</Text>
    </View>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

export default function ChampionStats({ stats }) {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.0)", "rgba(255,255,255,0.07)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>Champion Stats</Text>
      <View style={styles.statsContainer}>
        {/* Primary Stats */}
        <View style={styles.statGroup}>
          <StatItem
            label="Health"
            value={stats.hp}
            iconName="heart"
            iconColor="#e74c3c"
          />
          <StatItem
            label="Mana"
            value={stats.mp}
            iconName="flask"
            iconColor="#3498db"
          />
          <StatItem
            label="Atk Damage"
            value={stats.attackdamage}
            iconName="gavel"
            iconColor="#f39c12"
          />
          <StatItem
            label="Atk Speed"
            value={stats.attackspeed}
            iconName="bolt"
            iconColor="#f1c40f"
          />
        </View>
        {/* Secondary Stats */}
        <View style={styles.separator} />
        <View style={styles.statGroup}>
          <StatItem
            label="Armor"
            value={stats.armor}
            iconName="shield-alt"
            iconColor="#bdc3c7"
          />
          <StatItem
            label="Magic Resist"
            value={stats.spellblock}
            iconName="shield-alt"
            iconColor="#9b59b6"
          />
          <StatItem
            label="Speed"
            value={stats.movespeed}
            iconName="running"
            iconColor="#2ecc71"
          />
          <StatItem
            label="Range"
            value={stats.attackrange}
            iconName="crosshairs"
            iconColor="#e67e22"
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statGroup: {
    flex: 1,
    paddingHorizontal: 10,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 20,
    textAlign: "center",
    marginRight: 8,
  },
  statLabel: {
    fontSize: 15,
    color: TEXT_COLORS.white,
    fontWeight: "600",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  separator: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});
