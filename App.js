import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { COLORS, PRIMARY_COLORS, TEXT_COLORS } from "./constants/Colors";
import "./global.css";
import AppNavigation from "./navigations/AppNavigation";
import { Provider } from "react-redux";
import { store } from "./redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <View
        className="flex-1 item-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <AppNavigation />
      </View>
    </Provider>
  );
}
