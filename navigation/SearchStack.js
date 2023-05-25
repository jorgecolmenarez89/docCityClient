import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View} from 'react-native';
import SearchScreen from '../screens/cliente/SearchScreen';
import ResultScreen from '../screens/cliente/ResultScreen';

const Stack = createNativeStackNavigator();

const SearchStack = () => {
  return (
    <View style={{flex: 1}} collapsable={false}>
      <Stack.Navigator>
        <Stack.Screen
          name='SerachS'
          component={SearchScreen}
          options={{
            title: 'Mis Tarjetas',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='ResultS'
          component={ResultScreen}
          initialParams={{results: [], especialidades: []}}
          options={{
            title: 'Nueva Recarga',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default SearchStack;
