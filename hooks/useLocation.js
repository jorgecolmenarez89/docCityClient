import {useEffect, useState, useRef} from 'react';
//import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';

export const useLocation = () => {
  const [hasLocation, setHasLocation] = useState(false);
  //ubicacion inicial
  const [initialPosition, setInitialPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  //ubicacion cuando se mueve
  const [userLocation, setuserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [errLocation, setErrLocation] = useState();

  const watchId = useRef(0);

  const getCurrentLocation = async () => {
    //obtenter la ubicacion actual del usaurio
    //console.log('useLocation() 2 => ', true);
    setErrLocation(undefined);
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        ({coords}) => {
          //console.log('getCurrentPosition() 4 =>', {coords});
          setHasLocation(true);
          setuserLocation(coords);
          resolve({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
        },
        err => {
          //console.log('getCurrentLocation() ==> err =>', {err});
          setHasLocation(false);
          reject({err});
        },
        {
          enableHighAccuracy: true,
          timeout: 60000,
          interval: 1000,
          fastestInterval: 100,
          maximumAge: 10000,
        },
      );
    });
  };

  const followUserLocation = () => {
    //si se mueve el usurio que el gps lo sigaimport {
    watchId.current = Geolocation.watchPosition(
      ({coords}) => {
        //console.log(coords);
        setuserLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      },
      err => console.log({err}),
      {enableHighAccuracy: true, distanceFilter: 10},
    );
  };

  const stopFollowUserLocation = () => {
    //si se mueve el usurio que el gps lo siga
    if (watchId.current) {
      Geolocation.clearWatch(watchId.current);
    }
  };

  useEffect(() => {
    getCurrentLocation()
      .then(location => {
        //console.log('getCurrentLocation() => location ==>', {location});
        setInitialPosition(location);
        setuserLocation(location);
      })
      .catch(async ({err}) => {
        //console.log('getCurrentLocation() => err ==>', {err});
        setErrLocation({msg: err.message, code: err.code});
      });
  }, []);

  //retornar si tiene la ubiacacion, la ubicacion inicial, y la ubicacion actual
  return {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    followUserLocation,
    userLocation,
    stopFollowUserLocation,
    errLocation,
  };
};
