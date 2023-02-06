import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SCREEN } from "../enums/AppEnums";
import FlashMessage from "react-native-flash-message";
import Home from "../screens/home";
import SignIn from "../screens/signIn"
import SignUp from "../screens/signUp"
import Welcome from "../screens/welcome";
import { AuthContext } from "../contexts/authContext";
import ImportContacts from "../screens/importContacts";
import Menu from "../screens/menu";
import Profile from "../screens/profile";
import FriendsProfile from "../screens/friendsProfile";
import Friends from "../screens/friends";


const Stack = createNativeStackNavigator();

const screenOptionStyle = {
  headerShown: false,
  // animation: 'slide_from_right'
};

const MainStackNavigator = () => {
  const { user } = useContext(AuthContext)

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptionStyle}>
        {
          user?.uid ?
            <>
              <Stack.Screen name={SCREEN.HOME} component={Home} />
              <Stack.Screen name={SCREEN.MENU} component={Menu} />
              <Stack.Screen name={SCREEN.IMPORT_CONTACTS} component={ImportContacts} />
              <Stack.Screen name={SCREEN.PROFILE} component={Profile} />
              <Stack.Screen name={SCREEN.FRIENDS_PROFILE} component={FriendsProfile} />
              <Stack.Screen name={SCREEN.FRIENDS} component={Friends} />
            </>
            : <>
              <Stack.Screen name={SCREEN.WELCOME} component={Welcome} />
              <Stack.Screen name={SCREEN.LOGIN} component={SignIn} />
              <Stack.Screen name={SCREEN.REGISTER} component={SignUp} />
            </>
        }

      </Stack.Navigator>
      <FlashMessage position='top' />
    </NavigationContainer>
  );
};

export { MainStackNavigator };
