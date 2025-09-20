import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlusIcon } from 'react-native-heroicons/solid';
import DrawerHeader from '../components/UI/DrawerHeader';

// Mock data for builds - replace with real data later
const mockBuilds = [
  {
    id: '1',
    championName: 'Sylas',
    buildTitle: 'AP Bruiser Sylas',
    championImage: 'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/Sylas.png',
    lastUpdated: '2 days ago',
    items: [
      'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/item/3020.png',
      'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/item/3157.png',
      'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/item/3089.png',
      'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/item/3116.png',
      'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/item/3135.png',
      'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/item/3001.png',
    ],
  },
  {
    id: '2',
    championName: 'Jhin',
    buildTitle: 'Crit Jhin',
    championImage: 'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/Jhin.png',
    lastUpdated: '1 week ago',
    items: [
        'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/item/3031.png',
        'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/item/3095.png',
        'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/item/3033.png',
        'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/item/3072.png',
        'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/item/3006.png',
        'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/item/3036.png',
      ],
  },
];

const BuildCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.championImage }} style={styles.championImage} />
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.buildTitle}</Text>
        <Text style={styles.cardSubtitle}>{item.championName}</Text>
        <View style={styles.itemsContainer}>
          {item.items.map((itemUrl, index) => (
            <Image key={index} source={{ uri: itemUrl }} style={styles.itemImage} />
          ))}
        </View>
        <Text style={styles.cardDate}>{item.lastUpdated}</Text>
      </View>
    </TouchableOpacity>
  );

export default function BuilderListScreen() {
  const navigation = useNavigation();

  const handleCreateBuild = () => {
    navigation.navigate('Builder');
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={{padding: 20}}>
            <DrawerHeader />
        </View>
      <View style={styles.header}>
        <Text style={styles.title}>My Builds</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateBuild}>
          <PlusIcon size={24} color={COLORS.textPrimary} />
          <Text style={styles.addButtonText}>New Build</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockBuilds}
        renderItem={({ item }) => <BuildCard item={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No builds yet.</Text>
            <Text style={styles.emptySubText}>Tap 'New Build' to get started!</Text>
          </View>
        }
        contentContainerStyle={styles.listContentContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: COLORS.textSecondary,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.secondary,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 10,
    },
    addButtonText: {
      color: COLORS.textPrimary,
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    listContentContainer: {
      padding: 20,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 100,
    },
    emptyText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: COLORS.textWhite,
    },
    emptySubText: {
      fontSize: 16,
      color: 'gray',
      marginTop: 8,
    },
    card: {
      backgroundColor: COLORS.backgroundCard,
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
    },
    championImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 15,
    },
    cardTextContainer: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.textWhite,
    },
    cardSubtitle: {
      fontSize: 14,
      color: 'gray',
      marginTop: 4,
    },
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 8,
    },
    itemImage: {
      width: 30,
      height: 30,
      borderRadius: 5,
      marginRight: 5,
    },
    cardDate: {
      fontSize: 12,
      color: 'gray',
      marginTop: 8,
      alignSelf: 'flex-end',
    },
  });
  