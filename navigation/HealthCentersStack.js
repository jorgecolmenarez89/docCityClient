import React from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HealthCentersScreen from '../screens/doctor/HealthCentersScreen';
import AddHealthCenterScreen from '../screens/doctor/AddHealthCenterScreen';

const Stack = createNativeStackNavigator();

const HealthCentersStack = () => {
  return (
    <View style={{flex: 1}} collapsable={false}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name='healthCenters'
          component={HealthCentersScreen}
          options={{
            title: 'Cntros de Salud',
            headerStyle: {
              backgroundColor: '#66bfc5',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name='edithealthcenter'
          component={AddHealthCenterScreen}
          initialParams={{item: null}}
          options={{
            title: 'Guardar Centro de Salud',
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

export default HealthCentersStack;
