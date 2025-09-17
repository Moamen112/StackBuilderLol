import {
  View,
  Text,
  Pressable,
  ImageBackground,
  StyleSheet,
  FlatList,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/Colors";
import { itemImage } from "../championsdb/championsdb";

export default function Itemslist({ items }) {
  const navigation = useNavigation();
  const itemRender = ({ item }) => {
    return (
      <Pressable
        style={({ pressed }) => {
          pressed && { backgroundColor: "red" };
        }}
        onPress={() => navigation.navigate("ItemDetails", item)}
      >
        <ImageBackground
          source={{ uri: itemImage(item.id) }}
          style={styles.itemContainer}
          imageStyle={styles.imageStyle}
          resizeMode="cover"
        >
          <View style={styles.infoBar}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.detailsContainer}>
              {/* <Text style={styles.itemClass} numberOfLines={1}>
                {item.tags.join(", ")}
              </Text> */}
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    );
  };

  return (
    <FlatList
      numColumns={3}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={itemRender}
      columnWrapperStyle={{ justifyContent: "flex-start" }}
      contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }} // Add padding at the bottom
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    width:100, // Adjusted width
    height: 100, // Adjusted height
    marginBottom: 20,
    marginRight: 10, // Add margin to the right
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderRadius: 8, // Rounded corners for the image itself
  },
  infoBar: {
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent background
    alignItems:"center",
    paddingVertical: 5,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  itemName: {
    color: COLORS.textPrimary,
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemClass: {
    color: COLORS.textSecondary,
    fontSize: 12,
    flexShrink: 1, // Allow text to shrink if needed
    marginRight: 4, // Add some space between text and dots
  },
  
});
