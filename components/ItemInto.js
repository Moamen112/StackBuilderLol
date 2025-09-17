import { View, Text, Image, Pressable, ScrollView } from "react-native";
import React from "react";
import { itemImage } from "../championsdb/championsdb";
import { COLORS } from "../constants/Colors";

export default function ItemInto({ items }) {
  return (
    <View style={{ marginTop: 20 }}>
      <Text
        style={{
          color: COLORS.textWhite,
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Builds Into
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items?.map((item) => (
          <Pressable key={item} style={{ marginRight: 15 }}>
            <Image
              source={{ uri: itemImage(item) }}
              style={{ width: 90, height: 90, borderRadius: 10 }}
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}