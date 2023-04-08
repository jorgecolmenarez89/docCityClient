import * as React from 'react';
import { AuthProvider } from './context/AuthContext';
import { PermisionsProvider } from './context/PermisionsContext';
import AppNav from './navigation/AppNav';


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
