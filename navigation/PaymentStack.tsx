import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PaymentMethodsScreen from '../screens/cliente/PaymentMethodsScreen';
import PaymentFormScreen from '../screens/cliente/PaymentFormScreen';

const Stack = createNativeStackNavigator();

const PaymentStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='PaymentMethods'
        component={PaymentMethodsScreen}
        options={{
          title: 'Métodos de Pago',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name='PaymentForm'
        component={PaymentFormScreen}
        options={{
          title: 'Generar Pago',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default PaymentStack;
