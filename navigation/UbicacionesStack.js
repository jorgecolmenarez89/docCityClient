import React from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import UbicacionesScreen from '../screens/doctor/UbicacionesScreen';
import AddUbicacionScreen from '../screens/doctor/AddUbicacionScreen';

const Stack = createNativeStackNavigator();

const UbicacionesStack = () => {
  return (
    <View style={{flex: 1}} collapsable={false}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name='ubicaciones'
          component={UbicacionesScreen}
          options={{
            title: 'ubicaciones',
            headerStyle: {
              backgroundColor: '#66bfc5',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name='editubicacion'
          component={AddUbicacionScreen}
          initialParams={{item: null}}
          options={{
            title: 'Guardar ubicación',
            headerStyle: {
              backgroundColor: '#66bfc5',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default UbicacionesStack;
