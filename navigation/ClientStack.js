import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/cliente/HomeScreen';
import SearchScreen from '../screens/cliente/SearchScreen';
import ProfileScreen from '../screens/cliente/ProfileScreen';
import ResultScreen from '../screens/cliente/ResultScreen';

const Stack = createNativeStackNavigator();

function ClientSatck() {
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='Search'
        component={SearchScreen}
        options={{
          title: '',
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          title: '',
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name='Result'
        component={ResultScreen}
        options={{
          title: '',
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default ClientSatck;
