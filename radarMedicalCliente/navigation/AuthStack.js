import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Register from '../screens/auth/Register';
import Login from '../screens/auth/Login';
import VerifyEmail from '../screens/auth/VerifyEmail';
import ResetPassword from '../screens/auth/ResetPassword';

const Stack = createNativeStackNavigator();

function AuthSatck() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Register" component={Register} 
        options={{
          title: '',
          headerTransparent: true, 
        }}
      />
      <Stack.Screen name="VerifyEmail" component={VerifyEmail} 
        options={{
         title: '',
         headerTransparent: true, 
        }}
      />
      <Stack.Screen name="ResetPassword" component={ResetPassword} 
        initialParams={{ userName: '' }}
        options={{
          title: '',
          headerTransparent: true, 
        }}
      />
    </Stack.Navigator>
  );
}

export default AuthSatck;
