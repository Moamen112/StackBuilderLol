import { View, StyleSheet } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { COLORS } from "../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import ChampionsList from "../components/ChampionsList";
import { fetchAllChampions } from "../championsdb/championsdb";
import DrawerHeader from "../components/UI/DrawerHeader";
import Filters from "../components/Filters";

const championClasses = [
  "All",
  "Fighter",
  "Mage",
  "Assassin",
  "Tank",
  "Marksman",
  "Support",
];

export default function Champions() {
  const [searchedValue, setSearchedValue] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [champions, setChampions] = useState([]);
  const [championsFiltered, setChampionsFiltered] = useState([]);

  useLayoutEffect(() => {
    const getChampions = async () => {
      const response = await fetchAllChampions();
      const championDataObject = response.data;

      const championsArray = Object.keys(championDataObject).map((key) => {
        const champ = championDataObject[key];
        return {
          id: champ.id,
          name: champ.name,
          tags: champ.tags,
          difficulty: champ.info.difficulty,
        };
      });

      setChampions(championsArray);
      setChampionsFiltered(championsArray);
    };

    getChampions();
  }, []);

  useEffect(() => {
    let filtered = [...champions];

    if (selectedClass !== "All") {
      filtered = filtered.filter((champ) => champ.tags.includes(selectedClass));
    }

    if (searchedValue) {
      filtered = filtered.filter((champ) =>
        champ.name.toLowerCase().includes(searchedValue.toLowerCase())
      );
    }

    setChampionsFiltered(filtered);
  }, [selectedClass, searchedValue, champions]);

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
          filterOptions={championClasses}
          searchInputPlaceholder="Enter your champion name"
        />
        <ChampionsList champions={championsFiltered} />
      </SafeAreaView>
    </View>
  );
}
