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

  // 1. Define styles and icons for different highlight types
  const typeMap = {
    MAGIC: {
      style: styles.magicHighlight,
      textStyle: styles.magicHighlightText,
      icon: "⚡",
    },
    SHIELD: {
      style: styles.shieldHighlight,
      textStyle: styles.shieldHighlightText,
      icon: "🛡️",
    },
    SPEED: {
      style: styles.speedHighlight,
      textStyle: styles.speedHighlightText,
      icon: "💨",
    },
    ATTACK_SPEED: {
      style: styles.attackSpeedHighlight,
      textStyle: styles.attackSpeedHighlightText,
      icon: "⚔️",
    },
    AP: {
      style: styles.apHighlight,
      textStyle: styles.apHighlightText,
      icon: "🔮",
    },
  };

  // 2. Helper to render a highlighted segment with the icon after the number
  const renderHighlightedSegment = (text, type, keyPrefix) => {
    const typeInfo = typeMap[type];
    const numberRegex = /(\d+(?:\.\d+)?(?:%|s)?)/;
    const match = text.match(numberRegex);

    // Fallback for text without a number
    if (!match) {
      return (
        <View key={keyPrefix} style={[styles.highlightContainer, typeInfo.style]}>
          <Text style={[styles.tooltipText, styles.highlightedText, typeInfo.textStyle]}>
            {text}
          </Text>
          <Text style={styles.iconText}>{typeInfo.icon}</Text>
        </View>
      );
    }

    const numberValue = match[0];
    const parts = text.split(numberValue);
    const beforeText = parts[0];
    const afterText = parts.slice(1).join(numberValue);

    const isPercentage = numberValue.includes("%");
    const isDuration = numberValue.includes("s");

    return (
      <View key={keyPrefix} style={[styles.highlightContainer, typeInfo.style]}>
        {beforeText ? (
          <Text style={[styles.tooltipText, styles.highlightedText, typeInfo.textStyle]}>
            {beforeText}
          </Text>
        ) : null}
        <Text
          style={[
            styles.highlightedNumber,
            isPercentage && styles.percentageNumber,
            isDuration && styles.durationNumber,
            typeInfo.textStyle, // Apply type-specific color
          ]}
        >
          {numberValue}
        </Text>
        <Text style={styles.iconText}>{typeInfo.icon}</Text>
        {afterText ? (
          <Text style={[styles.tooltipText, styles.highlightedText, typeInfo.textStyle]}>
            {` ${afterText}`}
          </Text>
        ) : null}
      </View>
    );
  };

  // 3. Main render function to process the tooltip string with markers
  const renderTooltip = () => {
    const lines = tooltip.split("\n");
    return lines.map((line, lineIndex) => {
      if (!line.trim()) return <View key={lineIndex} style={styles.lineBreak} />;

      const segments = line.split(/(__HIGHLIGHT:(?:[A-Z_]+|END)__)/g);
      const renderedLine = [];
      let highlightType = null;

      segments.forEach((segment, segmentIndex) => {
        if (segment.startsWith("__HIGHLIGHT:")) {
          if (segment.includes("END")) {
            highlightType = null;
          } else {
            highlightType = segment.replace("__HIGHLIGHT:", "").replace("__", "");
          }
        } else if (segment) {
          if (highlightType && typeMap[highlightType]) {
            renderedLine.push(
              renderHighlightedSegment(
                segment,
                highlightType,
                `${lineIndex}-${segmentIndex}`
              )
            );
          } else {
            renderedLine.push(
              <Text key={segmentIndex} style={styles.tooltipText}>
                {segment}
              </Text>
            );
          }
        }
      });

      return (
        <View key={lineIndex} style={styles.tooltipLine}>
          {renderedLine}
        </View>
      );
    });
  };

  return (
    <View style={styles.enhancedTooltipContainer}>{renderTooltip()}</View>
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
          skillLevels[selectedSpell.key],
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
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 2,
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
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  selectedSkill: {
    borderColor: COLORS.secondary,
    borderWidth: 3,
    shadowColor: COLORS.secondary,
    shadowRadius: 8,
    shadowOpacity: 0.7,
  },
  skillImage: { width: "100%", height: "100%" },
  levelIndicator: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "rgba(0,0,0,0.9)",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  levelText: { color: "white", fontWeight: "bold", fontSize: 12 },
  levelUpButton: { marginTop: 4 },
  detailsContainer: {
    alignItems: "center",
    gap: 16,
    padding: 16,
    marginTop: 20,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 12,
  },
  spellHeader: {
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  spellName: {
    fontSize: 24,
    color: TEXT_COLORS.secondary,
    fontWeight: "bold",
    textAlign: "center",
  },
  spellLevel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    opacity: 0.8,
  },
  videoPlayer: { width: "100%", height: 200, marginTop: 8, borderRadius: 12 },
  upgradeIndicator: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  // Enhanced Tooltip Styles
  enhancedTooltipContainer: {
    width: "100%",
  },
  tooltipLine: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
    alignItems: "center",
  },
  tooltipText: {
    color: "#d1d5db",
    fontSize: 15,
    lineHeight: 24,
  },
  lineBreak: {
    height: 1,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginVertical: 10,
  },
  highlightContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginHorizontal: 2,
  },
  iconText: {
    fontSize: 14,
    marginLeft: 3,
  },
  highlightedText: {
    fontWeight: "500",
  },
  magicHighlight: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
  },
  magicHighlightText: {
    color: "#c084fc",
  },
  shieldHighlight: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  shieldHighlightText: {
    color: "#34d399",
  },
  speedHighlight: {
    backgroundColor: "rgba(6, 182, 212, 0.2)",
  },
  speedHighlightText: {
    color: "#22d3ee",
  },
  attackSpeedHighlight: {
    backgroundColor: "rgba(245, 158, 11, 0.2)",
  },
  attackSpeedHighlightText: {
    color: "#f59e0b",
  },
  apHighlight: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
  },
  apHighlightText: {
    color: "#c084fc",
  },
  highlightedNumber: {
    fontWeight: "bold",
    fontSize: 16,
  },
  percentageNumber: {
    color: "#c084fc",
  },
  durationNumber: {
    color: "#60a5fa",
  },
});
