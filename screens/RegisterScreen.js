import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/Colors";
import Button from "../components/UI/Button";
import { Bars3Icon } from "react-native-heroicons/solid";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  loginThunk,
  registerThunk,
  resetError,
} from "../redux/features/auth/authSlice";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LabeledInput from "../components/UI/LabeledInput";

export default function RegisterScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity
  const moveAnim = useRef(new Animated.Value(0)).current; // For vertical movement
  const navigation = useNavigation();
  const [signUpForm, setSignUpForm] = useState({ username: "", password: "" });
  const textChangeHandler = (inputName, enteredValue) => {
    setSignUpForm((prevValues) => {
      return {
        ...prevValues,
        [inputName]: enteredValue,
      };
    });
  };

  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const handleSignUp = () => {
    dispatch(resetError());
    dispatch(
      registerThunk({
        username: signUpForm.username,
        password: signUpForm.password,
        displayName: signUpForm.displayName,
        email: signUpForm.email,
      })
    ).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        navigation.navigate("ChampionsDrawer");
      }
    });
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();

    let direction = 1;
    const animate = () => {
      Animated.timing(moveAnim, {
        toValue: direction * 5,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        direction *= -1;
        animate();
      });
    };
    animate();
  }, [fadeAnim, moveAnim]);
  return (
    <KeyboardAwareScrollView
      className=" px-8  flex-1 "
      style={{ backgroundColor: COLORS.background }}
      contentContainerStyle={{
        justifyContent: "center",
        paddingBottom: 15,
      }}
      enableOnAndroid={true}
      extraHeight={150} // Adjust if needed — gives extra space above keyboard
      keyboardShouldPersistTaps="handled" // Allows tapping buttons while keyboard is open
    >
      <SafeAreaView>
        <View className="flex-row justify-between pt-5">
          <TouchableOpacity
            onPress={() => navigation.navigate("ChampionsDrawer")}
            style={{ backgroundColor: COLORS.secondary }}
            className="rounded-xl p-1 "
          >
            <ChevronLeftIcon size="28" strokeWidth={2.5} color="black" />
          </TouchableOpacity>
          <Text className="text-3xl" style={{ color: COLORS.textWhite }}>
            StatCraft
            <Text className="text-lg" style={{ color: COLORS.secondary }}>
              Lol
            </Text>
          </Text>
        </View>
        <View className="items-center justify-center pt-5">
          <Animated.Image
            source={require("../assets/images/crystal2.png")}
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: moveAnim }],
            }}
          />
        </View>
        <View className="gap-y-6 pt-10 ">
          <Text className="text-white text-center text-3xl">Signup</Text>
          <LabeledInput
            label="Username"
            name="username"
            value={signUpForm.username}
            onChangeText={textChangeHandler}
          />
          <LabeledInput
            label="Display name"
            name="displayName"
            value={signUpForm.displayName}
            onChangeText={textChangeHandler}
          />
          <LabeledInput
            label="Email"
            name="email"
            value={signUpForm.email}
            onChangeText={textChangeHandler}
          />
          <LabeledInput
            label="Password"
            name="password"
            value={signUpForm.password}
            onChangeText={textChangeHandler}
            secureTextEntry={true}
          />
        </View>
        <Button
          containerStyle={styles.buttonStyle}
          textStyle={{ color: "white" }}
          onPress={handleSignUp}
        >
          Signup
        </Button>

        <View className="flex-row justify-center items-center  pt-4">
          <Text className="text-center text-white">Have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: COLORS.textSecondary }}> Login now.</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    minWidth: 120,
  },
});
