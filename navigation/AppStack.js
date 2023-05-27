import React, {useContext, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from '@rneui/themed';
import DashboardScreen from '../screens/cliente/DashboardScreen';
import SearchStack from '../navigation/SearchStack';
import ChatScreen from '../screens/cliente/ChatScreen';
import ProfileStack from '../navigation/ProfileStack';
import TriajeStack from '../navigation/TriajeStack';
import {AuthContext} from '../context/AuthContext';
import firestore from '@react-native-firebase/firestore';

const Tab = createBottomTabNavigator();

function AppStack() {
  const {userLoged, updateChats} = useContext(AuthContext);

  useEffect(() => {
    // Escuchar si cambia alguno de mis chats
    const subscriber = firestore()
      .collection('chats')
      .where('userId', '==', userLoged.id)
      .onSnapshot(documentsSnapshot => {
        documentsSnapshot.forEach(doc => {
          console.log('User data ' + doc.id + ' :', doc.data());
        });
      });
    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  useEffect(() => {
    let objectChat = null;
    let arrayChat = [];
    firestore()
      .collection('chats')
      .where('userId', '==', userLoged.id)
      .get()
      .then(querySnapshot => {
        console.log('Total users: ', querySnapshot.size);
        querySnapshot.forEach(documentSnapshot => {
          objectChat = {...documentSnapshot.data(), id: documentSnapshot.id};
          arrayChat.push(arrayChat);
        });
      });
    updateChats(arrayChat);
  }, []);

  return userLoged.isCompletedInfo ? (
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
        name='Chat'
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIcon: ({color, size}) => (
            <Icon name='chatbox-outline' color={color} size={size} type='ionicon' />
          ),
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
