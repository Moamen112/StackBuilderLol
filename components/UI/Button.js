import { View, Text, Pressable } from "react-native";
import React from "react";
import { COLORS } from "../../constants/Colors";

export default function Button({
  children,
  pressedStyle,
  containerStyle,
  onPress,
  textStyle,
}) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={[containerStyle, pressed && pressedStyle]}>
          <Text style={[textStyle, pressed && { opacity: 0.5 }]}>
            {children}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
