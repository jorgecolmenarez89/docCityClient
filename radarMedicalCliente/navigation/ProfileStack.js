import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import ProfileScreen from '../screens/cliente/ProfileScreen';
import ProfileNewScreen from '../screens/cliente/ProfileNewScreen';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <Stack.Navigator>
				<Stack.Screen
          name="ProfileNewS"
          component={ProfileNewScreen}
          options={{
            title: "Mis Perfil",
            headerShown: false,
          }}
        />
				<Stack.Screen
          name="ProfileS"
          component={ProfileScreen}
          options={{
            title: "Mis Perfil",
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default ProfileStack;

