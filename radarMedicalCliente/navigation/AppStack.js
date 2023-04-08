import React, {useContext} from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { ListItem, Icon } from '@rneui/themed';
import LoadingScreen from '../screens/LoadingScreen';
import { PermisionsContext } from '../context/PermisionsContext';
import DashboardScreen from '../screens/doctor/DashboardScreen';
import ProfileScreen from '../screens/doctor/ProfileScreen';
import UbicacionesStack from '../navigation/UbicacionesStack';
import CompleteInfoScreen from '../screens/doctor/CompleteInfoScreen';
import EjemploMapa from '../screens/doctor/EjemploMapa';
import HealthCentersStack from '../navigation/HealthCentersStack';
import { AuthContext } from '../context/AuthContext';
import ClientStack from '../navigation/ClientStack';

const Drawer = createDrawerNavigator();

export default function AppStack() {

  const { permissions } = useContext(PermisionsContext)
  const {logout, userLoged} =  useContext(AuthContext)
  /*if(permissions.loactionStatus === 'unavailable'){
    return <LoadingScreen />
  }*/

  const CustomDrawer = (props) => {
    return (
      <View style={{ flex: 1}}>
        <DrawerContentScrollView {...props}>
          <View style={{
            flexDirection: 'column', 
            justifyContent: 'center', 
            paddingHorizontal: 10,
            paddingVertical: 20,
            alignItems: 'center',
            backgroundColor: '#66bfc5'  
          }}>

            <Image 
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/147/147133.png'
              }}
              style={{
                width: 60, height: 60, borderRadius: 30,
              }}
            />

            <View style={{ width: '100%', marginTop: 10, display: 'flex', alignItems: 'center' }}>
              <Text style={{ color: '#ffffff' }}>{userLoged.fullName}</Text>
              <Text style={{ color: '#ffffff' }}>{userLoged.email}</Text>
            </View>
            
          </View>
          {/*<DrawerItemList {...props} /> */}
          <DrawerItem
            label="Busqueda"
            onPress={() => props.navigation.navigate('Search')}
          />
          <DrawerItem
            label="Perfil"
            onPress={() => props.navigation.navigate('Profile')}
          />
        </DrawerContentScrollView>
        <TouchableOpacity
          onPress={() => logout()}
          style={{
            position: 'absolute', 
            bottom: 20,
            right: 0,
            left : 0,
            padding: 20,
            backgroundColor: '#f6f6f6'
          }}
        >
          <Text > Salir</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <Drawer.Navigator 
      screenOptions={
        { headerShown: false }
      }
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      {userLoged.isAuthorizedDoctor &&
        <Drawer.Screen 
          name="ClientesScreen" 
          component={ClientStack} 
          options={{ drawerLabel: 'Home', title: 'Clientes' }}
        />
      }
      {/*
        (permissions.loactionStatus === 'granted')
          ? <Drawer.Screen name="MapScreen" component={MapScreen} 
              options={{
                headerShown: false,
              }}
            />
          : <Drawer.Screen name="PermisionScreen" component={PermisionScreen} />
      */}
    </Drawer.Navigator>
  );
}