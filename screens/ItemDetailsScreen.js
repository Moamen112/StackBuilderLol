import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  Image,
  StyleSheet,
} from "react-native";
import React from "react";
import { COLORS, TEXT_COLORS } from "../constants/Colors";
import { ChevronLeftIcon, CircleStackIcon } from "react-native-heroicons/solid";
import { useNavigation, useRoute } from "@react-navigation/native";
import { itemImage } from "../championsdb/championsdb";
import { SafeAreaView } from "react-native-safe-area-context";
import ItemFrom from "../components/ItemFrom";
import ItemInto from "../components/ItemInto";

const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";
const topMargin = ios ? "" : "mt-3";

const parseDescription = (description) => {
  if (!description) return null;

  const parts = description.split(
    /(<attention>.*?<\/attention>|<passive>.*?<\/passive>|<active>.*?<\/active>|<stats>.*?<\/stats>)/g
  );

  return parts.map((part, index) => {
    if (part.startsWith("<attention>")) {
      const cleanPart = part
        .replace(/<attention>|<\/attention>/g, "")
        .replace(/<br>/g, "\n")
        .replace(/<[^>]*>/g, "");
      return (
        <View className="gap-5">
          <Text
            key={index}
            style={{
              color: COLORS.secondary,
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            {cleanPart}
          </Text>
        </View>
      );
    } else if (part.startsWith("<passive>")) {
      const cleanPart = part
        .replace(/<passive>|<\/passive>/g, "")
        .replace(/<br>/g, "")
        .replace(/<[^>]*>/g, "");
      return (
        <Text
          key={index}
          style={{
            color: COLORS.primary,
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          {cleanPart}
        </Text>
      );
    } else if (part.startsWith("<active>")) {
      const cleanPart = part
        .replace(/<active>|<\/active>/g, "")
        .replace(/<br>/g, "")
        .replace(/<[^>]*>/g, "");
      return (
        <Text
          key={index}
          style={{
            color: COLORS.secondary,
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          {cleanPart}
        </Text>
      );
    } else if (part.startsWith("<stats>")) {
      const statsContent = part
        .replace(/<stats>|<\/stats>/g, "")
        .replace(/<br>/g, "\n");
      const stats = statsContent.split(/<attention>|<\/attention>/g);
      return (
        <Text key={index} style={{ color: COLORS.textWhite, fontSize: 16 }}>
          {stats.map((stat, i) => {
            if (i % 2 === 1) {
              return (
                <Text
                  key={i}
                  style={{ color: COLORS.secondary, fontWeight: "bold" }}
                >
                  {stat}
                </Text>
              );
            }
            return stat;
          })}
        </Text>
      );
    }

    const cleanPart = part.replace(/<br>/g, " ").replace(/<[^>]*>/g, "");
    return (
      <Text key={index} style={{ color: COLORS.textWhite, fontSize: 16 }}>
        {cleanPart}
      </Text>
    );
  });
};

export default function ItemDetailsScreen() {
  const { params: item } = useRoute();
  const navigation = useNavigation();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <SafeAreaView
        className={
          "absolute z-20 w-full flex-row items-center justify-between px-4 " +
          topMargin
        }
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: COLORS.secondary }}
          className="rounded-xl p-1"
        >
          <ChevronLeftIcon size="28" strokeWidth={2.5} color="black" />
        </TouchableOpacity>
        <View>
          <Text className="text-3xl" style={{ color: COLORS.textWhite }}>
            StatCraft
            <Text className="text-lg" style={{ color: COLORS.secondary }}>
              Lol
            </Text>
          </Text>
        </View>
      </SafeAreaView>

      <View className="mt-32 mx-4">
        <View className="flex-row items-center gap-x-3">
          <Image
            source={{ uri: itemImage(item.id) }}
            style={{ width: 100, height: 100, borderRadius: 10 }}
          />
          <View className="flex-1">
            <Text className="text-white text-3xl font-bold">{item.name}</Text>
            <View className="flex-row items-center space-x-2 mt-2">
              <CircleStackIcon color={COLORS.textSecondary} size={24} />
              <Text className="text-white text-lg font-semibold">
                {item.gold.total}
              </Text>
            </View>
          </View>
        </View>

        <View className=" gap-y-2">{parseDescription(item.description)}</View>

        {item.from ? <ItemFrom items={item.from} /> : null}
        {item.into ? <ItemInto items={item.into} /> : null}
      </View>
    </ScrollView>
  );
}
