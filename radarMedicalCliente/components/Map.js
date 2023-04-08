import React, { useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { useLocation } from '../hooks/useLocation';
import LoadingScreen from '../screens/LoadingScreen';
import Fab from './Fab'; 

const Map = ({ markers }) => {

  const {
    hasLocation, 
    initialPosition, 
    getCurrentLocation, 
    followUserLocation,
    userLocation,
    stopFollowUserLocation
  } = useLocation();

  const mapViewRef = useRef(null);
  const following = useRef(true);

  useEffect(()=>{ //lanzar watch  escuchar cuando la persona se mueve y obrener las coordedanas
    followUserLocation();
    return() => {
      stopFollowUserLocation()
    }
  }, [])

  useEffect(()=> { //se ejecuta valor cuando se mueve el dispositivo
    if(!mapViewRef.current || !following.current ) return;
    const { latitude, longitude } = userLocation;
    mapViewRef.current.animateCamera({
      center: { latitude, longitude }
    });
  }, [userLocation])

  const centerPosition = async() => {
    const { latitude, longitude } = await getCurrentLocation()
    following.current = true;
    mapViewRef.current.animateCamera({
      center: { latitude, longitude }
    });
  }

  if(!hasLocation){
    return <LoadingScreen />
  }

  return (
    <>
      <MapView
        ref={(el) => mapViewRef.current = el}
        style={{ flex: 1 }}
        //provider={PROVIDER_GOOGLE}
        showsUserLocation
        initialRegion={{
          latitude: initialPosition.latitude,
          longitude: initialPosition.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onTouchStart={() => following.current = false}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            image={marker.image}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
      <Fab 
        iconName="compass-outline"
        onPress={centerPosition}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20
        }}
      />
    </>
  );
}

export default Map