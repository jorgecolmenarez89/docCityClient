import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import CargaListScreen from '../screens/cliente/CargaListScreen';
import CargaAddScreen from '../screens/cliente/CargaAddScreen';

const Stack = createNativeStackNavigator();

function CargaSatck() {
  return (
    <Stack.Navigator initialRouteName='CargaList'>
      <Stack.Screen
        name='CargaList'
        component={CargaListScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='CargaAdd'
        component={CargaAddScreen}
        options={{
          title: '',
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default CargaSatck;
