import { useEffect, useState, useRef } from 'react';
import Geolocation from '@react-native-community/geolocation';

export const useLocation = () => {

    const  [hasLocation, setHasLocation] = useState(false);
    //ubicacion inicial
    const  [initialPosition, setInitialPosition] = useState({
      latitude: 0,
      longitude: 0
    });
    //ubicacion cuando se mueve
    const  [userLocation, setuserLocation] = useState({
      latitude: 0,
      longitude: 0
    });

    const watchId = useRef(0);

    useEffect(() => {
      getCurrentLocation()
        .then( location =>{
          setInitialPosition(location);
          setuserLocation(location);
          setHasLocation(true)
        });
    }, [])

    const getCurrentLocation = () => { //obtenter la ubicacion actual del usaurio
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          ({ coords }) => {
            resolve({
              latitude:  coords.latitude,
              longitude: coords.longitude
            })
          },
          (err) => reject({ err }), {enableHighAccuracy: true}
        );
      })
    }

    const followUserLocation = () => { //si se mueve el usurio que el gps lo siga
      watchId.current = Geolocation.watchPosition(
        ({ coords }) => {
          console.log(coords)
          setuserLocation({
            latitude:  coords.latitude,
            longitude: coords.longitude
          })
        },
        (err) => console.log({ err }), {enableHighAccuracy: true, distanceFilter: 10}
      );
    }

    const stopFollowUserLocation = () => { //si se mueve el usurio que el gps lo siga
      if(watchId.current){
        Geolocation.clearWatch(watchId.current);
      }
    }

    //retornar si tiene la ubiacacion, la ubicacion inicial, y la ubicacion actual
    return {
      hasLocation,
      initialPosition,
      getCurrentLocation,
      followUserLocation,
      userLocation,
      stopFollowUserLocation
    }
}