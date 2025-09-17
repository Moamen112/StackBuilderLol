import { View, Text, ScrollView, Pressable, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { fetchItems, itemImage } from "../championsdb/championsdb";
import { COLORS } from "../constants/Colors";

export default function ItemFrom({ items }) {
  const [allItems, setAllItems] = useState({});

  useEffect(() => {
    const loadItems = async () => {
      const fetchedItems = await fetchItems();
      setAllItems(fetchedItems.data);
    };
    loadItems();
  }, []);

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
        Builds From
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
