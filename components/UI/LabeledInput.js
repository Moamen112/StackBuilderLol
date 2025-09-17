import React from "react";
import { View, Text, TextInput } from "react-native";
import { COLORS } from "../../constants/Colors";

const LabeledInput = ({
  label,
  value,
  onChangeText,
  name,
  ...textInputProps
}) => {
  return (
    <View className="gap-y-2">
      <Text className="text-white text-xl text-bold">{label}</Text>
      <TextInput
        name={name}
        value={value}
        onChangeText={(text) => onChangeText(name, text)}
        className="text-white"
        style={{ borderWidth: 2, borderColor: COLORS.border }}
        {...textInputProps}
      />
    </View>
  );
};

export default LabeledInput;
