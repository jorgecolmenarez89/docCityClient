import {AuthorizationStatus} from '@notifee/react-native';
import React, {createContext, useEffect, useState} from 'react';
import notifee from '@notifee/react-native';
import {AppState, Platform} from 'react-native';
import {
  check,
  PERMISSIONS,
  request,
  openSettings,
} from 'react-native-permissions';
import {IS_ANDROID} from '../config/Constant';

const permissionInitialState = {
  loactionStatus: 'unavailable',
  notificationStatus: AuthorizationStatus.DENIED,
};

export const PermisionsContext = createContext({});

export const PermisionsProvider = ({children}) => {
  const [permissions, setPermissions] = useState(permissionInitialState);

  useEffect(() => {
    AppState.addEventListener('change', state => {
      checkLocationPermission();
      if (state !== 'active') {
        return;
      }
      checkLocationPermission();
    });
    askNotificationPermission();
  }, []);

  const askLocationPermission = async () => {
    let permissionStatus;
    if (Platform.OS === 'ios') {
      permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      permissionStatus = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
    }
    if (permissionStatus === 'blocked') {
      openSettings();
    }

    setPermissions({
      ...permissions,
      loactionStatus: permissionStatus,
    });
  };

  const askNotificationPermission = async () => {
    let permissionStatus;
    if (!IS_ANDROID) {
      const {authorizationStatus} = await notifee.requestPermission();
      permissionStatus = authorizationStatus;
      if (authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        console.log('Permission settings:', authorizationStatus);
      } else {
        console.log('User declined permissions');
      }
    } else {
      const {authorizationStatus} = await notifee.getNotificationSettings();
      permissionStatus = authorizationStatus;
    }

    if (permissionStatus === AuthorizationStatus.DENIED) {
      openSettings();
    }

    setPermissions({
      ...permissions,
      notificationStatus: permissionStatus,
    });
  };

  const checkLocationPermission = async () => {
    let permissionStatus;
    if (Platform.OS === 'ios') {
      permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
    setPermissions({
      ...permissions,
      loactionStatus: permissionStatus,
    });
  };

  return (
    <PermisionsContext.Provider
      value={{
        permissions,
        askLocationPermission,
        checkLocationPermission,
      }}>
      {children}
    </PermisionsContext.Provider>
  );
};
