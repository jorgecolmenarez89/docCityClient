import React, {useContext} from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Icon } from '@rneui/themed';
import LoadingScreen from '../screens/LoadingScreen';
import { PermisionsContext } from '../context/PermisionsContext';
import { AuthContext } from '../context/AuthContext';
import ClientStack from './ClientStack';

const Drawer = createDrawerNavigator();

export default function AppStackOld() {

  const { permissions } = useContext(PermisionsContext)
  const {logout, userLoged} =  useContext(AuthContext)

  console.log('permissions', permissions)

  if(permissions.loactionStatus === 'unavailable'){
    return <LoadingScreen />
  }

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
            backgroundColor: '#66bfc5',
            marginTop: -10  
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
            icon={({ focused, color, size }) => (
              <Icon type='ionicon' color={'#15193f'} size={size} name={focused ? 'map' : 'map-outline'} /> 
            )}
            labelStyle={{
              color: '#15193f',
              fontFamily: 'Poppins-Medium',
              marginLeft: -20
            }}
          />
          <DrawerItem
            label="Perfil"
            onPress={() => props.navigation.navigate('Profile')} 
            icon={({ focused, color, size }) => (
              <Icon type='ionicon' color={'#15193f'} size={size} name={focused ? 'settings' : 'settings-outline'} /> 
            )}
            labelStyle={{
              color: '#15193f',
              fontFamily: 'Poppins-Medium',
              marginLeft: -20
            }}
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
            backgroundColor: '#f6f6f6',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Icon type='ionicon' color={'#15193f'} size={22} name='log-out-outline' /> 
          <Text style={{ color: '#15193f', fontFamily: 'Poppins-Medium', marginLeft: 8 }} >
             Salir
          </Text>
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