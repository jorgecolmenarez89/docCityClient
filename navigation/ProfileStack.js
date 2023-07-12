import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View} from 'react-native';
import ProfileScreen from '../screens/cliente/ProfileScreen';
import ProfileNewScreen from '../screens/cliente/ProfileNewScreen';
import VacunasScreen from '../screens/cliente/VacunasScreen';
import ConsultasScreen from '../screens/cliente/ConsultasScreen';
import InstrumentosScreen from '../screens/cliente/InstrumentosScreen';
import ConsultasDetailScreen from '../screens/cliente/ConsultasDetailScreen';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <View style={{flex: 1}} collapsable={false}>
      <Stack.Navigator>
        <Stack.Screen
          name='ProfileNewS'
          component={ProfileNewScreen}
          options={{
            title: 'Mis Perfil',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='ProfileEditS'
          component={ProfileScreen}
          options={{
            title: 'Mis Perfil',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='ConsultasS'
          component={ConsultasScreen}
          options={{
            title: 'Mis Consultas',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='ConsultasDeatilS'
          initialParams={{id: null}}
          component={ConsultasDetailScreen}
          options={{
            title: 'Detalle de Consulta',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='VacunasS'
          component={VacunasScreen}
          options={{
            title: 'Mis Vacunas',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='InstrumentosS'
          component={InstrumentosScreen}
          options={{
            title: 'Istrumentos de Pago',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default ProfileStack;
