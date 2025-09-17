import { View, Text } from "react-native";
import { COLORS } from "../../constants/Colors";
import { Bars3Icon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";

export default function DrawerHeader() {
  const navigation = useNavigation();
  return (
    <View className="flex-row justify-between">
      <Bars3Icon
        color={COLORS.secondary}
        size={32}
        strokeWidth={2}
        onPress={() => navigation.openDrawer()}
      />
      <Text className="text-3xl" style={{ color: COLORS.textWhite }}>
        StatCraft
        <Text className="text-lg" style={{ color: COLORS.secondary }}>
          Lol
        </Text>
      </Text>
    </View>
  );
}
