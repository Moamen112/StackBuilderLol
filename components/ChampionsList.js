import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { COLORS } from "../constants/Colors";
import { championImage } from "../championsdb/championsdb";
import { useNavigation } from "@react-navigation/native";

// Helper component for the difficulty dots
const DifficultyDots = ({ difficulty }) => {
  const dots = [];
  const totalDots = 5;
  let filledDots = difficulty != 0 ? Math.ceil(difficulty / 2) : 1;

  for (let i = 0; i < totalDots; i++) {
    dots.push(
      <View key={i} style={[styles.dot, i < filledDots && styles.filledDot]} />
    );
  }

  return <View style={styles.dotsContainer}>{dots}</View>;
};

export default function ChampionsList({ champions }) {
  const navigation = useNavigation();
  const championRender = ({ item }) => {
    return (
      <Pressable
        style={({ pressed }) => {
          pressed && { backgroundColor: 'red' };
        }}
        onPress={() => navigation.navigate("ChampionDetails", item)}
      >
        <ImageBackground
          source={{ uri: championImage(item.id) }}
          style={styles.championContainer}
          imageStyle={styles.imageStyle}
          resizeMode="cover"
        >
          <View style={styles.infoBar}>
            <Text style={styles.championName}>{item.name}</Text>
            <View style={styles.detailsContainer}>
              <Text style={styles.championClass} numberOfLines={1}>
                {item.tags.join(", ")}
              </Text>
              <DifficultyDots difficulty={item.difficulty} />
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    );
  };

  return (
    <FlatList
      numColumns={2}
      data={champions}
      keyExtractor={(item) => item.id}
      renderItem={championRender}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      contentContainerStyle={{ paddingBottom: 20 }} // Add padding at the bottom
    />
  );
}

const styles = StyleSheet.create({
  championContainer: {
    width: 170, // Adjusted width
    height: 220, // Adjusted height
    marginBottom: 20,
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderRadius: 8, // Rounded corners for the image itself
  },
  infoBar: {
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent background
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  championName: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  championClass: {
    color: COLORS.textSecondary,
    fontSize: 12,
    flexShrink: 1, // Allow text to shrink if needed
    marginRight: 4, // Add some space between text and dots
  },
  dotsContainer: {
    flexDirection: "row",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#555",
    marginLeft: 3,
  },
  filledDot: {
    backgroundColor: COLORS.primary,
  },
});
