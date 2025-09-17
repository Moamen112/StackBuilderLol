import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { championSkinImage } from "../championsdb/championsdb";
import { COLORS } from "../constants/Colors";

const { width, height } = Dimensions.get("window");

const getSkinName = (skin, champ) => {
  if (skin.name === "default") {
    return champ.name;
  }
  if (skin.name.length > 23) {
    return skin.name.slice(0, 23) + "...";
  }
  return skin.name;
};

export default function ChampionSkins({ champ }) {
  const [selectedSkin, setSelectedSkin] = useState(0);
  const [isSelected, setIsSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  if (!champ || !champ.skins) {
    return <Text>Loading skins...</Text>;
  }

  return (
    <View className="mx-6 mb-7 gap-y-6">
      <Text
        className="text-2xl font-bold"
        style={{ color: COLORS.textSecondary }}
      >
        Skins
      </Text>
      <View>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={COLORS.secondary}
            style={{ position: "absolute", top: "45%", left: "45%" }}
          />
        )}
        <Image
          source={{ uri: championSkinImage(champ.id, selectedSkin) }}
          style={{ height: 250, width: width * 0.9 }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-5 ">
          {champ.skins.map((skin) => {
            return (
              <Pressable
                onPress={() => {
                  setSelectedSkin(skin.num);
                  setIsSelected(skin.num);
                }}
                key={skin.num}
                className="gap-y-3"
              >
                <Image
                  source={{ uri: championSkinImage(champ.id, skin.num) }}
                  style={[
                    {
                      width: width * 0.4,
                      height: 100,
                      resizeMode: "cover",
                    },
                    isSelected === skin.num
                      ? { borderWidth: 2, borderColor: COLORS.border }
                      : null,
                  ]}
                />
                <Text style={{ color: "white", textAlign: "center" }}>
                  {getSkinName(skin, champ)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}