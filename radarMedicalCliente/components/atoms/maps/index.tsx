import React, {ReactNode, useEffect, useRef} from 'react';
import {StyleSheet, Text, Linking, View, Image} from 'react-native';
import MapView, {
  Marker,
  MapMarkerProps,
  Region,
  LatLng,
  Callout,
} from 'react-native-maps';
import {Icon, useTheme} from '@rneui/themed';
import {useFocusEffect} from '@react-navigation/native';
import {Dialog} from '@rneui/themed';
import {useLocation} from '../../../hooks/useLocation';
import LoadingScreen from '../../../screens/LoadingScreen';
import {ASSETS, DEFAULT_REGION} from '../../../config/Constant';

enum EnumTypeMarker {
  doctor = 'doctor',
  user = 'user',
}

interface MarkerModel {
  coordinate: LatLng;
  type?: EnumTypeMarker;
  title?: string;
}

interface MapCustomProps {
  markers?: MarkerModel[];
  children?: ReactNode;
  // permite ubicar un markador en el centro del mapa
  isSearch?: boolean;
  onChangeLocation?: (region: Region) => void;
  renderBottom?: ReactNode;
}

const MapCustom = ({
  markers,
  children,
  isSearch,
  onChangeLocation,
  renderBottom,
}: MapCustomProps) => {
  const {theme} = useTheme();
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

  const onRegionChange = async (region: Region) => {
    console.log('onRegionChange() ==> region', {region});
    if (onChangeLocation) {
      onChangeLocation(region);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      centerPosition();
      return undefined;
    }, []),
  );

  useEffect(() => {
    if (hasLocation && !markers) {
      //centerPosition();
    }

    if (markers) {
      const coordinatesNew = markers.map(marker => ({
        ...marker.coordinate,
      }));
      console.log('effects', {coordinatesNew, mapViewRef});
      if (coordinatesNew) {
        mapViewRef.current?.fitToCoordinates(coordinatesNew, {
          animated: true,
          edgePadding: {top: 20, left: 20, right: 20, bottom: 20},
        });
      }
    }
  }, [hasLocation, markers]);

  return (
    <View
      style={{position: 'relative', width: '100%', height: '100%', flex: 1}}>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        onRegionChangeComplete={isSearch ? onRegionChange : undefined}
        initialRegion={{
          latitude: initialPosition.latitude,
          longitude: initialPosition.longitude,
          latitudeDelta: DEFAULT_REGION.latitudeDelta,
          longitudeDelta: DEFAULT_REGION.longitudeDelta,
        }}>
        {markers &&
          markers.length &&
          markers.map((marker, index) => {
            return (
              <Marker
                key={index}
                coordinate={marker.coordinate}
                title={marker.title}>
                <Image
                  source={
                    marker.type === EnumTypeMarker.doctor
                      ? ASSETS.doctorPin
                      : ASSETS.locationPin
                  }
                  style={{width: 50, height: 50}}
                />
              </Marker>
            );
          })}
        {!isSearch &&
          userLocation.longitude !== 0 &&
          userLocation.latitude !== 0 && (
            <Marker coordinate={userLocation}>
              <Image
                source={ASSETS.locationPin}
                style={{width: 40, height: 40}}
              />
            </Marker>
          )}
      </MapView>
      {isSearch && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          pointerEvents="box-none">
          <Image
            source={ASSETS.locationPin}
            style={{
              width: 40,
              height: 40,
              transform: [{translateY: -20}],
            }}
          />
        </View>
      )}
      <View style={styles.overlay} pointerEvents="box-none">
        {children}
      </View>

      <View style={styles.gps} pointerEvents="box-none">
        {isSearch && (
          <Icon
            name="gps-fixed"
            onPress={() => centerPosition()}
            type="material"
            reverse
            color={theme.colors.primary}
          />
        )}
        {renderBottom}
      </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  gps: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
  },
});

export default MapCustom;
