import React from 'react';
import {NativeBaseProvider} from 'native-base';

import {ThemeProvider, createTheme} from '@rneui/themed';
import {AuthProvider} from './context/AuthContext';
import {PermisionsProvider} from './context/PermisionsContext';
import AppNav from './navigation/AppNav';
import ChatContextProvider from './context/ChatContext';

const theme = createTheme({
  lightColors: {
    primary: '#003752',
    secondary: '#056269',
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
          <ChatContextProvider>
            <PermisionsProvider>
              <AppNav />
            </PermisionsProvider>
          </ChatContextProvider>
        </AuthProvider>
      </ThemeProvider>
    </NativeBaseProvider>
  );
}

export default App;
