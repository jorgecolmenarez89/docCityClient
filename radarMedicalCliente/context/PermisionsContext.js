import React, {createContext, useEffect, useState} from 'react';
import { AppState, Platform } from 'react-native';
import {check, PERMISSIONS, request, openSettings } from 'react-native-permissions';

const permissionInitialState = {
  loactionStatus: 'unavailable',
}

export const PermisionsContext = createContext({})

export const PermisionsProvider = ({children}) => {
  const [permissions, setPermissions] = useState(permissionInitialState)

  useEffect(() => {
    AppState.addEventListener('change', state =>{
      checkLocationPermission();
      if(state !== 'active') return;
      checkLocationPermission();
    })
  },[])

  const  askLocationPermission = async() => {
    let permissionStatus;
    if(Platform.OS === 'ios'){
      permissionStatus =  await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      permissionStatus =  await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
    if(permissionStatus === 'blocked'){
      openSettings();
    }

    setPermissions({
      ...permissions,
      loactionStatus: permissionStatus
    })
  };


  const checkLocationPermission = async() => {
    let permissionStatus;
    if(Platform.OS === 'ios'){
      permissionStatus =  await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      permissionStatus =  await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
    setPermissions({
      ...permissions,
      loactionStatus: permissionStatus
    })
  };

  return (
    <PermisionsContext.Provider value={{
      permissions,
      askLocationPermission,
      checkLocationPermission
    }}>
      {children}
    </PermisionsContext.Provider>
  )
}