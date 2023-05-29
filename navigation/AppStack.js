import React, {useContext, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from '@rneui/themed';
import DashboardScreen from '../screens/cliente/DashboardScreen';
import SearchStack from '../navigation/SearchStack';
import ChatsScreen from '../screens/cliente/ChatsScreen';
import ProfileStack from '../navigation/ProfileStack';
import TriajeStack from '../navigation/TriajeStack';
import {AuthContext} from '../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import {ChatContext} from '../context/ChatContext';
import Chat from '../models/Chat';
import ChatStack from './ChatStack';
import {NavigationRoutes} from '../config/Enum';
import {getFocusedRouteNameFromRoute, useNavigation} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

function showTab(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? NavigationRoutes.chat;

  switch (routeName) {
    case NavigationRoutes.chat:
      return {display: 'none'};
    default:
      return {display: 'flex'};
  }
}

function AppStack() {
  const {userLoged, onUpdateNavigation} = useContext(AuthContext);
  const {chats, notifications, updateNotifications, updateChats} = useContext(ChatContext);
  const navigation = useNavigation();

  useEffect(() => {
    // Escuchar si cambia alguno de mis chats
    const subscriber = firestore()
      .collection('chats')
      .where('userId', '==', userLoged.id)
      .onSnapshot(documentsSnapshot => {
        documentsSnapshot.forEach(doc => {
          const indexChat = chats.findIndex(chat => chat.data.id === doc.id);
          console.log('User data ' + doc.id + ' :', doc.data());
          updateNotifications(notifications + 1);
          if (indexChat === -1) {
            updateChats([
              ...chats,
              new Chat(Chat.formatData({data: {...doc.data(), id: doc.id}, userLog: userLoged})),
            ]);
          } else {
            chats[indexChat] = new Chat(
              Chat.formatData({data: {...doc.data(), id: doc.id}, userLog: userLoged}),
            );
            updateChats(chats);
          }
        });
      });
    onUpdateNavigation(navigation);
    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  return !userLoged.isCompletedInfo ? (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: '#cdcdcd',
        },
        tabBarActiveTintColor: '#0b445e',
        abBarInactiveTintColor: '#7d7d7d',
      }}>
      <Tab.Screen
        name='Home'
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIcon: ({color, size}) => (
            <Icon name='home-outline' color={color} size={size} type='ionicon' />
          ),
        }}
      />
      <Tab.Screen
        name='Search'
        component={SearchStack}
        options={{
          tabBarLabel: 'Encontrar',
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIcon: ({color, size}) => (
            <Icon name='location-outline' color={color} size={size} type='ionicon' />
          ),
        }}
      />
      <Tab.Screen
        name='ChatsStack'
        component={ChatStack}
        options={({route, navigation}) => {
          const newOptions = {
            tabBarLabel: 'Chats',
            tabBarBadge: notifications,
            tabBarLabelStyle: {
              fontSize: 12,
            },
            tabBarIcon: ({color, size}) => (
              <Icon name='chatbox-outline' color={color} size={size} type='ionicon' />
            ),
            tabBarStyle: showTab(route),
          };

          return newOptions;
        }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileStack}
        options={{
          tabBarLabel: 'Perfil',
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIcon: ({color, size}) => (
            <Icon name='person-outline' color={color} size={size} type='ionicon' />
          ),
        }}
      />
    </Tab.Navigator>
  ) : (
    <TriajeStack />
  );
}

export default AppStack;
