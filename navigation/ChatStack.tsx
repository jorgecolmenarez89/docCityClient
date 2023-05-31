import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatScreen from '../screens/cliente/ChatScreen';
import ChatsScreen from '../screens/cliente/ChatsScreen';

const Stack = createNativeStackNavigator();

const ChatStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Chats'
        component={ChatsScreen}
        options={{
          title: 'Mis Chats',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          title: 'Chat',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatStack;
