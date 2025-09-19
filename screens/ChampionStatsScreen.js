import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/Colors";
import ChampionSkills from "../components/ChampionSkills";
import ChampionStats from "../components/ChampionStats";
import ChampionInfo from "../components/ChampionInfo";
import LevelManager from "../components/LevelManager";
import { getChampion } from "../services/api";

const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";
const topMargin = ios ? "" : "mt-3";

export default function ChampionStatsScreen({ route }) {
  const { params: champion } = route;
  const navigation = useNavigation();

  const [level, setLevel] = useState(1);
  const [skillLevels, setSkillLevels] = useState({ Q: 0, W: 0, E: 0, R: 0 });
  const [stats, setStats] = useState(champion.stats);
  const [abilities, setAbilities] = useState(null);
  const [selectedSpell, setSelectedSpell] = useState(null);

  const totalSkillPointsSpent = Object.values(skillLevels).reduce(
    (a, b) => a + b,
    0
  );
  const availableSkillPoints = level - totalSkillPointsSpent;

  useEffect(() => {
    const baseStats = champion.stats;
    const levelIndex = level - 1;

    const calculatedStats = {
      ...baseStats,
      hp: Math.round(baseStats.hp + baseStats.hpperlevel * levelIndex),
      mp: Math.round(baseStats.mp + baseStats.mpperlevel * levelIndex),
      armor: Math.round(baseStats.armor + baseStats.armorperlevel * levelIndex),
      spellblock: Math.round(
        baseStats.spellblock + baseStats.spellblockperlevel * levelIndex
      ),
      attackdamage: Math.round(
        baseStats.attackdamage + baseStats.attackdamageperlevel * levelIndex
      ),
      attackspeed:
        Math.round(
          baseStats.attackspeed *
            (1 + (baseStats.attackspeedperlevel / 100) * levelIndex) *
            1000
        ) / 1000,
    };
    setStats(calculatedStats);
  }, [level, champion.stats]);

  useEffect(() => {
    if (champion && champion.spells && !selectedSpell) {
      setSelectedSpell({ ...champion.spells[0], key: "Q" });
    }
  }, [champion, selectedSpell]);

  useEffect(() => {
    const fetchChampion = async () => {
      try {
        const championData = await getChampion(champion.id); // API call
        setAbilities(championData.spells);
      } catch (error) {
        console.error("Failed to fetch champion:", error);
      }
    };
    fetchChampion();
  }, [champion]);

  const handleLevelUp = () => {
    if (level < 18) {
      setLevel(level + 1);
    }
  };

  const handleLevelDown = () => {
    if (level <= 1) return;

    // Prevent de-leveling if it would invalidate ultimate skill points
    if (
      (level === 16 && skillLevels.R === 3) ||
      (level === 11 && skillLevels.R === 2) ||
      (level === 6 && skillLevels.R === 1)
    ) {
      Alert.alert(
        "Invalid Action",
        "Cannot level down as it would invalidate your ultimate skill level."
      );
      return;
    }

    // Prevent de-leveling if it would cause a skill point deficit
    if (level - 1 < totalSkillPointsSpent) {
      Alert.alert(
        "Invalid Action",
        "Reset skill points before leveling down further."
      );
      return;
    }

    setLevel(level - 1);
  };

  const handleSkillLevelUp = (skill) => {
    if (availableSkillPoints <= 0) {
      Alert.alert("No Skill Points", "You have no skill points to spend.");
      return;
    }

    const currentSkillLevel = skillLevels[skill];
    const isUltimate = skill === "R";
    const maxSkillLevel = isUltimate ? 3 : 5;

    if (currentSkillLevel >= maxSkillLevel) {
      Alert.alert("Max Level", "This skill is already at its maximum level.");
      return;
    }

    if (isUltimate) {
      const requiredLevel = 6 + currentSkillLevel * 5; // 6, 11, 16
      if (level < requiredLevel) {
        Alert.alert(
          "Level Required",
          `You must be level ${requiredLevel} to level up your ultimate.`
        );
        return;
      }
    }

    setSkillLevels((prev) => ({ ...prev, [skill]: prev[skill] + 1 }));
  };

  const handleSpellSelect = (spell, key) => {
    setSelectedSpell({ ...spell, key });
  };

  const damageComponent =
    abilities && selectedSpell
      ? abilities.find((ability) => ability.id === selectedSpell.id)
      : null;

  const passiveComponent = abilities
    ? abilities.find((ability) => ability.key === "P")
    : null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ paddingBottom: 50 }}
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
      </SafeAreaView>
      <View style={{ marginTop: height * 0.12 }}>
        <Text
          className="text-center text-3xl font-bold tracking-wider uppercase"
          style={{ color: COLORS.secondary }}
        >
          {champion?.title}
        </Text>
        <Text className="text-center text-5xl font-bold tracking-wider text-white mb-6">
          {champion?.name}
        </Text>
        <LevelManager
          level={level}
          skillPoints={availableSkillPoints}
          onLevelUp={handleLevelUp}
          onLevelDown={handleLevelDown}
        />
        <ChampionInfo tags={champion.tags} info={champion.info} />
        <ChampionStats stats={stats} />
      </View>
      <View
        className="mx-6 my-6 h-px rounded-full"
        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      ></View>
      <ChampionSkills
        champion={champion}
        skillLevels={skillLevels}
        onSkillLevelUp={handleSkillLevelUp}
        isInteractive={true}
        level={level}
        availableSkillPoints={availableSkillPoints}
        stats={stats}
        selectedSpell={selectedSpell}
        onSpellSelect={handleSpellSelect}
        damageComponent={damageComponent}
        passiveComponent={passiveComponent}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
