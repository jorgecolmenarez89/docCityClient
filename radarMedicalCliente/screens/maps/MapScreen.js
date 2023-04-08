import React, {useContext} from 'react';
import { Button, View, Text } from 'react-native';
import Map from '../../components/Map';

function MapScreen({ navigation }) {

  const markers = [
    {
      image: require('../../assets/custom-marker.png'),
      coordinate: {
        latitude: 10.033562,
        longitude: -69.432115,
      },
      title: "test",
      description: "descirption"
    }
  ]

  return (
    <View style={{ flex: 1}}>
      <Map 
        markers={markers}
      />
    </View>
  );
}

export default MapScreen