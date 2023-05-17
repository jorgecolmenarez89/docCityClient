import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import TriajeScreen from '../screens/cliente/TriajeScreen';


const Stack = createNativeStackNavigator();

const TriajeStack = () => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <Stack.Navigator>
        <Stack.Screen
          name="TriajeS"
          component={TriajeScreen}
          options={{
            title: "Bienvenido",
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default TriajeStack;
