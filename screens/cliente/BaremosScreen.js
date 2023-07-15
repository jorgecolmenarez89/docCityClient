import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import MapView from 'react-native-maps';
import MenuButton from '../../components/MenuButton';
import {useLocation} from '../../hooks/useLocation';
import Fab from '../../components/Fab';

const deviceHeight = Dimensions.get('window').height;
const widthHeight = Dimensions.get('window').width;

function BaremosScreen({navigation}) {
  rerturn(
    <View style={styles.container}>
      <Text>BaremosScreen</Text>
    </View>,
  );
}

export default BaremosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerMap: {
    ...StyleSheet.absoluteFillObject,
    height: deviceHeight,
    width: widthHeight,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonMenu: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
});
