import React, {LegacyRef, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, Linking} from 'react-native';
import MapView, {Marker, MapMarkerProps} from 'react-native-maps';
import {useFocusEffect} from '@react-navigation/native';
import {Button, Dialog, CheckBox, ListItem, Avatar} from '@rneui/themed';
import {useLocation} from '../../../hooks/useLocation';
import LoadingScreen from '../../../screens/LoadingScreen';

interface MapCustomProps {
  markers?: MapMarkerProps[];
}

const MapCustom = ({markers}: MapCustomProps) => {
  const mapViewRef = useRef<MapView>(null);
  const {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    userLocation,
    errLocation,
    //followUserLocation,
    //stopFollowUserLocation,
  } = useLocation();

  const centerPosition = async () => {
    //console.log('centerPosition()1 ==>', true);
    const {latitude, longitude} = await getCurrentLocation();
    console.log('centerPosition() ==>', {latitude, longitude});
    mapViewRef.current?.animateCamera({
      center: {latitude, longitude},
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      centerPosition();
      return undefined;
    }, []),
  );

  useEffect(() => {
    centerPosition();
  }, [hasLocation]);

  return (
    <>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        initialRegion={{
          latitude: initialPosition.latitude,
          longitude: initialPosition.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {markers &&
          markers.length &&
          markers.map(marker => {
            return <Marker {...marker} />;
          })}
        {userLocation.longitude !== 0 && userLocation.latitude !== 0 && (
          <Marker coordinate={userLocation} pinColor="cyan" />
        )}
      </MapView>
      {!hasLocation && (
        <LoadingScreen
          styles={{
            ...StyleSheet.absoluteFillObject,
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      )}
      <Dialog
        isVisible={!!errLocation}
        onBackdropPress={() => {
          console.log('back');
        }}>
        <Dialog.Title titleStyle={{color: '#000'}} title="Activar Ubicación" />
        <Text style={{color: '#000'}}>
          Recuerde que para hacer uso de este modulo tiene que activar su
          ubicación
        </Text>
        <Dialog.Actions>
          <Dialog.Button
            title="Abrir Configuración"
            onPress={async () => {
              centerPosition();
              await Linking.sendIntent(
                'android.settings.LOCATION_SOURCE_SETTINGS',
              );
            }}
          />
        </Dialog.Actions>
      </Dialog>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapCustom;
