import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { COLORS, TEXT_COLORS } from "../constants/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  championImage,
  championImageSplash,
  fetchChampionDetails,
} from "../championsdb/championsdb";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { LinearGradient } from "expo-linear-gradient";
import ChampionSkins from "../components/ChampionSkins";
import Button from "../components/UI/Button";
import ChampionSkills from "../components/ChampionSkills";

const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";
const topMargin = ios ? "" : "mt-3";

export default function ChampionDetailsScreen() {
  const { params: champ } = useRoute();
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [champion, setChampion] = useState({});

  useLayoutEffect(() => {
    getChampionDetails(champ?.id);
  }, [champ]);

  const getChampionDetails = async (id) => {
    const response = await fetchChampionDetails(id);
    if (response && response.data) {
      setChampion(response.data[champ?.id]);
    }
  };

  return (
    <ScrollView
      scrollEventThrottle={16}
      style={{ paddinBottom: 50, backgroundColor: COLORS.background }}
      className="flex-"
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
        <TouchableOpacity
          onPress={() => setIsFavorite(!isFavorite)}
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          className="rounded-xl p-2"
        >
          <HeartIcon
            size="28"
            color={isFavorite ? COLORS.secondary : TEXT_COLORS.white}
          />
        </TouchableOpacity>
      </SafeAreaView>
      <View>
        <Image
          source={{ uri: championImageSplash(champ.id) }}
          style={{
            width: width,
            height: height * 0.7,
          }}
        />
        <LinearGradient
          colors={["transparent", "rgba(23,23,23,0.8)", "rgba(23,23,23,1)"]}
          style={{ width, height: height * 0.4 }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          className="absolute bottom-0"
        />
      </View>
      <View style={{ marginTop: -(height * 0.15) }} className="gap-1">
        <Text
          className="text-center text-2xl font-bold tracking-wider uppercase"
          style={{ color: COLORS.secondary }}
        >
          {champion?.title}
        </Text>
        <Text className="text-center text-6xl font-bold tracking-wider text-white">
          {champion?.name}
        </Text>
        <View className="mx-4 flex-row justify-center gap-x-2 mb-5">
          {champion?.tags?.map((tag, index) => {
            return (
              <View
                key={index}
                className="rounded-full px-3 py-1"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <Text
                  className="text-center text-sm font-semibold"
                  style={{ color: "white" }}
                >
                  {tag}
                </Text>
              </View>
            );
          })}
        </View>
        <View className="mx-6 mb-7">
          <Text
            className="text-2xl font-bold mb-2"
            style={{ color: COLORS.textSecondary }}
          >
            Lore
          </Text>
          {champion?.lore && (
            <Text
              className="leading-7 tracking-wide"
              style={{ color: "#d1d5db" }}
            >
              <Text
                style={{
                  fontSize: 34,
                  color: COLORS.secondary,
                  fontWeight: "bold",
                }}
              >
                {champion.lore.slice(0, 1)}
              </Text>
              {champion.lore.slice(1)}
            </Text>
          )}
        </View>
        <View
          className="mx-6 my-3 h-0.5 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        ></View>
        <ChampionSkills champion={champion} isInteractive={false} />
        <View className="w-full items-center justify-center">
          <Button
            onPress={() => navigation.navigate("ChampionStats", champion)}
            textStyle={{ color: COLORS.textPrimary }}
            containerStyle={styles.buttonStyle}
          >
            More Details...
          </Button>
        </View>
        <View
          className="mx-6 my-3 h-0.5 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        ></View>
        <ChampionSkins champ={champion} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: COLORS.textSecondary,
    paddingVertical: 15,
    paddingHorizontal: 55,
    borderRadius: 8,
    textAlign: "center",
  },
});