import React, {useEffect, useRef} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {useLocation} from '../hooks/useLocation';
import LoadingScreen from '../screens/LoadingScreen';
import {Image} from '@rneui/themed';

const SingleMap = ({
  markers,
  onPress,
  onRegionChange,
  initialRegion,
  onDragEnd,
  draggableMarker,
  showsUserLocation,
}) => {
  const {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    followUserLocation,
    userLocation,
    stopFollowUserLocation,
  } = useLocation();

  const mapViewRef = useRef(null);
  const following = useRef(true);

  const centerPosition = async () => {
    const {latitude, longitude} = await getCurrentLocation();
    following.current = true;
    mapViewRef.current.animateCamera({
      center: {latitude, longitude},
    });
  };

  const getInitialRegion = () => {
    return {
      latitude: initialPosition.latitude,
      longitude: initialPosition.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  };

  if (!hasLocation) {
    return <LoadingScreen />;
  }

  return (
    <>
      <MapView
        ref={el => (mapViewRef.current = el)}
        style={{flex: 1}}
        //provider={PROVIDER_GOOGLE}
        showsUserLocation={showsUserLocation ? showsUserLocation : false}
        initialRegion={initialRegion ? initialRegion : getInitialRegion()}
        onTouchStart={() => (following.current = false)}
        onRegionChange={e => onRegionChange(e)}
        onPress={e => onPress(e)}>
        {markers.map((marker, index) => (
          <Marker
            draggable={draggableMarker ? draggableMarker : false}
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            onDragEnd={e => {
              onDragEnd(e);
            }}>
            <Image source={marker.image} style={{width: 64, height: 64}} resizeMode='contain' />
          </Marker>
        ))}
      </MapView>
    </>
  );
};

export default SingleMap;
