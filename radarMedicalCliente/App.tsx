import React, { useEffect }  from 'react';
import { AuthProvider } from './context/AuthContext';
import { PermisionsProvider } from './context/PermisionsContext';
import AppNav from './navigation/AppNav';
import messaging from '@react-native-firebase/messaging';


function App() {

  useEffect(() => {
    
    const foregroundSubscriber = messaging().onMessage(
      async (remoteMessage) => {
        console.log('Nueva notificacion recibida', remoteMessage);
      }
    );

    const topicSubscriber = messaging()
      .subscribeToTopic('veidthealth')
      .then(()=> console.log('Subscrito al topico veidthealth'));

    const backgroundSubscriber = messaging().setBackgroundMessageHandler(
      async (remoteMessage) => {
        console.log('Nueva notificacion recibida! in Background', remoteMessage);
      }
    )

    messaging()
    .getToken()
    .then(token => {
      console.log(token);
    });
  
    return () => {
      foregroundSubscriber();
      topicSubscriber();
      backgroundSubscriber();
    }
  }, []);

  return (
    <AuthProvider>
      <PermisionsProvider>
        <AppNav />
      </PermisionsProvider>
    </AuthProvider>
  );
}

export default App;
