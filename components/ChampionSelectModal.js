import React, { useState, useEffect } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { fetchAllChampions } from '../championsdb/championsdb';
import { COLORS } from '../constants/Colors';
import { XMarkIcon } from 'react-native-heroicons/solid';

export default function ChampionSelectModal({ visible, onClose, onSelect }) {
  const [champions, setChampions] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (visible) {
      const fetchChampions = async () => {
        try {
          const response = await fetchAllChampions();
          const championDataObject = response.data;
          const championsArray = Object.keys(championDataObject).map((key) => {
            const champ = championDataObject[key];
            return {
              id: champ.id,
              name: champ.name,
              tags: champ.tags,
              difficulty: champ.info.difficulty,
              stats: champ.stats, // Make sure to pass the stats
            };
          });
          setChampions(championsArray);
        } catch (error) {
          console.error('Failed to fetch champions:', error);
        }
      };
      fetchChampions();
    }
  }, [visible]);

  const filteredChampions = champions.filter(champ =>
    champ.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectChampion = (champion) => {
    onSelect(champion);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Select a Champion</Text>
            <TouchableOpacity onPress={onClose}>
              <XMarkIcon size={24} color="white" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="gray"
            value={search}
            onChangeText={setSearch}
          />
          <FlatList
            data={filteredChampions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.championItem} onPress={() => handleSelectChampion(item)}>
                <Image
                  source={{ uri: `http://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/${item.id}.png` }}
                  style={styles.championImage}
                />
                <Text style={styles.championName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            numColumns={3}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  searchInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  championItem: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  championImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  championName: {
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
  },
});
