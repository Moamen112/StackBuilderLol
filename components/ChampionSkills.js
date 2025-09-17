import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, TEXT_COLORS } from "../constants/Colors";
import { championSkillImage, spellVideo } from "../championsdb/championsdb";
import { useVideoPlayer, VideoView } from "expo-video";
import { PlusCircleIcon, PlusIcon } from "react-native-heroicons/solid";
import SkillDetails from "./SkillDetails";
import ChampionPassive from "./ChampionPassive";

export default function ChampionSkills({
  champion,
  skillLevels = {},
  onSkillLevelUp,
  isInteractive = false,
  level = 1,
  availableSkillPoints = 0,
}) {
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [isSelected, setIsSelected] = useState("");
  const [videoSource, setVideoSource] = useState("");
  const skillKeys = ["Q", "W", "E", "R"];

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.pause();
    player.muted = true;
  });

  useEffect(() => {
    if (champion && champion.spells) {
      setSelectedSpell({ ...champion.spells[0], key: "Q" });
      setIsSelected(champion.spells[0].id);
    }
  }, [champion]);

  useEffect(() => {
    if (champion && selectedSpell) {
      setVideoSource(spellVideo(champion?.key, selectedSpell?.key));
    }
  }, [selectedSpell]);

  const spellClickHandler = (spell, key) => {
    setSelectedSpell({ ...spell, key });
    setIsSelected(spell.id);
    player.play();
  };

  const canSkillBeUpgraded = (skillKey, currentSkillLevel) => {
    if (availableSkillPoints <= 0) return false;

    const isUltimate = skillKey === "R";
    const maxSkillLevel = isUltimate ? 3 : 5;

    if (currentSkillLevel >= maxSkillLevel) return false;

    if (isUltimate) {
      const requiredLevel = 6 + currentSkillLevel * 5; // 6, 11, 16
      if (level < requiredLevel) return false;
    } else {
      const maxPointsAllowedByLevel = Math.ceil(level / 2);
      if (currentSkillLevel >= maxPointsAllowedByLevel && level > 1)
        return false;
    }

    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skills</Text>
      {champion && champion.passive && (
        <ChampionPassive passive={champion.passive} />
      )}
      {champion && champion.spells && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.skillsContainer}>
            {champion?.spells.map((spell, index) => {
              const skillKey = skillKeys[index];
              const currentSkillLevel = skillLevels[skillKey];
              const isUpgradable = canSkillBeUpgraded(
                skillKey,
                currentSkillLevel
              );

              return (
                <View key={index} style={styles.skillWrapper}>
                  <Pressable
                    onPress={() => spellClickHandler(spell, skillKey)}
                    style={[
                      styles.skillIconContainer,
                      isSelected === spell.id && styles.selectedSkill,
                    ]}
                  >
                    <Image
                      source={{ uri: championSkillImage(spell.id) }}
                      style={styles.skillImage}
                    />
                    {isInteractive && currentSkillLevel > 0 && (
                      <View style={styles.levelIndicator}>
                        <Text style={styles.levelText}>
                          {currentSkillLevel}
                        </Text>
                      </View>
                    )}
                    {isInteractive && isUpgradable && (
                      <View style={styles.upgradeIndicator}>
                        <PlusIcon size={24} color="gold" />
                      </View>
                    )}
                  </Pressable>
                  {isInteractive && (
                    <TouchableOpacity
                      style={styles.levelUpButton}
                      onPress={() => onSkillLevelUp(skillKey)}
                      disabled={!isUpgradable}
                    >
                      <PlusCircleIcon
                        size={24}
                        color={
                          isUpgradable ? COLORS.secondary : "rgba(255,255,255,0.2)"
                        }
                      />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
      <View style={styles.detailsContainer}>
        <Text style={styles.spellName}>
          {selectedSpell?.key} - {selectedSpell?.name}
        </Text>
        <Text style={styles.spellDescription}>
          {isInteractive ? selectedSpell?.tooltip : selectedSpell?.description}
        </Text>

        {isInteractive && selectedSpell && (
          <SkillDetails
            spell={selectedSpell}
            level={skillLevels[selectedSpell.key]}
            resourceType={champion.partype}
          />
        )}

        {champion && selectedSpell && (
          <VideoView
            player={player}
            nativeControls={true}
            style={styles.videoPlayer}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: 24, marginBottom: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  skillsContainer: { flexDirection: "row", gap: 16, paddingHorizontal: 4 },
  skillWrapper: { alignItems: "center", gap: 8 },
  skillIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedSkill: { borderColor: COLORS.border },
  skillImage: { width: "100%", height: "100%" },
  levelIndicator: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  levelText: { color: "white", fontWeight: "bold", fontSize: 12 },
  levelUpButton: { marginTop: 4 },
  detailsContainer: { alignItems: "center", gap: 12, padding: 16 },
  spellName: { fontSize: 24, color: TEXT_COLORS.secondary },
  spellDescription: { color: "#d1d5db", textAlign: "center" },
  videoPlayer: { width: "100%", height: 200, marginTop: 8 },
  upgradeIndicator: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});