import React from 'react';
import Geolocation from '@react-native-community/geolocation';

import {AuthProvider} from './context/AuthContext';
import {PermisionsProvider} from './context/PermisionsContext';
import AppNav from './navigation/AppNav';

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'auto',
  locationProvider: 'auto',
});

function App() {
  return (
    <AuthProvider>
      <PermisionsProvider>
        <AppNav />
      </PermisionsProvider>
    </AuthProvider>
  );
}

export default App;
