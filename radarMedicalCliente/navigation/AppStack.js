import React, {useContext} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import DashboardScreen from '../screens/cliente/DashboardScreen';
import SearchStack from '../navigation/SearchStack';
import ChatScreen from '../screens/cliente/ChatScreen';
import ProfileStack from '../navigation/ProfileStack';
import TriajeStack from '../navigation/TriajeStack';
import { AuthContext } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

function AppStack() {

  const {userLoged} =  useContext(AuthContext)

  return userLoged.isAuthorizedDoctor ? (
    <Tab.Navigator
      screenOptions={{
        headerShown:false,
        tabBarStyle: {
          height: 60,
          backgroundColor: '#cdcdcd',
        },
        tabBarActiveTintColor: '#0b445e',
        abBarInactiveTintColor: '#7d7d7d',
      }}
    >
      <Tab.Screen name="Home" component={DashboardScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarLabelStyle:{
            fontSize: 12
          },
          tabBarIcon: ({ color, size }) => (
            <Icon 
              name="home-outline"
              color={color} size={size} 
              type="ionicon"
						/>
          ),
        }}
      />
			<Tab.Screen name="Search" component={SearchStack} 
        options={{
          tabBarLabel: 'Encontrar',
          tabBarLabelStyle:{
            fontSize: 12
          },
          tabBarIcon: ({ color, size }) => (
            <Icon 
              name="location-outline"
              color={color} size={size} 
              type="ionicon"
						/>
          ),
        }}
      />
      <Tab.Screen name="Chat" component={ChatScreen} 
        options={{
          tabBarLabel: 'Chat',
          tabBarLabelStyle:{
            fontSize: 12
          },
          tabBarIcon: ({ color, size }) => (
            <Icon 
              name="chatbox-outline"
              color={color} size={size} 
              type="ionicon"
						/>
          ),
        }}
      />
      <Tab.Screen name="Profile" component={ProfileStack} 
        options={{
          tabBarLabel: 'Perfil',
          tabBarLabelStyle:{
            fontSize: 12,
          },
          tabBarIcon: ({ color, size }) => (
            <Icon 
              name="person-outline"
              color={color} size={size} 
              type="ionicon"
						/>
          ),
        }}
      />
    </Tab.Navigator>
  ) : (
    <TriajeStack />
  );
}

export default AppStack