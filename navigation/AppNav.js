import React, {useContext} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AuthSatck from './AuthStack';
import AppStack from './AppStack';
import {AuthContext} from '../context/AuthContext';
import {PREFIXES} from '../config/Constant';

const config = {
  screens: {
    Home: 'home',
    ChatsStack: {
      screens: {
        Chats: 'chats',
        Chat: 'chat/:id',
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
      {userToken !== null ? <AppStack /> : <AuthSatck />}
    </NavigationContainer>
  );
};

export default AppNav;
