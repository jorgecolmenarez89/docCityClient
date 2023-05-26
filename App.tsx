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
  darkColors: {
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
  mode: 'dark',
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
