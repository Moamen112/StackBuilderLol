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
import { parseTooltip } from "../utils/toolParserV3";

// Enhanced tooltip renderer component
const EnhancedTooltip = ({ tooltip }) => {
  if (!tooltip) return null;

  // Split tooltip into segments based on icons and special formatting
  const renderTooltipText = (text) => {
    const segments = [];
    let currentIndex = 0;

    // Define icon mappings with colors
    const iconMap = {
      "⚡": { color: "#3b82f6", label: "Magic Damage" }, // Blue for magic damage
      "🛡️": { color: "#10b981", label: "Shield" }, // Green for shield
      "💨": { color: "#06b6d4", label: "Move Speed" }, // Cyan for speed
      "⚔️": { color: "#f59e0b", label: "Attack Speed" }, // Amber for attack speed
      "🔮": { color: "#8b5cf6", label: "AP Scaling" }, // Purple for AP
      "🌟": { color: "#fbbf24", label: "Passive" }, // Yellow for passive
      "📜": { color: "#f97316", label: "Spell" }, // Orange for spell names
      "🔄": { color: "#6b7280", label: "Recast" }, // Gray for recast
    };

    // Split by lines first
    const lines = text.split("\n");

    return lines.map((line, lineIndex) => {
      if (!line.trim())
        return <View key={lineIndex} style={styles.lineBreak} />;

      const parts = [];
      let remaining = line;
      let partIndex = 0;

      // Find numbers (damage values, percentages, etc.)
      const numberRegex = /(\d+(?:\.\d+)?(?:%|s)?)/g;
      let match;
      let lastIndex = 0;

      while ((match = numberRegex.exec(remaining)) !== null) {
        // Add text before the number
        if (match.index > lastIndex) {
          const textBefore = remaining.substring(lastIndex, match.index);
          parts.push(
            <Text key={`text-${partIndex}`} style={styles.tooltipText}>
              {textBefore}
            </Text>
          );
          partIndex++;
        }

        // Add the highlighted number
        const numberValue = match[1];
        const isPercentage = numberValue.includes("%");
        const isDuration = numberValue.includes("s");

        parts.push(
          <Text
            key={`number-${partIndex}`}
            style={[
              styles.highlightedNumber,
              isPercentage && styles.percentageNumber,
              isDuration && styles.durationNumber,
            ]}
          >
            {numberValue}
          </Text>
        );
        partIndex++;
        lastIndex = numberRegex.lastIndex;
      }

      // Add remaining text
      if (lastIndex < remaining.length) {
        const remainingText = remaining.substring(lastIndex);
        parts.push(
          <Text key={`text-${partIndex}`} style={styles.tooltipText}>
            {remainingText}
          </Text>
        );
      }

      return (
        <View key={lineIndex} style={styles.tooltipLine}>
          {parts}
        </View>
      );
    });
  };

  return (
    <View style={styles.enhancedTooltipContainer}>
      {renderTooltipText(tooltip)}
    </View>
  );
};

export default function ChampionSkills({
  champion,
  skillLevels = {},
  onSkillLevelUp,
  isInteractive = false,
  level = 1,
  availableSkillPoints = 0,
  stats,
  damageComponent,
  selectedSpell,
  onSpellSelect,
  passiveComponent,
}) {
  const [videoSource, setVideoSource] = useState("");
  const skillKeys = ["Q", "W", "E", "R"];

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.pause();
    player.muted = true;
  });

  useEffect(() => {
    if (champion && selectedSpell) {
      setVideoSource(spellVideo(champion?.key, selectedSpell?.key));
    }
  }, [selectedSpell]);

  const spellClickHandler = (spell, key) => {
    onSpellSelect(spell, key);
    player.play();
  };

  const canSkillBeUpgraded = (skillKey, currentSkillLevel) => {
    if (availableSkillPoints <= 0) return false;

    const isUltimate = skillKey === "R";
    const maxSkillLevel = isUltimate ? 3 : 5;

    if (currentSkillLevel >= maxSkillLevel) return false;

    if (isUltimate) {
      const requiredLevel = 6 + currentSkillLevel * 5;
      if (level < requiredLevel) return false;
    } else {
      const maxPointsAllowedByLevel = Math.ceil(level / 2);
      if (currentSkillLevel >= maxPointsAllowedByLevel && level > 1)
        return false;
    }

    return true;
  };

  // Transform stats with proper AP calculation (you may need to enhance this)
  const transformedStats = {
    ap: stats?.ap || 0, // Add proper AP calculation from items/runes
    ad: stats?.attackdamage || 0,
    bonusAd: Math.max(0, (stats?.attackdamage || 0) - 50), // Assuming base AD of 50
    health: stats?.hp || 0,
  };

  const parsedTooltip =
    selectedSpell && isInteractive && stats && damageComponent
      ? parseTooltip(
          damageComponent.tooltip, // Use tooltipTemplate instead of tooltip
          damageComponent,
          damageComponent.vars || [],
          skillLevels[selectedSpell.key] + 1,
          transformedStats
        )
      : selectedSpell?.description || "";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skills</Text>

      {/* Passive */}
      {champion && champion.passive && passiveComponent && (
        <ChampionPassive
          passive={{
            ...champion.passive,
            description: parseTooltip(
              passiveComponent.tooltipTemplate,
              passiveComponent,
              passiveComponent.vars || [],
              1,
              transformedStats
            ),
          }}
        />
      )}

      {/* Skills */}
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
                      selectedSpell?.id === spell.id && styles.selectedSkill,
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
                          isUpgradable
                            ? COLORS.secondary
                            : "rgba(255,255,255,0.2)"
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

      {/* Enhanced Details Container */}
      <View style={styles.detailsContainer}>
        <View style={styles.spellHeader}>
          <Text style={styles.spellName}>
            {selectedSpell?.key} - {selectedSpell?.name}
          </Text>
          {isInteractive && selectedSpell && (
            <Text style={styles.spellLevel}>
              Level {skillLevels[selectedSpell.key]} /{" "}
              {selectedSpell.key === "R" ? "3" : "5"}
            </Text>
          )}
        </View>

        {/* Enhanced Tooltip Display */}
        <EnhancedTooltip tooltip={parsedTooltip} />

        {isInteractive && selectedSpell && (
          <SkillDetails
            spell={selectedSpell}
            level={skillLevels[selectedSpell.key]}
            resourceType={champion.partype}
            stats={stats}
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
  detailsContainer: { alignItems: "center", gap: 16, padding: 16 },
  spellHeader: {
    alignItems: "center",
    gap: 4,
  },
  spellName: {
    fontSize: 24,
    color: TEXT_COLORS.secondary,
    fontWeight: "bold",
  },
  spellLevel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    opacity: 0.8,
  },
  videoPlayer: { width: "100%", height: 200, marginTop: 8 },
  upgradeIndicator: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Enhanced Tooltip Styles
  enhancedTooltipContainer: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 12,
    paddingVertical: 16,
    width: "100%",
  },
  tooltipLine: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
    alignItems: "baseline",
  },
  tooltipText: {
    color: "#d1d5db",
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
  },
  lineBreak: {
    height: 8,
  },
  highlightedNumber: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    overflow: "hidden",
  },
  percentageNumber: {
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    color: "#c084fc",
  },
  durationNumber: {
    backgroundColor: "rgba(6, 182, 212, 0.2)",
    color: "#67e8f9",
  },
});
