import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeftIcon, UserPlusIcon } from 'react-native-heroicons/outline';
import { COLORS } from '../constants/Colors';
import LevelManager from '../components/LevelManager';
import ChampionStats from '../components/ChampionStats';
import ChampionSkills from '../components/ChampionSkills';
import ChampionSelectModal from '../components/ChampionSelectModal';
import ItemSelectModal from '../components/ItemSelectModal';
import { itemImage } from '../championsdb/championsdb';
import { getChampion } from '../services/api';

// This will be the main screen for creating and editing a build.
export default function BuilderScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // State for the builder
  const [champion, setChampion] = useState(null);
  const [level, setLevel] = useState(1);
  const [skillLevels, setSkillLevels] = useState({ Q: 0, W: 0, E: 0, R: 0 });
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [isChampionModalVisible, setChampionModalVisible] = useState(false);
  const [isItemModalVisible, setItemModalVisible] = useState(false);
  const [abilities, setAbilities] = useState(null);
  const [selectedSpell, setSelectedSpell] = useState(null);

  useEffect(() => {
    if (champion && champion.spells && !selectedSpell) {
      setSelectedSpell({ ...champion.spells[0], key: "Q" });
      setAbilities(champion.spells);
    }
  }, [champion, selectedSpell]);

  const handleSelectChampion = () => {
    setChampionModalVisible(true);
  };

  const handleChampionSelected = async (selectedChampion) => {
    try {
      const detailedData = await getChampion(selectedChampion.id);
      const fullChampionData = { ...selectedChampion, ...detailedData };
      setChampion(fullChampionData);
      setStats(fullChampionData.stats);
      setChampionModalVisible(false);
    } catch (error) {
      console.error("Failed to fetch champion details:", error);
      // Optionally, handle the error (e.g., show a message to the user)
    }
  };

  const handleSelectItem = () => {
    if (items.length < 6) {
      setItemModalVisible(true);
    }
  };

  const handleItemSelected = (item) => {
    setItems([...items, item]);
    setItemModalVisible(false);
  };

  const handleSpellSelect = (spell, key) => {
    setSelectedSpell({ ...spell, key });
  };

  const totalSkillPointsSpent = Object.values(skillLevels).reduce(
    (a, b) => a + b,
    0
  );
  const availableSkillPoints = level - totalSkillPointsSpent;

  const handleSkillLevelUp = (skill) => {
    if (availableSkillPoints <= 0) {
      return;
    }
    const currentSkillLevel = skillLevels[skill];
    const isUltimate = skill === "R";
    const maxSkillLevel = isUltimate ? 3 : 5;

    if (currentSkillLevel >= maxSkillLevel) {
      return;
    }
    if (isUltimate) {
      const requiredLevel = 6 + currentSkillLevel * 5; // 6, 11, 16
      if (level < requiredLevel) {
        return;
      }
    }
    setSkillLevels((prev) => ({ ...prev, [skill]: prev[skill] + 1 }));
  };

  const damageComponent =
    abilities && selectedSpell
      ? abilities.find((ability) => ability.id === selectedSpell.id)
      : null;

  const passiveComponent = abilities
    ? abilities.find((ability) => ability.key === "P")
    : null;

  // Stat calculation logic
  useEffect(() => {
    if (!champion) return;

    const baseStats = champion.stats;
    const levelIndex = level - 1;
    let calculatedStats = {
      ...baseStats,
      hp: Math.round(baseStats.hp + baseStats.hpperlevel * levelIndex),
      mp: Math.round(baseStats.mp + baseStats.mpperlevel * levelIndex),
      armor: Math.round(baseStats.armor + baseStats.armorperlevel * levelIndex),
      spellblock: Math.round(baseStats.spellblock + baseStats.spellblockperlevel * levelIndex),
      attackdamage: Math.round(baseStats.attackdamage + baseStats.attackdamageperlevel * levelIndex),
      attackspeed: parseFloat((baseStats.attackspeed * (1 + (baseStats.attackspeedperlevel / 100) * levelIndex)).toFixed(3)),
    };

    // Add item stats
    items.forEach(item => {
        const itemStats = item.stats;
        for (const stat in itemStats) {
            const key = stat.toLowerCase().replace('mod', '').replace('flat', '');
            if (calculatedStats[key]) {
                calculatedStats[key] += itemStats[stat];
            }
        }
    });

    setStats(calculatedStats);
  }, [level, champion, items]);

  // Render placeholder for selecting a champion
  if (!champion) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
        </TouchableOpacity>
        <View style={styles.centered}>
          <TouchableOpacity style={styles.selectChampionButton} onPress={handleSelectChampion}>
            <UserPlusIcon size={60} color={COLORS.secondary} />
            <Text style={styles.selectChampionText}>Select a Champion</Text>
          </TouchableOpacity>
        </View>
        <ChampionSelectModal
          visible={isChampionModalVisible}
          onClose={() => setChampionModalVisible(false)}
          onSelect={handleChampionSelected}
        />
      </SafeAreaView>
    );
  }

  // Main builder view once a champion is selected
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonAbsolute}>
          <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
        </TouchableOpacity>
        <View style={styles.championHeader}>
          <Image source={{ uri: `http://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/${champion.id}.png` }} style={styles.championImage} />
          <Text style={styles.championName}>{champion.name}</Text>
          <Text style={styles.championTitle}>{champion.title}</Text>
        </View>

        {/* Re-usable components */}
        <LevelManager
          level={level}
          skillPoints={level - Object.values(skillLevels).reduce((a, b) => a + b, 0)}
          onLevelUp={() => setLevel(l => Math.min(18, l + 1))}
          onLevelDown={() => setLevel(l => Math.max(1, l - 1))}
        />
        
        {stats && <ChampionStats stats={stats} />}

        {/* Item Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.itemsContainer}>
            {items.map((item, index) => (
              <Image key={index} source={{ uri: itemImage(item.id) }} style={styles.itemImage} />
            ))}
            {items.length < 6 && (
              <TouchableOpacity style={styles.addItemButton} onPress={handleSelectItem}>
                <Text style={styles.addItemText}>+</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
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
        </View>
        <ItemSelectModal
          visible={isItemModalVisible}
          onClose={() => setItemModalVisible(false)}
          onSelect={handleItemSelected}
        />
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 35
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backButtonAbsolute: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 4,
  },
  selectChampionButton: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 20,
  },
  selectChampionText: {
    marginTop: 15,
    color: COLORS.textSecondary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  championHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  championImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.secondary,
  },
  championName: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  championTitle: {
    fontSize: 18,
    color: 'gray',
    textTransform: 'capitalize',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginLeft: 24,
    marginBottom: 10,
  },
});
