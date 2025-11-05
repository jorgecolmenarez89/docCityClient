import React, {useContext} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthSatck from './AuthStack';
import AppStack from './AppStack';
import PaymentStack from './PaymentStack';
import {AuthContext} from '../context/AuthContext';
import {PREFIXES} from '../config/Constant';

const RootStack = createNativeStackNavigator();

const config = {
  screens: {
    Home: 'home',
    ChatsStack: {
      screens: {
        Chats: 'chats',
        Chat: 'chat/:id/:receiver',
      },
    },
    Profile: 'user',
  },
};

const linking = {
  prefixes: [PREFIXES.navigation],
  config,
};

const AppNav = () => {
  const {isLoading, userToken} = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      {userToken !== null ? (
        <RootStack.Navigator screenOptions={{headerShown: false}}>
          <RootStack.Screen name='MainApp' component={AppStack} />
          <RootStack.Screen
            name='PaymentStack'
            component={PaymentStack}
            options={{presentation: 'modal'}}
          />
        </RootStack.Navigator>
      ) : (
        <AuthSatck />
      )}
    </NavigationContainer>
  );
};

export default AppNav;
