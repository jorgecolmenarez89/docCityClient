import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View} from 'react-native';
import DashboardScreen from '../screens/cliente/DashboardScreen';
import VacunasScreen from '../screens/cliente/VacunasScreen';
import ConsultasScreen from '../screens/cliente/ConsultasScreen';
import InstrumentosScreen from '../screens/cliente/InstrumentosScreen';
import ConsultasDetailScreen from '../screens/cliente/ConsultasDetailScreen';
import TriajeScreen from '../screens/cliente/TriajeScreen';
import CargaListProfileScreen from '../screens/cliente/CargaListProfileScreen';
import CargaAddScreen from '../screens/cliente/CargaAddScreen';
import CargaDetailScreen from '../screens/cliente/CargaDetailScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <View style={{flex: 1}} collapsable={false}>
      <Stack.Navigator>
        <Stack.Screen
          name='Dashboard'
          component={DashboardScreen}
          options={{
            title: 'Mis Perfil',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='HomeConsultas'
          component={ConsultasScreen}
          initialParams={{parent: 'home'}}
          options={{
            title: 'Mis Consultas',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='HomeConsultasDeatil'
          initialParams={{id: null}}
          component={ConsultasDetailScreen}
          options={{
            title: 'Detalle de Consulta',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='HomeVacunas'
          component={VacunasScreen}
          initialParams={{parent: 'home'}}
          options={{
            title: 'Mis Vacunas',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='HomeInstrumentos'
          component={InstrumentosScreen}
          initialParams={{parent: 'home'}}
          options={{
            title: 'Istrumentos de Pago',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='HomeTriaje'
          component={TriajeScreen}
          initialParams={{parent: 'home'}}
          options={{
            title: '',
            headerTransparent: true,
          }}
        />

        <Stack.Screen
          name='HomeCargaList'
          component={CargaListProfileScreen}
          initialParams={{parent: 'home'}}
          options={{
            title: '',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='HomeCargaAdd'
          component={CargaAddScreen}
          options={{
            title: '',
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name='HpomeCargaDetail'
          initialParams={{id: null}}
          component={CargaDetailScreen}
          options={{
            title: '',
            headerTransparent: true,
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default HomeStack;
