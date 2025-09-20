import React, { useState, useEffect } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { fetchItems } from '../championsdb/championsdb';
import { itemImage } from '../championsdb/championsdb';
import { COLORS } from '../constants/Colors';
import { XMarkIcon } from 'react-native-heroicons/solid';

export default function ItemSelectModal({ visible, onClose, onSelect }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (visible) {
      const getItems = async () => {
        try {
          const response = await fetchItems();
          const itemsArray = Object.keys(response.data).map(key => ({
            id: key,
            ...response.data[key]
          }));
          setItems(itemsArray);
        } catch (error) {
          console.error('Failed to fetch items:', error);
        }
      };
      getItems();
    }
  }, [visible]);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) && !item.inStore === false
  );

  const handleSelectItem = (item) => {
    onSelect(item);
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
            <Text style={styles.title}>Select an Item</Text>
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
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => handleSelectItem(item)}>
                <Image source={{ uri: itemImage(item.id) }} style={styles.itemImage} />
                <Text style={styles.itemName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            numColumns={4}
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
        width: '95%',
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
      item: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 20,
      },
      itemImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
      },
      itemName: {
        color: 'white',
        marginTop: 8,
        textAlign: 'center',
        fontSize: 12,
      },
});
