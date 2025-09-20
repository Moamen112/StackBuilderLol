import {
  View,
  Text,
  StyleSheet,
  Image,
  DevSettings,
  Pressable,
} from "react-native";
import React, { useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Champions from "../screens/Champions";
import ChampionDetailsScreen from "../screens/ChampionDetailsScreen";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import * as Updates from "expo-updates";
import { COLORS } from "../constants/Colors";
import ItemsScreen from "../screens/ItemsScreen";
import ItemDetailsScreen from "../screens/ItemDetailsScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { useDispatch, useSelector } from "react-redux";
import {
  initializeAuth,
  logout,
  logoutThunk,
} from "../redux/features/auth/authSlice";
import { UserCircleIcon } from "react-native-heroicons/outline";
import ChampionStatsScreen from "../screens/ChampionStatsScreen";
import BuilderListScreen from "../screens/BuilderListScreen";
import BuilderScreen from "../screens/BuilderScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const ChampionStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Champions" component={Champions} />
      <Stack.Screen name="ChampionDetails" component={ChampionDetailsScreen} />
      <Stack.Screen name="ChampionStats" component={ChampionStatsScreen} />
    </Stack.Navigator>
  );
};

const ItemStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Items" component={ItemsScreen} />
      <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
    </Stack.Navigator>
  );
};

const BuilderStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BuilderList" component={BuilderListScreen} />
      <Stack.Screen name="Builder" component={BuilderScreen} />
      <Stack.Screen name="Champions" component={Champions} />
      <Stack.Screen name="ChampionDetails" component={ChampionDetailsScreen} />
      <Stack.Screen name="ChampionStats" component={ChampionStatsScreen} />
    </Stack.Navigator>
  );
};

function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { status, user, refreshToken, error } = useSelector(
    (state) => state.auth
  );
  const logoutHandler = async () => {
    dispatch(logoutThunk()).then(async (result) => {
      if (result.meta.requestStatus === "fulfilled") {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "ChampionsDrawer" }],
          })
        );
      }
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {/* Other drawer items will appear here */}
      </DrawerContentScrollView>

      {/* Bottom items */}
      <View style={styles.bottomContainer}>
        {user ? (
          <>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 8,
                paddingVertical: 8,
                gap: 0,
              }}
              onPress={() => props.navigation.navigate("Settings")}
            >
              {user.profilePicture ? (
                <Image
                  source={{ uri: user.profilePicture }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    marginRight: 8,
                  }}
                />
              ) : (
                <UserCircleIcon
                  color={COLORS.textSecondary}
                  size={35}
                  strokeWidth={2}
                  style={{ marginRight: 8 }}
                />
              )}
              <Text
                style={{
                  color: COLORS.textSecondary,
                  fontSize: 16,
                  flex: 1,
                }}
              >
                {user.displayName || "No Name"}
              </Text>
            </Pressable>
            <DrawerItem
              label={"Logout"}
              activeBackgroundColor={COLORS.backgroundSecondary}
              activeTintColor={COLORS.textSecondary}
              inactiveTintColor={COLORS.textWhite}
              onPress={logoutHandler}
            />
          </>
        ) : (
          <DrawerItem
            label={"Login"}
            activeBackgroundColor={COLORS.backgroundSecondary}
            activeTintColor={COLORS.textSecondary}
            inactiveTintColor={COLORS.textWhite}
            onPress={() => props.navigation.navigate("Login")}
          />
        )}
      </View>
    </View>
  );
}

export default function AppNavigation() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerStyle: { backgroundColor: COLORS.backgroundOverlay },
          drawerActiveTintColor: COLORS.textSecondary,
          drawerActiveBackgroundColor: COLORS.backgroundSecondary,
          drawerInactiveTintColor: COLORS.textWhite,
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="ChampionsDrawer"
          options={{ title: "Champions" }}
          component={ChampionStack}
        />
        <Drawer.Screen
          name="ItemsDrawer"
          options={{ title: "Items" }}
          component={ItemStack}
        />
        <Drawer.Screen
          name="Builder"
          options={{ title: "Builder" }}
          component={BuilderStack}
        />
        <Drawer.Screen
          name="Login"
          options={{
            title: "Login",
            drawerItemStyle: { display: "none" },
          }}
          component={LoginScreen}
        />
        <Drawer.Screen
          name="Registration"
          options={{
            title: "Signup",
            drawerItemStyle: { display: "none" },
          }}
          component={RegisterScreen}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
});
