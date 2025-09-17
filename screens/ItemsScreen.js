import { View, Text } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DrawerHeader from "../components/UI/DrawerHeader";
import { COLORS } from "../constants/Colors";
import Filters from "../components/Filters";
import Itemslist from "../components/Itemslist";
import { fetchItems } from "../championsdb/championsdb";

const itemClasses = [
  { name: "All", key: "All" },
  { name: "Ability Power", key: "SpellDamage" },
  { name: "Atack Damage", key: "Damage" },
  { name: "Attack Speed", key: "AttackSpeed" },
  { name: "On-Hit Effect", key: "OnHit" },
  { name: "Armor Penetration", key: "ArmorPenetration" },
  { name: "Mana", key: "Mana" },
  { name: "Mana Regeneration", key: "ManaRegen" },
  { name: "Magic Penetration", key: "MagicPenetration" },
  { name: "Health", key: "Health" },
  { name: "Health Regeneration", key: "HealthRegen" },
  { name: "Armor", key: "Armor" },
  { name: "Magic Resist", key: "MagicResist" },
  { name: "Ability Haste", key: "AbilityHaste" },
  { name: "Movement", key: "NonbootsMovement" },
  { name: "Boots", key: "Boots" },
  { name: "Life Steal", key: "LifeSteal" },
  { name: "Omni Vamp", key: "SpellVamp" },
];

export default function ItemsScreen() {
  const [searchedValue, setSearchedValue] = useState();
  const [selectedClass, setSelectedClass] = useState("All");
  const [items, setItems] = useState([]);
  const [itemsFiltered, setItemsFiltered] = useState([]);

  useLayoutEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    const response = await fetchItems();
    if (response && response.data) {
      const itemDataObject = response.data;
      const itemsArray = Object.keys(itemDataObject).map((key) => {
        const item = itemDataObject[key];

        return {
          id:key,
          ...item,
        };
      });
      const validItems = itemsArray.filter(
        (item) => item.maps["30"] || item.maps["11"] || item.maps["12"]
      );

      setItems(validItems);
      setItemsFiltered(validItems);
    }
  };

  useEffect(() => {
    let filtered = [...items];

    if (selectedClass !== "All") {
      filtered = filtered.filter((item) => item.tags.includes(selectedClass));
    }

    if (searchedValue) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchedValue.toLowerCase())
      );
    }

    setItemsFiltered(filtered);
  }, [selectedClass, searchedValue, items]);

  return (
    <View
      className="flex-1 px-8 py-10"
      style={{ backgroundColor: COLORS.background }}
    >
      <SafeAreaView className="gap-y-5 flex-1">
        <DrawerHeader />
        <Filters
          onSearch={setSearchedValue}
          onFilterChange={setSelectedClass}
          searchedValue={searchedValue}
          selectedClass={selectedClass}
          filterOptions={itemClasses}
          searchInputPlaceholder="Enter Item Name"
        />
        <Itemslist items={itemsFiltered} />
      </SafeAreaView>
    </View>
  );
}
