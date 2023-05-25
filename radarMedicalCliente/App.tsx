import React, {useEffect} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {ThemeProvider, createTheme} from '@rneui/themed';
import {AuthProvider} from './context/AuthContext';
import {PermisionsProvider} from './context/PermisionsContext';
import AppNav from './navigation/AppNav';

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'auto',
  locationProvider: 'auto',
});

const theme = createTheme({
  lightColors: {
    primary: '#003752',
  },
  mode: 'light',
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <PermisionsProvider>
          <AppNav />
        </PermisionsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
