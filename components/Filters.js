import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { COLORS } from "../constants/Colors";
import Button from "./UI/Button";

export default function Filters({
  onSearch,
  onFilterChange,
  searchedValue,
  selectedClass,
  filterOptions,
  searchInputPlaceholder,
  noFilter,
}) {
  return (
    <>
      <TextInput
        className="w-full h-12 rounded-lg px-4"
        style={styles.input}
        placeholder={searchInputPlaceholder || "Search..."}
        placeholderTextColor={COLORS.textTertiary}
        onChangeText={onSearch}
        value={searchedValue}
      />
      {!noFilter && (
        <View className="w-full h-10" style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            {filterOptions.map((option) => {
              const isObject = typeof option === "object";
              const key = isObject ? option.key : option;
              const name = isObject ? option.name : option;
              const isSelected = selectedClass === key;

              return (
                <View
                  key={key}
                  className="w-5"
                  style={[
                    styles.buttonStyle,
                    isSelected && styles.selectedButton,
                  ]}
                >
                  <Button
                    textStyle={[
                      styles.buttonText,
                      isSelected && styles.selectedButtonText,
                    ]}
                    pressedStyle={styles.buttonPressed}
                    onPress={() => onFilterChange(key)}
                  >
                    {name}
                  </Button>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
  },
  filterContainer: {
    backgroundColor: COLORS.backgroundCard,
  },
  scrollViewContent: {
    alignItems: "center",
    gap: 8,
  },
  buttonStyle: {
    width: 130,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  buttonText: {
    color: COLORS.textSecondary,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
  },
  selectedButtonText: {
    color: COLORS.textWhite,
    fontWeight: "bold",
  },
});
