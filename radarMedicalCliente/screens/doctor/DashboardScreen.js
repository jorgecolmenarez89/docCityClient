import React from 'react';
import { Button, View, Text } from 'react-native';
import MenuButton from '../../components/MenuButton'; 
import { ListItem, Avatar } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';

function DashboardScreen({ navigation }) {

  return (
    <View style={{ flex: 1}}>

      <View style={{ height: 50 }}>
        <MenuButton 
          iconName="menu-outline"
          onPress={() => {navigation.toggleDrawer()}}
          style={{
            position: 'absolute',
            top: 10,
            left: 20
          }}
        />
      </View>

      <View style={{ marginHorizontal: 20, marginTop: 20}}>

        <ListItem
          linearGradientProps={{
            colors: ['#FF9800', '#F44336'],
            start: { x: 1, y: 0 },
            end: { x: 0.2, y: 0 },
          }}
          ViewComponent={LinearGradient}
          containerStyle={{
            marginBottom: 20
          }}
        >
          <Avatar
            rounded
            source={{ uri: 'https://randomuser.me/api/portraits/men/33.jpg' }}
          />
          <ListItem.Content>
            <ListItem.Title style={{ color: 'white', fontWeight: 'bold' }}>
              Chris Jackson
            </ListItem.Title>
            <ListItem.Subtitle style={{ color: 'white' }}>
              Mejor Cliente
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron color="white" />
        </ListItem>

        <ListItem
          linearGradientProps={{
            colors: ['#090979', '#00d4ff'],
            start: { x: 1, y: 0 },
            end: { x: 0.2, y: 0 },
          }}
          ViewComponent={LinearGradient}
          containerStyle={{
            marginBottom: 20
          }}
        >
          <Avatar
            rounded
            source={{ uri: 'https://randomuser.me/api/portraits/men/33.jpg' }}
          />
          <ListItem.Content>
            <ListItem.Title style={{ color: 'white', fontWeight: 'bold' }}>
              Raul Arias
            </ListItem.Title>
            <ListItem.Subtitle style={{ color: 'white' }}>
              Vice Chairman
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron color="white" />
        </ListItem>

        <ListItem
          linearGradientProps={{
            colors: ['#b613f1', '#390785'],
            start: { x: 1, y: 0 },
            end: { x: 0.2, y: 0 },
          }}
          ViewComponent={LinearGradient}
          containerStyle={{
            marginBottom: 20
          }}
        >
          <Avatar
            rounded
            source={{ uri: 'https://randomuser.me/api/portraits/men/33.jpg' }}
          />
          <ListItem.Content>
            <ListItem.Title style={{ color: 'white', fontWeight: 'bold' }}>
              Chris Tucker
            </ListItem.Title>
            <ListItem.Subtitle style={{ color: 'white' }}>
              Vice Chairman
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron color="white" />
        </ListItem>

      </View>

    </View>
  );
}

export default DashboardScreen