import React, {useEffect} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {NativeBaseProvider} from 'native-base';

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
  components: {
    Text: {
      style: {
        color: '#000',
      },
    },
    Button: {
      color: 'primary',
      radius: 'md',
      raised: true,
    },
  },
  mode: 'light',
});

function App() {
  return (
    <NativeBaseProvider>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <PermisionsProvider>
            <AppNav />
          </PermisionsProvider>
        </AuthProvider>
      </ThemeProvider>
    </NativeBaseProvider>
  );
}

export default App;
